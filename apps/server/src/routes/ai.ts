import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface RecipeContext {
  id?: string;
  title: string;
  englishTitle?: string | null;
  mainIngredient?: string;
  cutOrType?: string;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  ingredients?: Array<{ name: string; amount?: number; unit?: string }>;
  steps?: Array<{ stepNumber: number; instruction: string; tips?: string | null }>;
}

interface ChatBody {
  message: string;
  history?: ChatMessage[];
  recipeContext?: RecipeContext;
}

const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.5-flash-lite',
];

const CHEF_SYSTEM_INSTRUCTION = `You are Chef Dex, an expert, passionate, and friendly master Filipino Chef and cooking mentor inside KusinaDex—a curated food and cooking app featuring 435 authentic Filipino dishes and comforting noodle bowls (including traditional Ramen).

Your Mission & Expertise:
1. Culinary Mentor: Guide home cooks of all skill levels on authentic Filipino cooking techniques (sangkutsa, gisa, tusta, broth clarification, braising, balancing sour-salty-sweet flavors).
2. Ingredient Substitutions & Measurements: Provide practical kitchen math and alternatives (e.g. 1 lemon = 2-3 tbsp juice = 6-8 calamansi; for 500-600g Pork Steak Pair, recommend 10-12 calamansi; bagoong -> anchovy paste/miso, cane vinegar -> cider vinegar).
3. Recipe Guidance: Help users understand recipes inside KusinaDex (Sinigang, Adobo, Bulalo, Kare-Kare, Lechon Kawali, Crispy Pata, Sisig, Beef Pares, Inasal, and authentic Ramen bowls like Tonkotsu, Tantanmen, Shoyu, Pares Ramen).
4. Kitchen Troubleshooting: Diagnose issues like tough meat, cloudy broth, over-salted soup, bitter garlic, or skin that won't crisp up.
5. "Ref Rescue" / Pantry Ideas: Suggest dishes to cook based on what ingredients the user has.

Style Guidelines:
- Warm, enthusiastic, and welcoming ("Mabuhay! Chef Dex here!").
- When answering exact ingredient amounts, state the exact number right away in the first sentence (e.g. "Cut **10 to 12 pieces of calamansi**!").
- Format answers cleanly with bullet points or numbered steps so they are effortless to read while cooking on a phone.
- Speak primarily in clear English, with beloved Pinoy kitchen terms (e.g. gisa, sangkutsa, timpla, sabaw). If the user writes in Tagalog or Taglish, reply warmly in Taglish.
- Keep answers focused, practical, and punchy.
- If a recipeContext is provided, ground your answer directly in that dish's ingredients and steps!`;

export async function aiRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  fastify.post('/api/ai/chat', async (request: FastifyRequest<{ Body: ChatBody }>, reply: FastifyReply) => {
    const { message, history = [], recipeContext } = request.body || {};

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return reply.status(400).send({
        success: false,
        error: 'Message is required',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return reply.status(500).send({
        success: false,
        error: 'GEMINI_API_KEY is not configured on the server. Please add it to your environment variables.',
      });
    }

    // Format history for Gemini API
    const formattedContents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Add previous messages (capped at last 10 messages for speed & context window)
    const recentHistory = history.slice(-10);
    for (const h of recentHistory) {
      formattedContents.push({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text }],
      });
    }

    // Prepare current user prompt with recipe context if present
    let currentPrompt = message.trim();
    if (recipeContext) {
      const ingList = recipeContext.ingredients?.map((i) => `- ${i.amount || ''} ${i.unit || ''} ${i.name}`).join('\n') || '';
      const stepList = recipeContext.steps?.map((s) => `${s.stepNumber}. ${s.instruction}`).join('\n') || '';

      currentPrompt = `[Context: The user is currently viewing the recipe for "${recipeContext.title}" (${recipeContext.englishTitle || ''}).
Main ingredient: ${recipeContext.mainIngredient || 'N/A'}, Cut: ${recipeContext.cutOrType || 'N/A'}.
Ingredients:\n${ingList}
Steps:\n${stepList}]

User's Question: ${message}`;
    }

    formattedContents.push({
      role: 'user',
      parts: [{ text: currentPrompt }],
    });

    const requestPayload = JSON.stringify({
      systemInstruction: {
        parts: [{ text: CHEF_SYSTEM_INSTRUCTION }],
      },
      contents: formattedContents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    // Multi-Model Resilience: Loop through candidate models if one encounters temporary high demand (503/429)
    let lastError = '';
    for (const model of CANDIDATE_MODELS) {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestPayload,
        });

        if (response.ok) {
          const data = (await response.json()) as any;
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return reply.send({
              success: true,
              reply: replyText,
              modelUsed: model,
            });
          }
        }

        const errText = await response.text();
        lastError = `Model ${model} returned ${response.status}: ${errText}`;
        fastify.log.warn(`Chef Dex fallback triggered: ${lastError}`);

        // If error is high demand (503) or rate limit (429), try next model immediately
        if (response.status === 503 || response.status === 429) {
          continue;
        }
      } catch (err: any) {
        lastError = `Model ${model} network exception: ${err.message}`;
        fastify.log.warn(`Chef Dex network exception on ${model}: ${err.message}`);
      }
    }

    fastify.log.error(`All Gemini models failed: ${lastError}`);
    return reply.status(502).send({
      success: false,
      error: 'Chef Dex is momentarily tasting the sauce! Please ask your question once more in just a few seconds.',
    });
  });
}
