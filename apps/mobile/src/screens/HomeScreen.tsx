import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Search, Sparkles, ChefHat, ChevronRight } from 'lucide-react-native';
import { useRecipes } from '../hooks/useRecipes';
import { useCategories } from '../hooks/useCategories';
import { useBookmarks } from '../hooks/useBookmarks';
import { BentoCard } from '../components/BentoCard';
import { CategoryPills } from '../components/CategoryPills';
import { RecipeCard } from '../components/RecipeCard';
import { Kitchen101Modal } from '../components/Kitchen101Modal';
import { PantryMatcherModal } from '../components/PantryMatcherModal';
import { PaginationControl } from '../components/PaginationControl';
import { colors } from '../theme/colors';
import { Recipe } from '@kusinadex/types';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { categories } = useCategories();
  const {
    recipes,
    totalFilteredCount,
    currentPage,
    totalPages,
    pageSize,
    dishOfTheDay,
    selectedCategory,
    selectedSubCategory,
    isRefreshing,
    filterByCategory,
    filterBySubCategory,
    goToPage,
    setPageSize,
    refetch,
  } = useRecipes();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [pantryModalOpen, setPantryModalOpen] = useState(false);
  const [kitchen101Open, setKitchen101Open] = useState(false);

  const flatListRef = useRef<FlatList<Recipe>>(null);

  const handlePageChange = useCallback((page: number) => {
    goToPage(page);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [goToPage]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [setPageSize]);

  const renderRecipeItem = useCallback(
    ({ item }: { item: Recipe }) => (
      <RecipeCard
        recipe={item}
        onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id, recipe: item })}
        isBookmarked={isBookmarked(item.id)}
        onToggleBookmark={() => toggleBookmark(item)}
      />
    ),
    [navigation, isBookmarked, toggleBookmark]
  );

  const keyExtractor = useCallback((item: Recipe) => item.id, []);

  // Header above list: Bento Card + Categories + Cut Filter + Section Title
  const ListHeader = (
    <View>
      {/* Bento Dish of the Day */}
      {dishOfTheDay && !selectedCategory ? (
        <BentoCard
          recipe={dishOfTheDay}
          onPress={() => navigation.navigate('RecipeDetail', { recipeId: dishOfTheDay.id, recipe: dishOfTheDay })}
          isBookmarked={isBookmarked(dishOfTheDay.id)}
          onToggleBookmark={() => toggleBookmark(dishOfTheDay)}
        />
      ) : null}

      {/* Chef Dex AI Assistant Card */}
      <TouchableOpacity
        style={styles.chefAiBanner}
        onPress={() => navigation.navigate('ChefAi')}
        activeOpacity={0.88}
      >
        <View style={styles.chefAiAvatarBadge}>
          <ChefHat size={18} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.chefAiTitleRow}>
            <Text style={styles.chefAiTitle}>Ask Chef Dex AI</Text>
            <View style={styles.chefAiPill}>
              <Sparkles size={10} color={colors.primary} />
              <Text style={styles.chefAiPillText}>Gemini AI</Text>
            </View>
          </View>
          <Text style={styles.chefAiSubtitle}>Cooking questions, ingredient swaps & recipe tips</Text>
        </View>
        <ChevronRight size={16} color={colors.primary} />
      </TouchableOpacity>

      {/* Quick Learning & Daily Utility Cards */}
      <View style={styles.quickUtilityBar}>
        <TouchableOpacity
          style={styles.utilityCard}
          onPress={() => setPantryModalOpen(true)}
          activeOpacity={0.85}
        >
          <View style={styles.utilityIconBadge}>
            <Sparkles size={16} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.utilityTitle}>Anong Nasa Ref Mo?</Text>
            <Text style={styles.utilitySubtitle}>Pantry & Ref Matcher</Text>
          </View>
          <ChevronRight size={14} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.utilityCard}
          onPress={() => setKitchen101Open(true)}
          activeOpacity={0.85}
        >
          <View style={styles.utilityIconBadge}>
            <ChefHat size={16} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.utilityTitle}>Filipino Kitchen 101</Text>
            <Text style={styles.utilitySubtitle}>5 Master Techniques</Text>
          </View>
          <ChevronRight size={14} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Category Carousel with Sub-Category / Cut Filters */}
      <CategoryPills
        categories={categories}
        selectedCategoryId={selectedCategory}
        onSelectCategory={filterByCategory}
        selectedSubCategory={selectedSubCategory}
        onSelectSubCategory={filterBySubCategory}
      />

      {/* Recipes Feed Title with Page Status */}
      <View style={styles.feedHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.feedTitle}>
            {selectedCategory
              ? `${categories.find((c) => c.id === selectedCategory)?.name || 'Dishes'}${
                  selectedSubCategory ? ` • ${selectedSubCategory}` : ''
                }`
              : 'All Authentic Recipes'}
          </Text>
          <Text style={styles.feedSubtitle}>
            Page {currentPage} of {totalPages} • {totalFilteredCount} total dishes
          </Text>
        </View>
      </View>
    </View>
  );

  const ListFooter = (
    <View style={styles.footerContainer}>
      <PaginationControl
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalFilteredCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[12, 24, 48]}
      />
      <View style={{ height: 40 }} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header Bar */}
      <View style={styles.header}>
        <View>
          <View style={styles.tagWrapper}>
            <View style={styles.dot} />
            <Text style={styles.greetingTag}>AUTHENTIC FILIPINO CUISINE</Text>
          </View>
          <Text style={styles.appTitle}>KusinaDex</Text>
          <Text style={styles.subtitle}>Curated recipes & kitchen guide</Text>
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.8}
        >
          <Search size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* High-Performance Virtualized List with Pagination */}
      <FlatList
        ref={flatListRef}
        data={recipes}
        keyExtractor={keyExtractor}
        renderItem={renderRecipeItem}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={5}
        removeClippedSubviews={Platform.OS !== 'web'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refetch}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />

      {/* Anong Nasa Ref Mo? Pantry Matcher Modal */}
      <PantryMatcherModal
        visible={pantryModalOpen}
        onClose={() => setPantryModalOpen(false)}
        onSelectRecipe={(recipe) => {
          navigation.navigate('RecipeDetail', { recipeId: recipe.id, recipe });
        }}
      />

      {/* Filipino Kitchen 101 Modal */}
      <Kitchen101Modal
        visible={kitchen101Open}
        onClose={() => setKitchen101Open(false)}
        onSelectTechnique={(query) => {
          navigation.navigate('Search', { query });
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  tagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  greetingTag: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1.2,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  searchButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  feedHeader: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 10,
  },
  feedTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  feedSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
    fontWeight: '500',
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  chefAiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 6,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 2px 8px rgba(21, 128, 61, 0.06)',
      },
    }),
  },
  chefAiAvatarBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chefAiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chefAiTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  chefAiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    gap: 3,
  },
  chefAiPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  chefAiSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  quickUtilityBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 10,
    marginBottom: 14,
  },
  utilityCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  utilityIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  utilityTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textDark,
  },
  utilitySubtitle: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
});
