import { Platform } from 'react-native';
import { Recipe, Category, PaginatedResponse } from '@kusinadex/types';
import { SEEDED_CATEGORIES, SEEDED_RECIPES } from './fallbackData';

declare const process: { env?: Record<string, string | undefined> };

// Default Fastify backend endpoint
const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
export let API_BASE_URL = process.env?.EXPO_PUBLIC_API_URL || DEFAULT_HOST;

export function setApiBaseUrl(url: string) {
  API_BASE_URL = url;
}

export const FALLBACK_CATEGORIES: Category[] = SEEDED_CATEGORIES;
export const FALLBACK_RECIPES: Recipe[] = SEEDED_RECIPES;

// High-speed In-Memory Cache with 60s TTL to prevent repeat loading
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 60 * 1000;

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCached<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Network request wrapper with customizable timeout
async function fetchWithTimeout(url: string, timeoutMs = 3000, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  const cacheKey = 'categories';
  const cached = getCached<Category[]>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/categories`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    setCached(cacheKey, json.data);
    return json.data;
  } catch (error) {
    console.warn('Backend categories unavailable, using instant fallback:', error);
    setCached(cacheKey, FALLBACK_CATEGORIES);
    return FALLBACK_CATEGORIES;
  }
}

export async function fetchRecipes(params?: {
  categoryId?: string;
  search?: string;
  region?: string;
  featured?: boolean;
  mainIngredient?: string;
  cutOrType?: string;
  subCategory?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Recipe>> {
  const query = new URLSearchParams();
  if (params?.categoryId) query.append('categoryId', params.categoryId);
  if (params?.search) query.append('search', params.search);
  if (params?.region) query.append('region', params.region);
  if (params?.featured !== undefined) query.append('featured', String(params.featured));
  if (params?.mainIngredient) query.append('mainIngredient', params.mainIngredient);
  if (params?.cutOrType) query.append('cutOrType', params.cutOrType);
  if (params?.subCategory) query.append('subCategory', params.subCategory);
  if (params?.page) query.append('page', String(params.page));
    query.append('limit', String(params?.limit || 20));

  const cacheKey = `recipes?${query.toString()}`;
  const cached = getCached<PaginatedResponse<Recipe>>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/recipes?${query.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    setCached(cacheKey, json.data);
    return json.data;
  } catch (error) {
    console.warn('Backend recipes unavailable, using instant fallback:', error);
    let filtered = [...FALLBACK_RECIPES];

    if (params?.categoryId) {
      filtered = filtered.filter(
        (r) => r.categoryId === params.categoryId || r.category?.slug === params.categoryId
      );
    }

    if (params?.mainIngredient) {
      filtered = filtered.filter(
        (r) => r.mainIngredient?.toLowerCase() === params.mainIngredient?.toLowerCase()
      );
    }

    const cutFilter = params?.cutOrType || params?.subCategory;
    if (cutFilter) {
      const cLower = cutFilter.toLowerCase();
      filtered = filtered.filter((r) => r.cutOrType?.toLowerCase().includes(cLower));
    }

    if (params?.region) {
      filtered = filtered.filter((r) =>
        r.originRegion.toLowerCase().includes(params.region!.toLowerCase())
      );
    }

    if (params?.featured) {
      filtered = filtered.filter((r) => r.featured);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.englishTitle && r.englishTitle.toLowerCase().includes(q)) ||
          r.description.toLowerCase().includes(q) ||
          r.originRegion.toLowerCase().includes(q) ||
          (r.cutOrType && r.cutOrType.toLowerCase().includes(q)) ||
          r.ingredients?.some((i) => i.name.toLowerCase().includes(q))
      );
    }

    const pageNum = params?.page || 1;
    const limitNum = params?.limit || 20;
    const skip = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(skip, skip + limitNum);

    const result: PaginatedResponse<Recipe> = {
      items: paginated,
      total: filtered.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(filtered.length / limitNum),
      hasMore: skip + paginated.length < filtered.length,
    };
    setCached(cacheKey, result);
    return result;
  }
}

export async function fetchFeaturedRecipes(): Promise<Recipe[]> {
  const cacheKey = 'recipes/featured';
  const cached = getCached<Recipe[]>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/recipes/featured`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    setCached(cacheKey, json.data);
    return json.data;
  } catch (error) {
    console.warn('Backend featured recipes unavailable, using instant fallback:', error);
    const result = FALLBACK_RECIPES.filter((r) => r.featured);
    setCached(cacheKey, result);
    return result;
  }
}

export async function fetchRecipeById(id: string): Promise<Recipe | null> {
  const cacheKey = `recipe/${id}`;
  const cached = getCached<Recipe>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/recipes/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.data) {
      setCached(cacheKey, json.data);
    }
    return json.data;
  } catch (error) {
    console.warn(`Backend recipe ${id} unavailable, using instant fallback:`, error);
    const found = FALLBACK_RECIPES.find((r) => r.id === id || r.slug === id) || null;
    if (found) {
      setCached(cacheKey, found);
    }
    return found;
  }
}

export async function searchRecipesApi(query: string, category?: string): Promise<Recipe[]> {
  const cacheKey = `search?q=${query}&cat=${category || ''}`;
  const cached = getCached<Recipe[]>(cacheKey);
  if (cached) return cached;

  try {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);

    const res = await fetchWithTimeout(`${API_BASE_URL}/api/search?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    setCached(cacheKey, json.data);
    return json.data;
  } catch (error) {
    console.warn('Backend search unavailable, searching instant fallback:', error);
    const q = query.toLowerCase();
    const filtered = FALLBACK_RECIPES.filter((r) => {
      const matchText =
        r.title.toLowerCase().includes(q) ||
        (r.englishTitle && r.englishTitle.toLowerCase().includes(q)) ||
        r.description.toLowerCase().includes(q) ||
        r.originRegion.toLowerCase().includes(q) ||
        (r.cutOrType && r.cutOrType.toLowerCase().includes(q)) ||
        r.ingredients?.some((i) => i.name.toLowerCase().includes(q));
      const matchCat = category
        ? r.categoryId === category || r.category?.slug === category
        : true;
      return matchText && matchCat;
    });
    setCached(cacheKey, filtered);
    return filtered;
  }
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export async function askChefAiApi(params: {
  message: string;
  history?: ChatMessage[];
  recipeContext?: any;
}): Promise<string> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/ai/chat`, 15000, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const json = await res.json();
    return json.reply;
  } catch (error: any) {
    console.error('Chef AI API error:', error);
    throw new Error(error.message || 'Chef Dex could not be reached. Please check your internet connection.');
  }
}
