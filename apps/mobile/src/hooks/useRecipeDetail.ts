import { useState, useEffect, useCallback } from 'react';
import { Recipe } from '@kusinadex/types';
import { fetchRecipeById } from '../services/api';

export function useRecipeDetail(recipeId: string, initialData?: Recipe) {
  const [recipe, setRecipe] = useState<Recipe | null>(initialData || null);
  // If initialData is already supplied, do not show a blocking loading screen!
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      // Only trigger visible loading if we truly have no data to show
      if (!initialData && !recipe) {
        setIsLoading(true);
      }
      setError(null);
      const data = await fetchRecipeById(recipeId);
      if (data) {
        setRecipe(data);
      } else if (!initialData) {
        setError('Recipe not found');
      }
    } catch (err: any) {
      if (!initialData) {
        setError(err.message || 'Failed to load recipe');
      }
    } finally {
      setIsLoading(false);
    }
  }, [recipeId, initialData]);

  useEffect(() => {
    load();
  }, [load]);

  return { recipe, isLoading, error, refetch: load };
}
