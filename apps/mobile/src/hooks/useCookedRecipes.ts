import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '@kusinadex/types';

export interface CookedRecord {
  recipe: Recipe;
  count: number;
  lastCookedAt: string;
  note?: string;
}

export type CookedMap = Record<string, CookedRecord>;

const COOKED_STORAGE_KEY = '@kusinadex_cooked_v1';

export function useCookedRecipes() {
  const [cookedMap, setCookedMap] = useState<CookedMap>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load cooked records on mount
  useEffect(() => {
    loadCookedRecords();
  }, []);

  const loadCookedRecords = async () => {
    try {
      setIsLoading(true);
      const data = await AsyncStorage.getItem(COOKED_STORAGE_KEY);
      if (data) {
        setCookedMap(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load cooked recipes:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const isCooked = useCallback(
    (recipeId: string): boolean => {
      return !!cookedMap[recipeId];
    },
    [cookedMap]
  );

  const getCookedRecord = useCallback(
    (recipeId: string): CookedRecord | null => {
      return cookedMap[recipeId] || null;
    },
    [cookedMap]
  );

  const markAsCooked = useCallback(
    async (recipe: Recipe) => {
      try {
        const existing = cookedMap[recipe.id];
        const newCount = existing ? existing.count + 1 : 1;
        const now = new Date().toISOString();

        const updated: CookedMap = {
          ...cookedMap,
          [recipe.id]: {
            recipe,
            count: newCount,
            lastCookedAt: now,
            note: existing?.note || '',
          },
        };

        setCookedMap(updated);
        await AsyncStorage.setItem(COOKED_STORAGE_KEY, JSON.stringify(updated));
        return updated[recipe.id];
      } catch (e) {
        console.error('Failed to mark recipe as cooked:', e);
        return null;
      }
    },
    [cookedMap]
  );

  const unmarkCooked = useCallback(
    async (recipeId: string) => {
      try {
        const updated = { ...cookedMap };
        delete updated[recipeId];
        setCookedMap(updated);
        await AsyncStorage.setItem(COOKED_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to unmark cooked recipe:', e);
      }
    },
    [cookedMap]
  );

  const saveCookNote = useCallback(
    async (recipeId: string, note: string, recipe?: Recipe) => {
      try {
        const existing = cookedMap[recipeId];
        if (existing) {
          const updated: CookedMap = {
            ...cookedMap,
            [recipeId]: {
              ...existing,
              note,
            },
          };
          setCookedMap(updated);
          await AsyncStorage.setItem(COOKED_STORAGE_KEY, JSON.stringify(updated));
        } else if (recipe) {
          // If not marked cooked yet, create entry with count 0 or 1
          const updated: CookedMap = {
            ...cookedMap,
            [recipeId]: {
              recipe,
              count: 0,
              lastCookedAt: new Date().toISOString(),
              note,
            },
          };
          setCookedMap(updated);
          await AsyncStorage.setItem(COOKED_STORAGE_KEY, JSON.stringify(updated));
        }
      } catch (e) {
        console.error('Failed to save cook note:', e);
      }
    },
    [cookedMap]
  );

  // Return array of cooked records sorted by most recently cooked
  const cookedList = Object.values(cookedMap).sort((a, b) => {
    return new Date(b.lastCookedAt).getTime() - new Date(a.lastCookedAt).getTime();
  });

  return {
    cookedMap,
    cookedList,
    totalCookedCount: cookedList.filter((c) => c.count > 0).length,
    isLoading,
    isCooked,
    getCookedRecord,
    markAsCooked,
    unmarkCooked,
    saveCookNote,
  };
}
