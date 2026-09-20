export type SpiceLevel = 'NONE' | 'MILD' | 'MEDIUM' | 'SPICY';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Category {
  id: string;
  slug: string;
  name: string;
  filipinoName: string;
  description: string;
  iconName: string;
  displayOrder: number;
  recipesCount?: number;
  subCategories?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  notes?: string | null;
  isOptional: boolean;
  recipeId?: string;
}

export interface Step {
  id: string;
  stepNumber: number;
  instruction: string;
  timerMinutes?: number | null;
  tips?: string | null;
  recipeId?: string;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  englishTitle?: string | null;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  spiceLevel: SpiceLevel;
  originRegion: string;
  difficulty: Difficulty;
  imageUrl: string;
  featured: boolean;
  isExternal: boolean;
  externalId?: string | null;
  sourceUrl?: string | null;
  mainIngredient?: string;
  cutOrType?: string;
  categoryId: string;
  category?: Category;
  ingredients?: Ingredient[];
  steps?: Step[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RecipeFilter {
  categoryId?: string;
  search?: string;
  region?: string;
  spiceLevel?: SpiceLevel;
  featured?: boolean;
  mainIngredient?: string;
  cutOrType?: string;
  subCategory?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore?: boolean;
}

export interface MealDBMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  [key: string]: string | null | undefined;
}
