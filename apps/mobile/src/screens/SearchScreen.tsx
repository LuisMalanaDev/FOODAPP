import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Search, X, Sparkles } from 'lucide-react-native';
import { Recipe } from '@kusinadex/types';
import { searchRecipesApi } from '../services/api';
import { useBookmarks } from '../hooks/useBookmarks';
import { RecipeCard } from '../components/RecipeCard';
import { PaginationControl } from '../components/PaginationControl';
import { colors } from '../theme/colors';

interface SearchScreenProps {
  navigation: any;
  route?: any;
}

const INGREDIENT_SUGGESTIONS = [
  'Pork belly',
  'Tamarind',
  'Coconut milk',
  'Calamansi',
  'Lemongrass',
  'Bagoong',
  'Peanut butter',
  'Beef shank',
  'Eggplant',
  'Ube',
];

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, route }) => {
  const initialQuery = route?.params?.query || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<Recipe[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [searchPageSize, setSearchPageSize] = useState(12);

  const flatListRef = useRef<FlatList<Recipe>>(null);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  useEffect(() => {
    if (route?.params?.query) {
      setSearchQuery(route.params.query);
      handleSearch(route.params.query);
    }
  }, [route?.params?.query]);

  const handleSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    try {
      const data = await searchRecipesApi(query);
      setResults(data);
      setSearchPage(1);
    } catch (e) {
      console.error('Search error:', e);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const totalSearchPages = Math.max(1, Math.ceil(results.length / searchPageSize));
  const paginatedResults = results.slice(
    (searchPage - 1) * searchPageSize,
    searchPage * searchPageSize
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Search Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Recipes</Text>
        <Text style={styles.headerSubtitle}>
          Find dishes by name, region, or specific ingredients
        </Text>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. Sinigang, Pork belly, Tamarind..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={clearSearch} style={styles.clearBtn}>
              <X size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Ingredient quick filter chips */}
        <View style={styles.suggestionsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
            <View style={styles.suggestLabelRow}>
              <Sparkles size={12} color={colors.primary} />
              <Text style={styles.suggestLabel}>Try:</Text>
            </View>
            {INGREDIENT_SUGGESTIONS.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setSearchQuery(item)}
                style={[
                  styles.chip,
                  searchQuery.toLowerCase() === item.toLowerCase() && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    searchQuery.toLowerCase() === item.toLowerCase() && styles.chipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Results Body */}
      {isSearching ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loaderText}>Searching mouthwatering recipes...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={paginatedResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item: recipe }) => (
            <RecipeCard
              recipe={recipe}
              onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id, recipe })}
              isBookmarked={isBookmarked(recipe.id)}
              onToggleBookmark={() => toggleBookmark(recipe)}
            />
          )}
          ListHeaderComponent={
            <View style={styles.resultCountRow}>
              <Text style={styles.resultCountText}>
                {results.length > 0
                  ? `Found ${results.length} matches • Page ${searchPage} of ${totalSearchPages}`
                  : searchQuery
                  ? 'No matches found'
                  : 'All Recipes'}
              </Text>
            </View>
          }
          ListEmptyComponent={
            searchQuery ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🍲</Text>
                <Text style={styles.emptyTitle}>No recipes found</Text>
                <Text style={styles.emptySubtitle}>
                  Try searching for ingredients like "pork belly", "tamarind", "coconut milk", or dish names like "adobo".
                </Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            results.length > 0 ? (
              <View style={{ paddingHorizontal: 20 }}>
                <PaginationControl
                  currentPage={searchPage}
                  totalPages={totalSearchPages}
                  totalItems={results.length}
                  pageSize={searchPageSize}
                  onPageChange={(page) => {
                    setSearchPage(page);
                    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                  }}
                  onPageSizeChange={(size) => {
                    setSearchPageSize(size);
                    setSearchPage(1);
                    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                  }}
                  pageSizeOptions={[12, 24, 48]}
                />
                <View style={{ height: 40 }} />
              </View>
            ) : (
              <View style={{ height: 40 }} />
            )
          }
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          windowSize={5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsScroll}
        />
      )}
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
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  suggestionsContainer: {
    marginTop: 12,
  },
  chipScroll: {
    alignItems: 'center',
    gap: 8,
  },
  suggestLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 4,
  },
  suggestLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.bgSoft,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  chipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  resultsScroll: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  resultCountRow: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  resultCountText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  emptyState: {
    paddingTop: 60,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
