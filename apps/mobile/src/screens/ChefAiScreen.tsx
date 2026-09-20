import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { ChefHat, Send, Sparkles, Trash2, X, ChevronLeft } from 'lucide-react-native';
import { askChefAiApi, ChatMessage } from '../services/api';
import { colors } from '../theme/colors';

interface ChefAiScreenProps {
  navigation: any;
  route?: any;
}

interface MessageItem {
  id: string;
  role: 'user' | 'model';
  text: string;
  createdAt: string;
}

const DEFAULT_SUGGESTIONS = [
  '🥫 What can I substitute for Calamansi?',
  '🥓 How to make Lechon Kawali skin blister & stay crispy?',
  '🍜 What is the secret to a rich Ramen broth?',
  '🍳 What can I cook with Eggs + Eggplant + Garlic?',
  '🍲 Why is my Sinigang too sour & how do I fix it?',
  '🔥 What is "Sangkutsa" and why is it important?',
];

export const ChefAiScreen: React.FC<ChefAiScreenProps> = ({ navigation, route }) => {
  const recipeContext = route?.params?.recipeContext;
  const [activeRecipeContext, setActiveRecipeContext] = useState(recipeContext);

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'msg_welcome',
      role: 'model',
      text: activeRecipeContext
        ? `Mabuhay! I see you're looking at **${activeRecipeContext.title}**! 🍲\n\nI'm Chef Dex, your personal cooking mentor. Ask me anything about ingredient swaps, timing, or how to get the flavors just right!`
        : `Mabuhay! I'm Chef Dex, your AI cooking mentor! 👨‍🍳\n\nAsk me anything about Filipino cooking techniques, substitutions, meal ideas from our 435 recipes, or how to rescue a dish in your kitchen. What are we cooking today?`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList<MessageItem>>(null);

  // Update recipe context if route params change
  useEffect(() => {
    if (route?.params?.recipeContext) {
      setActiveRecipeContext(route.params.recipeContext);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_context_${Date.now()}`,
          role: 'model',
          text: `Chef Dex tuned into: **${route.params.recipeContext.title}**! Ask me any questions about this dish! 🍳`,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [route?.params?.recipeContext]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: MessageItem = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: query,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Build history
      const history: ChatMessage[] = messages
        .filter((m) => m.id !== 'msg_welcome')
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const reply = await askChefAiApi({
        message: query,
        history,
        recipeContext: activeRecipeContext,
      });

      const aiMsg: MessageItem = {
        id: `ai_${Date.now()}`,
        role: 'model',
        text: reply,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: MessageItem = {
        id: `err_${Date.now()}`,
        role: 'model',
        text: 'Naku! Something went wrong contacting the kitchen. Please check your connection and try asking again.',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'msg_welcome_new',
        role: 'model',
        text: `Kitchen chalkboard wiped clean! What culinary questions can Chef Dex answer for you? 👨‍🍳`,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const renderMessage = ({ item }: { item: MessageItem }) => {
    const isUser = item.role === 'user';

    return (
      <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAi]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <ChefHat size={16} color="#FFFFFF" />
          </View>
        )}

        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi]}>
          {!isUser && <Text style={styles.senderName}>Chef Dex • AI Mentor</Text>}
          <Text style={[styles.messageText, isUser ? styles.textUser : styles.textAi]}>
            {item.text}
          </Text>
          <Text style={[styles.timeText, isUser ? styles.timeUser : styles.timeAi]}>
            {item.createdAt}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Screen Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('Home');
              }
            }}
            style={styles.backButton}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
          >
            <ChevronLeft size={22} color={colors.primaryDark} />
          </TouchableOpacity>

          <View style={styles.headerIconBadge}>
            <Sparkles size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Chef Dex AI</Text>
            <Text style={styles.headerSubtitle}>
              Filipino Cooking Mentor • Powered by Gemini
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={clearChat}
          style={styles.clearButton}
          activeOpacity={0.7}
          accessibilityLabel="Clear chat"
        >
          <Trash2 size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Active Recipe Context Banner */}
      {activeRecipeContext && (
        <View style={styles.contextBanner}>
          <View style={styles.contextIconBadge}>
            <ChefHat size={14} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.contextLabel}>Recipe Context Active</Text>
            <Text style={styles.contextTitle} numberOfLines={1}>
              {activeRecipeContext.title}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setActiveRecipeContext(null)}
            style={styles.closeContextBtn}
          >
            <X size={14} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            {isLoading && (
              <View style={styles.typingRow}>
                <View style={styles.avatarContainer}>
                  <ChefHat size={16} color="#FFFFFF" />
                </View>
                <View style={styles.typingBubble}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.typingText}>Chef Dex is tasting & thinking...</Text>
                </View>
              </View>
            )}

            {/* Quick Suggestions Chips */}
            {messages.length <= 2 && (
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Popular Kitchen Questions:</Text>
                <View style={styles.chipsWrapper}>
                  {DEFAULT_SUGGESTIONS.map((sug, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleSend(sug)}
                      style={styles.suggestionChip}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.suggestionChipText}>{sug}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            <View style={{ height: 16 }} />
          </>
        }
      />

      {/* Bottom Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputBarContainer}>
          <TextInput
            style={styles.input}
            placeholder={
              activeRecipeContext
                ? `Ask about ${activeRecipeContext.title}...`
                : 'Ask Chef Dex anything about cooking...'
            }
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
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
            <Send size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  clearButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#A7F3D0',
    gap: 10,
  },
  contextIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contextTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
  },
  closeContextBtn: {
    padding: 4,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 6,
    gap: 8,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAi: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAi: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      },
    }),
  },
  senderName: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  textUser: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  textAi: {
    color: '#1E293B',
  },
  timeText: {
    fontSize: 10,
    marginTop: 6,
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
    marginVertical: 8,
    gap: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typingText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  suggestionsContainer: {
    marginTop: 16,
    paddingHorizontal: 4,
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  chipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  suggestionChipText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  inputBarContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    color: colors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
});
