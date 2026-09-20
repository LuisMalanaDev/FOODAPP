import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '@kusinadex/types';

const BOOKMARKS_STORAGE_KEY = '@kusinadex_bookmarks_v1';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load bookmarks on mount
  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setIsLoading(true);
      const data = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (data) {
        setBookmarks(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load bookmarks:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const isBookmarked = useCallback(
    (recipeId: string): boolean => {
      return bookmarks.some((r) => r.id === recipeId || r.slug === recipeId);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    async (recipe: Recipe) => {
      try {
        let updated: Recipe[];
        const exists = bookmarks.some((r) => r.id === recipe.id || r.slug === recipe.slug);

        if (exists) {
          updated = bookmarks.filter((r) => r.id !== recipe.id && r.slug !== recipe.slug);
        } else {
          updated = [recipe, ...bookmarks];
        }

        setBookmarks(updated);
        await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
        return !exists;
      } catch (e) {
        console.error('Failed to toggle bookmark:', e);
        return false;
      }
    },
    [bookmarks]
  );

  const removeBookmark = useCallback(
    async (recipeId: string) => {
      try {
        const updated = bookmarks.filter((r) => r.id !== recipeId && r.slug !== recipeId);
        setBookmarks(updated);
        await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to remove bookmark:', e);
      }
    },
    [bookmarks]
  );

  return {
    bookmarks,
    isLoading,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    refreshBookmarks: loadBookmarks,
  };
}
