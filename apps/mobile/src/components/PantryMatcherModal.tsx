import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { X, Sparkles, Check, ChefHat, Search, RefreshCw } from 'lucide-react-native';
import { Recipe } from '@kusinadex/types';
import { RecipeCard } from './RecipeCard';
import { FALLBACK_RECIPES } from '../services/api';
import { useBookmarks } from '../hooks/useBookmarks';
import { colors } from '../theme/colors';

interface PantryMatcherModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

interface IngredientOption {
  label: string;
  keywords: string[];
}

interface IngredientGroup {
  title: string;
  items: IngredientOption[];
}

const PANTRY_GROUPS: IngredientGroup[] = [
  {
    title: 'Protina (Meats, Seafood & Eggs)',
    items: [
      { label: 'Eggs (Itlog)', keywords: ['egg', 'eggs', 'itlog'] },
      { label: 'Pork Belly (Liempo)', keywords: ['pork belly', 'liempo', 'belly'] },
      { label: 'Pork Chops', keywords: ['pork chop', 'porkchop', 'chops'] },
      { label: 'Ground Pork (Giniling)', keywords: ['ground pork', 'giniling', 'minced pork'] },
      { label: 'Pork Hock (Pata)', keywords: ['pork hock', 'pata'] },
      { label: 'Chicken (Manok)', keywords: ['chicken', 'manok', 'drumstick', 'thigh', 'wings'] },
      { label: 'Beef (Baka)', keywords: ['beef', 'baka', 'shank', 'brisket', 'oxtail'] },
      { label: 'Bangus (Milkfish)', keywords: ['bangus', 'milkfish'] },
      { label: 'Tilapia', keywords: ['tilapia'] },
      { label: 'Shrimp (Hipon)', keywords: ['shrimp', 'hipon', 'prawn'] },
      { label: 'Squid (Pusit)', keywords: ['squid', 'pusit', 'calamari'] },
      { label: 'Tofu (Tokwa)', keywords: ['tofu', 'tokwa'] },
      { label: 'Canned Sardines / Tuna', keywords: ['sardines', 'tuna', 'sardinas'] },
    ],
  },
  {
    title: 'Gulay (Vegetables & Greens)',
    items: [
      { label: 'Eggplant (Talong)', keywords: ['eggplant', 'talong'] },
      { label: 'Bitter Melon (Ampalaya)', keywords: ['ampalaya', 'bitter melon', 'bitter gourd'] },
      { label: 'String Beans (Sitaw)', keywords: ['sitaw', 'string beans', 'yardlong'] },
      { label: 'Squash (Kalabasa)', keywords: ['squash', 'kalabasa', 'pumpkin'] },
      { label: 'Sayote (Chayote)', keywords: ['sayote', 'chayote'] },
      { label: 'Kangkong (Water Spinach)', keywords: ['kangkong', 'water spinach'] },
      { label: 'Mung Beans (Monggo)', keywords: ['monggo', 'mung beans', 'munggo'] },
      { label: 'Potatoes (Patatas)', keywords: ['potato', 'potatoes', 'patatas'] },
      { label: 'Carrots', keywords: ['carrot', 'carrots'] },
      { label: 'Cabbage (Repolyo)', keywords: ['cabbage', 'repolyo'] },
      { label: 'Taro Leaves / Gabi', keywords: ['taro', 'gabi', 'taro leaves', 'laing'] },
    ],
  },
  {
    title: 'Timpla at Sabaw (Aromatics & Sours)',
    items: [
      { label: 'Garlic (Bawang)', keywords: ['garlic', 'bawang'] },
      { label: 'Onion (Sibuyas)', keywords: ['onion', 'sibuyas'] },
      { label: 'Tomato (Kamatis)', keywords: ['tomato', 'tomatoes', 'kamatis'] },
      { label: 'Ginger (Luya)', keywords: ['ginger', 'luya'] },
      { label: 'Tamarind (Sampalok)', keywords: ['tamarind', 'sinigang mix', 'sampalok'] },
      { label: 'Coconut Milk (Gata)', keywords: ['coconut milk', 'gata', 'coconut cream'] },
      { label: 'Calamansi / Lemon', keywords: ['calamansi', 'lemon', 'lime'] },
      { label: 'Soy Sauce & Vinegar', keywords: ['soy sauce', 'toyo', 'vinegar', 'suka'] },
      { label: 'Bagoong (Shrimp Paste)', keywords: ['bagoong', 'shrimp paste'] },
      { label: 'Peanut Butter', keywords: ['peanut butter', 'peanut'] },
    ],
  },
];

export const PantryMatcherModal: React.FC<PantryMatcherModalProps> = ({
  visible,
  onClose,
  onSelectRecipe,
}) => {
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const toggleIngredient = (label: string) => {
    setSelectedLabels((prev) => {
      if (prev.includes(label)) {
        return prev.filter((l) => l !== label);
      }
      return [...prev, label];
    });
  };

  const clearSelection = () => {
    setSelectedLabels([]);
  };

  // Find all keywords for selected labels
  const activeKeywords = useMemo(() => {
    const keywords: string[] = [];
    selectedLabels.forEach((lbl) => {
      for (const group of PANTRY_GROUPS) {
        const found = group.items.find((i) => i.label === lbl);
        if (found) {
          keywords.push(...found.keywords);
          break;
        }
      }
    });
    return keywords;
  }, [selectedLabels]);

  // Score and rank all 287 recipes based on selected ingredients
  const matchedRecipes = useMemo(() => {
    if (selectedLabels.length === 0) return [];

    const results: Array<{ recipe: Recipe; matchCount: number; matchedItems: string[] }> = [];

    FALLBACK_RECIPES.forEach((recipe) => {
      const allText = [
        recipe.title,
        recipe.description,
        recipe.mainIngredient || '',
        recipe.cutOrType || '',
        ...(recipe.ingredients?.map((i) => i.name) || []),
      ]
        .join(' ')
        .toLowerCase();

      const matched: string[] = [];
      selectedLabels.forEach((lbl) => {
        let opt: IngredientOption | undefined;
        for (const g of PANTRY_GROUPS) {
          opt = g.items.find((i) => i.label === lbl);
          if (opt) break;
        }
        if (opt && opt.keywords.some((k) => allText.includes(k.toLowerCase()))) {
          matched.push(lbl);
        }
      });

      if (matched.length > 0) {
        results.push({
          recipe,
          matchCount: matched.length,
          matchedItems: matched,
        });
      }
    });

    // Sort by match count descending
    results.sort((a, b) => b.matchCount - a.matchCount);
    return results;
  }, [selectedLabels]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.tagWrapper}>
              <View style={styles.dot} />
              <Text style={styles.tagText}>PRACTICAL DAILY UTILITY</Text>
            </View>
            <Text style={styles.title}>Anong Nasa Ref Mo?</Text>
            <Text style={styles.subtitle}>
              Tap ingredients you currently have. We'll match authentic dishes you can cook right now.
            </Text>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.8}>
            <X size={20} color={colors.textDark} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Active Selection Strip */}
          {selectedLabels.length > 0 ? (
            <View style={styles.selectedContainer}>
              <View style={styles.selectedHeader}>
                <Text style={styles.selectedCountText}>
                  {selectedLabels.length} {selectedLabels.length === 1 ? 'Ingredient' : 'Ingredients'} Selected
                </Text>
                <TouchableOpacity onPress={clearSelection} style={styles.clearBtn} activeOpacity={0.7}>
                  <RefreshCw size={12} color={colors.primary} />
                  <Text style={styles.clearBtnText}>Reset</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.selectedPillsRow}>
                {selectedLabels.map((lbl) => (
                  <TouchableOpacity
                    key={lbl}
                    style={styles.selectedChip}
                    onPress={() => toggleIngredient(lbl)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.selectedChipText}>{lbl}</Text>
                    <X size={13} color={colors.primary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}

          {/* Ingredient Pickers */}
          <View style={styles.pickerSection}>
            <Text style={styles.sectionHeading}>SELECT FROM YOUR PANTRY OR REF:</Text>

            {PANTRY_GROUPS.map((group) => (
              <View key={group.title} style={styles.groupBlock}>
                <Text style={styles.groupTitle}>{group.title}</Text>
                <View style={styles.chipsWrap}>
                  {group.items.map((item) => {
                    const isSelected = selectedLabels.includes(item.label);
                    return (
                      <TouchableOpacity
                        key={item.label}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => toggleIngredient(item.label)}
                        activeOpacity={0.75}
                      >
                        {isSelected ? <Check size={13} color="#FFFFFF" /> : null}
                        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>

          {/* Matched Dishes Results */}
          <View style={styles.resultsSection}>
            <View style={styles.resultsHeaderRow}>
              <Text style={styles.resultsHeading}>
                {selectedLabels.length === 0
                  ? 'POTENTIAL MATCHES'
                  : `MATCHING RECIPES (${matchedRecipes.length})`}
              </Text>
              {selectedLabels.length > 0 && (
                <Text style={styles.matchedHint}>Sorted by highest ingredient match</Text>
              )}
            </View>

            {selectedLabels.length === 0 ? (
              <View style={styles.emptyPrompt}>
                <ChefHat size={32} color={colors.primary} />
                <Text style={styles.emptyPromptTitle}>Pumili ng 2 o 3 Sangkap</Text>
                <Text style={styles.emptyPromptDesc}>
                  Halimbawa: Tap "Eggs (Itlog)" at "Eggplant (Talong)" para makita agad ang Tortang Talong, o "Pork Belly" at "Tamarind" para sa Sinigang.
                </Text>
              </View>
            ) : matchedRecipes.length === 0 ? (
              <View style={styles.emptyPrompt}>
                <Text style={styles.emptyPromptTitle}>Walang direktang tugma</Text>
                <Text style={styles.emptyPromptDesc}>
                  Subukang magbawas ng sangkap o pumili ng karaniwang protina at gulay.
                </Text>
              </View>
            ) : (
              <View style={styles.recipeList}>
                {matchedRecipes.map(({ recipe, matchCount, matchedItems }) => {
                  const isFullMatch = matchCount === selectedLabels.length;
                  return (
                    <View key={recipe.id} style={styles.resultItemWrapper}>
                      {/* Match Badge */}
                      <View style={[styles.matchBadge, isFullMatch ? styles.fullMatchBadge : styles.partialMatchBadge]}>
                        <Sparkles size={12} color={isFullMatch ? colors.primary : '#475569'} />
                        <Text style={[styles.matchBadgeText, isFullMatch ? styles.fullMatchText : styles.partialMatchText]}>
                          {isFullMatch
                            ? `✓ 100% Match (${matchCount} of ${selectedLabels.length} matched)`
                            : `${matchCount} of ${selectedLabels.length} matched (${matchedItems.join(', ')})`}
                        </Text>
                      </View>

                      <RecipeCard
                        recipe={recipe}
                        onPress={() => {
                          onSelectRecipe(recipe);
                          onClose();
                        }}
                        isBookmarked={isBookmarked(recipe.id)}
                        onToggleBookmark={() => toggleBookmark(recipe)}
                      />
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
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
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
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
    marginTop: 2,
    maxWidth: 280,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scrollContent: {
    padding: 16,
  },
  selectedContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 16,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedCountText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  selectedPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  selectedChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  pickerSection: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  groupBlock: {
    marginBottom: 14,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 6,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDark,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  resultsSection: {
    marginTop: 4,
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textDark,
  },
  matchedHint: {
    fontSize: 11,
    color: colors.textMuted,
  },
  emptyPrompt: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyPromptTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textDark,
    marginTop: 10,
    marginBottom: 4,
  },
  emptyPromptDesc: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  recipeList: {
    gap: 16,
  },
  resultItemWrapper: {
    marginBottom: 4,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: -4,
  },
  fullMatchBadge: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  partialMatchBadge: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  matchBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  fullMatchText: {
    color: colors.primary,
  },
  partialMatchText: {
    color: '#475569',
  },
});
