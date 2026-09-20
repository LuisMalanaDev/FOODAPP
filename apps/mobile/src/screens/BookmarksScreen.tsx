import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Bookmark, Sparkles, ChefHat, CheckCircle2, Award, Edit3, Calendar } from 'lucide-react-native';
import { useBookmarks } from '../hooks/useBookmarks';
import { useCookedRecipes } from '../hooks/useCookedRecipes';
import { RecipeCard } from '../components/RecipeCard';
import { FALLBACK_RECIPES } from '../services/api';
import { colors } from '../theme/colors';

interface BookmarksScreenProps {
  navigation: any;
}

export const BookmarksScreen: React.FC<BookmarksScreenProps> = ({ navigation }) => {
  const { bookmarks, isBookmarked, toggleBookmark } = useBookmarks();
  const { cookedList, totalCookedCount } = useCookedRecipes();
  const [activeTab, setActiveTab] = useState<'favorites' | 'cooked'>('favorites');

  // Compute category breakdown of cooked dishes
  const categoryCounts: Record<string, number> = {};
  cookedList.forEach((item) => {
    if (item.count > 0 && item.recipe.categoryId) {
      categoryCounts[item.recipe.categoryId] = (categoryCounts[item.recipe.categoryId] || 0) + 1;
    }
  });

  const totalCatalogRecipes = FALLBACK_RECIPES.length;
  const masteryPercentage = Math.min(100, Math.round((totalCookedCount / totalCatalogRecipes) * 100));

  const porkTotal = FALLBACK_RECIPES.filter((r) => r.categoryId === 'cat_pork').length;
  const chickenTotal = FALLBACK_RECIPES.filter((r) => r.categoryId === 'cat_chicken').length;
  const beefTotal = FALLBACK_RECIPES.filter((r) => r.categoryId === 'cat_beef').length;
  const seafoodTotal = FALLBACK_RECIPES.filter((r) => r.categoryId === 'cat_seafood').length;
  const vegTotal = FALLBACK_RECIPES.filter((r) => r.categoryId === 'cat_vegetables').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>My Kitchen Hub</Text>
        </View>

        <Text style={styles.subtitle}>
          Track dishes you have cooked, review your kitchen notes, and manage saved recipes.
        </Text>

        {/* Segmented Switcher */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'favorites' && styles.tabButtonActive]}
            onPress={() => setActiveTab('favorites')}
            activeOpacity={0.8}
          >
            <Bookmark
              size={15}
              color={activeTab === 'favorites' ? colors.primary : colors.textMuted}
              fill={activeTab === 'favorites' ? colors.primary : 'none'}
            />
            <Text style={[styles.tabText, activeTab === 'favorites' && styles.tabTextActive]}>
              Favorites ({bookmarks.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'cooked' && styles.tabButtonActive]}
            onPress={() => setActiveTab('cooked')}
            activeOpacity={0.8}
          >
            <CheckCircle2
              size={15}
              color={activeTab === 'cooked' ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.tabText, activeTab === 'cooked' && styles.tabTextActive]}>
              Naluto Ko Na ({totalCookedCount})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'cooked' ? (
          <>
            {/* Mastery Progress Card */}
            <View style={styles.masteryCard}>
              <View style={styles.masteryHeader}>
                <View style={styles.masteryBadge}>
                  <Award size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.masteryTitle}>Dish Mastery Progress</Text>
                  <Text style={styles.masterySubtitle}>
                    {totalCookedCount} of {totalCatalogRecipes} dishes cooked ({masteryPercentage}%)
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${Math.max(4, masteryPercentage)}%` }]} />
              </View>

              {/* Discipline Badges */}
              <View style={styles.disciplineRow}>
                <View style={styles.disciplineChip}>
                  <Text style={styles.disciplineChipText}>Pork: {categoryCounts['cat_pork'] || 0}/{porkTotal}</Text>
                </View>
                <View style={styles.disciplineChip}>
                  <Text style={styles.disciplineChipText}>Chicken: {categoryCounts['cat_chicken'] || 0}/{chickenTotal}</Text>
                </View>
                <View style={styles.disciplineChip}>
                  <Text style={styles.disciplineChipText}>Beef: {categoryCounts['cat_beef'] || 0}/{beefTotal}</Text>
                </View>
                <View style={styles.disciplineChip}>
                  <Text style={styles.disciplineChipText}>Seafood: {categoryCounts['cat_seafood'] || 0}/{seafoodTotal}</Text>
                </View>
                <View style={styles.disciplineChip}>
                  <Text style={styles.disciplineChipText}>Gulay: {categoryCounts['cat_vegetables'] || 0}/{vegTotal}</Text>
                </View>
              </View>
            </View>

            {cookedList.filter((c) => c.count > 0).length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                  <ChefHat size={36} color={colors.primary} />
                </View>

                <Text style={styles.emptyTitle}>No dishes marked as cooked yet</Text>
                <Text style={styles.emptyDescription}>
                  When you cook a meal, tap "Mark as Cooked" on the recipe. Your progress and private notes will appear here!
                </Text>

                <TouchableOpacity
                  style={styles.exploreButton}
                  onPress={() => navigation.navigate('Home')}
                  activeOpacity={0.85}
                >
                  <ChefHat size={18} color="#FFFFFF" />
                  <Text style={styles.exploreButtonText}>Find a Recipe to Cook</Text>
                  <Sparkles size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.list}>
                {cookedList
                  .filter((c) => c.count > 0)
                  .map((record) => (
                    <View key={record.recipe.id} style={styles.cookedItemWrapper}>
                      <RecipeCard
                        recipe={record.recipe}
                        onPress={() =>
                          navigation.navigate('RecipeDetail', {
                            recipeId: record.recipe.id,
                            recipe: record.recipe,
                          })
                        }
                        isBookmarked={isBookmarked(record.recipe.id)}
                        onToggleBookmark={() => toggleBookmark(record.recipe)}
                      />

                      {/* Cooked Metadata & Note Banner */}
                      <View style={styles.cookedMetaCard}>
                        <View style={styles.cookedMetaHeader}>
                          <View style={styles.cookedMetaTag}>
                            <CheckCircle2 size={12} color={colors.primary} />
                            <Text style={styles.cookedMetaTagText}>
                              Cooked {record.count} {record.count === 1 ? 'time' : 'times'}
                            </Text>
                          </View>

                          <View style={styles.lastCookedTag}>
                            <Calendar size={12} color={colors.textMuted} />
                            <Text style={styles.lastCookedTagText}>
                              {new Date(record.lastCookedAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </Text>
                          </View>
                        </View>

                        {record.note ? (
                          <View style={styles.notePreview}>
                            <Edit3 size={12} color={colors.primary} />
                            <Text style={styles.notePreviewText} numberOfLines={2}>
                              "{record.note}"
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  ))}
              </View>
            )}
          </>
        ) : (
          /* Favorites Tab */
          <>
            {bookmarks.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                  <Bookmark size={36} color={colors.primary} />
                </View>

                <Text style={styles.emptyTitle}>No saved recipes yet</Text>
                <Text style={styles.emptyDescription}>
                  Tap the bookmark icon on any dish to save it here for quick access when you're in the kitchen.
                </Text>

                <TouchableOpacity
                  style={styles.exploreButton}
                  onPress={() => navigation.navigate('Home')}
                  activeOpacity={0.85}
                >
                  <ChefHat size={18} color="#FFFFFF" />
                  <Text style={styles.exploreButtonText}>Explore Recipes</Text>
                  <Sparkles size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.list}>
                {bookmarks.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onPress={() =>
                      navigation.navigate('RecipeDetail', { recipeId: recipe.id, recipe })
                    }
                    isBookmarked={isBookmarked(recipe.id)}
                    onToggleBookmark={() => toggleBookmark(recipe)}
                  />
                ))}
              </View>
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textDark,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
    marginBottom: 12,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 20,
  },
  masteryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  masteryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  masteryBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  masteryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textDark,
  },
  masterySubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  disciplineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  disciplineChip: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  disciplineChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMedium,
  },
  list: {
    gap: 16,
  },
  cookedItemWrapper: {
    marginBottom: 4,
  },
  cookedMetaCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    marginTop: -4,
    marginBottom: 8,
    marginHorizontal: 4,
  },
  cookedMetaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cookedMetaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cookedMetaTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  lastCookedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastCookedTagText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  notePreview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  notePreviewText: {
    fontSize: 12,
    color: colors.textDark,
    fontStyle: 'italic',
    flex: 1,
    lineHeight: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
