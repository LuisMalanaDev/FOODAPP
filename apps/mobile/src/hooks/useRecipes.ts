import { useState, useEffect, useCallback, useRef } from 'react';
import { Recipe } from '@kusinadex/types';
import { fetchRecipes, fetchFeaturedRecipes } from '../services/api';

const DEFAULT_PAGE_SIZE = 12;

export function useRecipes(initialCategoryId?: string, initialPageSize: number = DEFAULT_PAGE_SIZE) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategoryId);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSizeState] = useState<number>(initialPageSize);

  // Master catalog cache for instantaneous (0ms) in-memory filtering & pagination
  const masterCatalogRef = useRef<Recipe[]>([]);
  const filteredCatalogRef = useRef<Recipe[]>([]);

  // Calculate total pages dynamically
  const totalFilteredCount = filteredCatalogRef.current.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / pageSize));

  // Helper to slice current page items
  const slicePageItems = (page: number, size: number, catalog: Recipe[] = filteredCatalogRef.current) => {
    const startIndex = (page - 1) * size;
    return catalog.slice(startIndex, startIndex + size);
  };

  // Filter helper: Instantaneous in-memory filtering with clean pagination
  const applyFilter = useCallback((catalog: Recipe[], catId?: string, subCat?: string, currentSize: number = pageSize) => {
    let result = [...catalog];
    if (catId) {
      result = result.filter(
        (r) => r.categoryId === catId || r.category?.slug === catId
      );
    }
    if (subCat) {
      const subLower = subCat.toLowerCase();
      result = result.filter(
        (r) =>
          r.cutOrType?.toLowerCase().includes(subLower) ||
          r.title.toLowerCase().includes(subLower)
      );
    }

    filteredCatalogRef.current = result;
    setCurrentPage(1);

    // Display first page
    const pageItems = result.slice(0, currentSize);
    setRecipes(pageItems);
    setHasMore(pageItems.length < result.length);
  }, [pageSize]);

  // Initial load
  const loadInitialData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else if (masterCatalogRef.current.length === 0) {
        setIsLoading(true);
      }
      setError(null);

      const [allRecipesRes, featuredRes] = await Promise.all([
        fetchRecipes({ limit: 500 }),
        fetchFeaturedRecipes(),
      ]);

      masterCatalogRef.current = allRecipesRes.items;
      setFeaturedRecipes(featuredRes);

      // Apply initial filter if any
      applyFilter(allRecipesRes.items, selectedCategory, selectedSubCategory, pageSize);
    } catch (err: any) {
      setError(err.message || 'Failed to load recipes');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedCategory, selectedSubCategory, pageSize, applyFilter]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // When filters change, reset pagination and filter from master catalog instantly
  useEffect(() => {
    if (masterCatalogRef.current.length > 0) {
      applyFilter(masterCatalogRef.current, selectedCategory, selectedSubCategory, pageSize);
    }
  }, [selectedCategory, selectedSubCategory, pageSize, applyFilter]);

  // Page Navigation Handlers
  const goToPage = useCallback((targetPage: number) => {
    const total = Math.max(1, Math.ceil(filteredCatalogRef.current.length / pageSize));
    const clamped = Math.max(1, Math.min(total, targetPage));
    setCurrentPage(clamped);

    const items = slicePageItems(clamped, pageSize);
    setRecipes(items);
    setHasMore(clamped < total);
  }, [pageSize]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const setPageSize = useCallback((newSize: number) => {
    setPageSizeState(newSize);
    setCurrentPage(1);
    const items = slicePageItems(1, newSize);
    setRecipes(items);
    setHasMore(items.length < filteredCatalogRef.current.length);
  }, []);

  // Infinite scroll fallback compatibility
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextP = currentPage + 1;
    const startIndex = (nextP - 1) * pageSize;
    const nextBatch = filteredCatalogRef.current.slice(startIndex, startIndex + pageSize);

    if (nextBatch.length > 0) {
      setCurrentPage(nextP);
      setRecipes((prev) => [...prev, ...nextBatch]);
      setHasMore(startIndex + nextBatch.length < filteredCatalogRef.current.length);
    } else {
      setHasMore(false);
    }

    setIsLoadingMore(false);
  }, [currentPage, pageSize, isLoadingMore, hasMore]);

  const filterByCategory = (catId?: string) => {
    setSelectedSubCategory(undefined);
    setSelectedCategory((prev) => (prev === catId ? undefined : catId));
  };

  const filterBySubCategory = (sub?: string) => {
    setSelectedSubCategory((prev) => (prev === sub ? undefined : sub));
  };

  return {
    recipes,
    totalFilteredCount,
    currentPage,
    totalPages,
    pageSize,
    featuredRecipes,
    dishOfTheDay: featuredRecipes[0] || recipes[0],
    selectedCategory,
    selectedSubCategory,
    isLoading,
    isRefreshing,
    isLoadingMore,
    hasMore,
    error,
    filterByCategory,
    filterBySubCategory,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    loadMore,
    refetch: () => loadInitialData(true),
  };
}
