import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { ChefHat, Send, Sparkles, Trash2 } from 'lucide-react-native';
import { Recipe } from '@kusinadex/types';
import { askChefAiApi, ChatMessage } from '../services/api';
import { colors } from '../theme/colors';

interface RecipeChefChatProps {
  recipe: Recipe;
}

interface MessageItem {
  id: string;
  role: 'user' | 'model';
  text: string;
  time: string;
}

export const RecipeChefChat: React.FC<RecipeChefChatProps> = ({ recipe }) => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Mabuhay! Chef Dex here! 👨‍🍳\n\nI'm ready to assist you specifically with cooking **${recipe.title}**! Ask me about ingredient substitutes, how to check for doneness, heat control, or kitchen hacks!`,
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Generate dynamic contextual suggestions for this exact dish
  const firstIngredient = recipe.ingredients?.[0]?.name || 'the main protein';
  const quickQuestions = [
    `What can I substitute for ${firstIngredient.slice(0, 20)}?`,
    'How do I know when the meat is tender enough?',
    'Any tips to make the flavor extra rich?',
    'Can I store or freeze the leftovers?',
  ];

  const handleSend = async (questionText?: string) => {
    const query = (questionText || inputText).trim();
    if (!query || isLoading) return;

    const userMessage: MessageItem = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const history: ChatMessage[] = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const reply = await askChefAiApi({
        message: query,
        history,
        recipeContext: recipe,
      });

      const aiMessage: MessageItem = {
        id: `ai_${Date.now()}`,
        role: 'model',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMsg: MessageItem = {
        id: `err_${Date.now()}`,
        role: 'model',
        text: 'Naku! Something went wrong in the kitchen. Please check your connection and try asking again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        role: 'model',
        text: `Kitchen chalkboard wiped clean! What else can I help you with for **${recipe.title}**? 🍲`,
        time: 'Just now',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header Strip */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.chefBadge}>
            <ChefHat size={18} color="#FFFFFF" />
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.chefName}>Chef Dex Live</Text>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Tuned to this dish</Text>
            </View>
            <Text style={styles.subText}>Ask anything while you cook</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleClear} style={styles.clearBtn} activeOpacity={0.7}>
          <Trash2 size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Quick Suggested Questions */}
      {messages.length <= 2 && (
        <View style={styles.suggestionsWrapper}>
          <Text style={styles.suggestionsLabel}>Quick questions for this dish:</Text>
          <View style={styles.chipsContainer}>
            {quickQuestions.map((q, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleSend(q)}
                style={styles.suggestionChip}
                activeOpacity={0.7}
              >
                <Sparkles size={11} color={colors.primary} />
                <Text style={styles.suggestionChipText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Messages Feed */}
      <View style={styles.messagesContainer}>
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <View
              key={msg.id}
              style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAi]}
            >
              {!isUser && (
                <View style={styles.smallAvatar}>
                  <ChefHat size={14} color="#FFFFFF" />
                </View>
              )}

              <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi]}>
                {!isUser && <Text style={styles.bubbleSender}>Chef Dex</Text>}
                <Text style={[styles.bubbleText, isUser ? styles.textUser : styles.textAi]}>
                  {msg.text}
                </Text>
                <Text style={[styles.timeText, isUser ? styles.timeUser : styles.timeAi]}>
                  {msg.time}
                </Text>
              </View>
            </View>
          );
        })}

        {isLoading && (
          <View style={styles.typingRow}>
            <View style={styles.smallAvatar}>
              <ChefHat size={14} color="#FFFFFF" />
            </View>
            <View style={styles.typingBubble}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.typingText}>Chef Dex is tasting & thinking...</Text>
            </View>
          </View>
        )}
      </View>

      {/* Inline Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder={`Ask about ${recipe.title}...`}
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={300}
        />
        <TouchableOpacity
          onPress={() => handleSend()}
          disabled={!inputText.trim() || isLoading}
          style={[
            styles.sendButton,
            (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
          ]}
          activeOpacity={0.8}
        >
          <Send size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 10px rgba(21, 128, 61, 0.08)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DCFCE7',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chefBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chefName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  onlineText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  subText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  clearBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionsWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: '#FAFAF9',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestionsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  suggestionChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  messagesContainer: {
    padding: 16,
    backgroundColor: '#FAFAF9',
    gap: 10,
  },
  messageRow: {
    flexDirection: 'row',
    gap: 8,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAi: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  smallAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bubble: {
    maxWidth: '85%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 2,
  },
  bubbleAi: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bubbleSender: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 3,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 19,
  },
  textUser: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  textAi: {
    color: '#1E293B',
  },
  timeText: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeUser: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeAi: {
    color: colors.textMuted,
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typingText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.textPrimary,
    maxHeight: 80,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
});
