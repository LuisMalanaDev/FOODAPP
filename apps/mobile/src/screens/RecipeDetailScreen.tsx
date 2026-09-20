import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Clock,
  MapPin,
  Flame,
  Users,
  ChefHat,
  Sparkles,
  CheckCircle2,
  Check,
} from 'lucide-react-native';
import { useRecipeDetail } from '../hooks/useRecipeDetail';
import { useBookmarks } from '../hooks/useBookmarks';
import { useCookedRecipes } from '../hooks/useCookedRecipes';
import { IngredientChecklist } from '../components/IngredientChecklist';
import { CookingStepsList } from '../components/CookingStepsList';
import { CookingModeModal } from '../components/CookingModeModal';
import { KitchenNotesCard } from '../components/KitchenNotesCard';
import { RecipeChefChat } from '../components/RecipeChefChat';
import { colors } from '../theme/colors';

interface RecipeDetailScreenProps {
  route: any;
  navigation: any;
}

export const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { recipeId, recipe: initialRecipe } = route.params;
  const { recipe, isLoading } = useRecipeDetail(recipeId, initialRecipe);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { isCooked, getCookedRecord, markAsCooked, unmarkCooked, saveCookNote } = useCookedRecipes();

  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps' | 'chat'>('ingredients');
  const [cookingModeOpen, setCookingModeOpen] = useState(false);

  if (isLoading || !recipe) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading recipe details...</Text>
      </View>
    );
  }

  const bookmarked = isBookmarked(recipe.id);
  const cooked = isCooked(recipe.id);
  const cookedRecord = getCookedRecord(recipe.id);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Image Section */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.imageUrl }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.imageOverlay} />

          {/* Top Floating Controls */}
          <View style={styles.navBar}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.circleButton}
              activeOpacity={0.8}
            >
              <ChevronLeft size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleBookmark(recipe)}
              style={[styles.circleButton, bookmarked && styles.bookmarkedActive]}
              activeOpacity={0.8}
            >
              <Bookmark
                size={20}
                color={bookmarked ? '#FFFFFF' : '#FFFFFF'}
                fill={bookmarked ? '#FFFFFF' : 'none'}
              />
            </TouchableOpacity>
          </View>

          {/* Bottom title overlay */}
          <View style={styles.heroInfo}>
            <View style={styles.regionTag}>
              <MapPin size={12} color="#FFFFFF" />
              <Text style={styles.regionTagText}>{recipe.originRegion}</Text>
            </View>
            <Text style={styles.title}>{recipe.title}</Text>
            {recipe.englishTitle ? (
              <Text style={styles.englishTitle}>{recipe.englishTitle}</Text>
            ) : null}
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.body}>
          {/* Quick Metrics Strip */}
          <View style={styles.metricsCard}>
            <View style={styles.metricItem}>
              <Clock size={18} color={colors.primary} />
              <Text style={styles.metricValue}>{recipe.prepTimeMinutes}m</Text>
              <Text style={styles.metricLabel}>Prep Time</Text>
            </View>
            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <Clock size={18} color={colors.primary} />
              <Text style={styles.metricValue}>{recipe.cookTimeMinutes}m</Text>
              <Text style={styles.metricLabel}>Cook Time</Text>
            </View>
            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <Users size={18} color={colors.primary} />
              <Text style={styles.metricValue}>{recipe.servings}</Text>
              <Text style={styles.metricLabel}>Servings</Text>
            </View>
            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <Flame
                size={18}
                color={recipe.spiceLevel === 'SPICY' ? colors.primary : colors.textMuted}
              />
              <Text style={styles.metricValue}>
                {recipe.spiceLevel === 'SPICY'
                  ? 'Spicy'
                  : recipe.spiceLevel === 'MILD'
                  ? 'Mild'
                  : 'None'}
              </Text>
              <Text style={styles.metricLabel}>Heat Level</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{recipe.description}</Text>
          </View>

          {/* Ask Chef Dex AI Banner */}
          <TouchableOpacity
            style={styles.askAiBanner}
            onPress={() => setActiveTab('chat')}
            activeOpacity={0.85}
          >
            <View style={styles.askAiIconBadge}>
              <Sparkles size={16} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.askAiTitle}>Have questions about this dish?</Text>
              <Text style={styles.askAiSubtitle}>Ask Chef Dex AI right here for swaps & cooking tips</Text>
            </View>
            <ChevronRight size={16} color={colors.primary} />
          </TouchableOpacity>

          {/* Segmented Switcher */}
          <View style={styles.tabSwitcher}>
            <TouchableOpacity
              onPress={() => setActiveTab('ingredients')}
              style={[styles.tabButton, activeTab === 'ingredients' && styles.tabButtonActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === 'ingredients' && styles.tabTextActive]}>
                Ingredients ({recipe.ingredients?.length || 0})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('steps')}
              style={[styles.tabButton, activeTab === 'steps' && styles.tabButtonActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === 'steps' && styles.tabTextActive]}>
                Steps ({recipe.steps?.length || 0})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('chat')}
              style={[styles.tabButton, activeTab === 'chat' && styles.tabButtonActive]}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Sparkles size={12} color={activeTab === 'chat' ? colors.primary : colors.textSecondary} />
                <Text style={[styles.tabText, activeTab === 'chat' && styles.tabTextActive]}>
                  Chef AI
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'ingredients' && (
            <IngredientChecklist ingredients={recipe.ingredients || []} />
          )}
          {activeTab === 'steps' && (
            <CookingStepsList steps={recipe.steps || []} />
          )}
          {activeTab === 'chat' && (
            <RecipeChefChat recipe={recipe} />
          )}

          {/* Cook's Personal Kitchen Notes */}
          <KitchenNotesCard
            initialNote={cookedRecord?.note || ''}
            onSaveNote={(noteText) => saveCookNote(recipe.id, noteText, recipe)}
          />

          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.markCookedButton, cooked && styles.markCookedButtonActive]}
          onPress={() => (cooked ? unmarkCooked(recipe.id) : markAsCooked(recipe))}
          activeOpacity={0.85}
        >
          {cooked ? (
            <CheckCircle2 size={18} color="#FFFFFF" />
          ) : (
            <Check size={18} color={colors.primary} />
          )}
          <Text style={[styles.markCookedText, cooked && styles.markCookedTextActive]}>
            {cooked ? `Naluto Ko Na! (${cookedRecord?.count || 1}x)` : 'Mark as Cooked'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.startCookingButton}
          onPress={() => setCookingModeOpen(true)}
          activeOpacity={0.9}
        >
          <ChefHat size={18} color="#FFFFFF" />
          <Text style={styles.startCookingText}>Cook Mode</Text>
          <Sparkles size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Fullscreen Cooking Assistant Modal */}
      {recipe && (
        <CookingModeModal
          visible={cookingModeOpen}
          onClose={() => setCookingModeOpen(false)}
          recipe={recipe}
          steps={recipe.steps || []}
          onFinishCooking={() => markAsCooked(recipe)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    height: 340,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  navBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkedActive: {
    backgroundColor: colors.primary,
  },
  heroInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  regionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    marginBottom: 8,
  },
  regionTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  englishTitle: {
    fontSize: 15,
    color: '#DCFCE7',
    fontWeight: '600',
    marginTop: 2,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  metricsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderLight,
  },
  descriptionBox: {
    backgroundColor: colors.primaryLight,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    marginBottom: 18,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.primaryDark,
    fontWeight: '500',
  },
  askAiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 16,
    gap: 10,
  },
  askAiIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  askAiTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15803D',
  },
  askAiSubtitle: {
    fontSize: 11,
    color: '#166534',
    marginTop: 1,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  markCookedButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  markCookedButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  markCookedText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  markCookedTextActive: {
    color: '#FFFFFF',
  },
  startCookingButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 6,
  },
  startCookingText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
