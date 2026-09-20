import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Soup,
  Flame,
  Sparkles,
  UtensilsCrossed,
  Cake,
  Utensils,
  Beef,
  Fish,
  Carrot,
  Egg,
} from 'lucide-react-native';
import { Category } from '@kusinadex/types';
import { colors } from '../theme/colors';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelectCategory: (categoryId?: string) => void;
  selectedSubCategory?: string;
  onSelectSubCategory?: (subCategory?: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  selectedSubCategory,
  onSelectSubCategory,
}) => {
  const renderIcon = (iconName: string, isSelected: boolean) => {
    const iconColor = isSelected ? '#FFFFFF' : colors.primary;
    const size = 17;

    switch (iconName?.toLowerCase()) {
      case 'ham':
      case 'beef':
        return <Beef size={size} color={iconColor} />;
      case 'drumstick':
        return <Flame size={size} color={iconColor} />;
      case 'fish':
        return <Fish size={size} color={iconColor} />;
      case 'carrot':
        return <Carrot size={size} color={iconColor} />;
      case 'egg':
        return <Egg size={size} color={iconColor} />;
      case 'cake':
        return <Cake size={size} color={iconColor} />;
      case 'utensilscrossed':
        return <UtensilsCrossed size={size} color={iconColor} />;
      case 'soup':
        return <Soup size={size} color={iconColor} />;
      case 'sparkles':
        return <Sparkles size={size} color={iconColor} />;
      default:
        return <Utensils size={size} color={iconColor} />;
    }
  };

  const selectedCat = categories.find((c) => c.id === selectedCategoryId);

  return (
    <View style={styles.container}>
      {/* Category Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Food Disciplines & Ingredients</Text>
        {selectedCategoryId ? (
          <TouchableOpacity onPress={() => onSelectCategory(undefined)}>
            <Text style={styles.resetText}>Show All</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Main Category Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 'All' button */}
        <TouchableOpacity
          onPress={() => onSelectCategory(undefined)}
          activeOpacity={0.7}
          style={[styles.pill, !selectedCategoryId && styles.pillActive]}
        >
          <Utensils size={17} color={!selectedCategoryId ? '#FFFFFF' : colors.textSecondary} />
          <Text style={[styles.pillText, !selectedCategoryId && styles.pillTextActive]}>
            All
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onSelectCategory(isSelected ? undefined : cat.id)}
              activeOpacity={0.7}
              style={[styles.pill, isSelected && styles.pillActive]}
            >
              {renderIcon(cat.iconName, isSelected)}
              <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Secondary Dynamic Sub-Category / Cut Filter Bar */}
      {selectedCat && selectedCat.subCategories && selectedCat.subCategories.length > 0 ? (
        <View style={styles.subCategoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subCategoryScroll}
          >
            <TouchableOpacity
              onPress={() => onSelectSubCategory?.(undefined)}
              activeOpacity={0.7}
              style={[styles.subPill, !selectedSubCategory && styles.subPillActive]}
            >
              <Text style={[styles.subPillText, !selectedSubCategory && styles.subPillTextActive]}>
                All Types
              </Text>
            </TouchableOpacity>

            {selectedCat.subCategories.map((sub) => {
              const isSubSelected = selectedSubCategory === sub;
              return (
                <TouchableOpacity
                  key={sub}
                  onPress={() => onSelectSubCategory?.(isSubSelected ? undefined : sub)}
                  activeOpacity={0.7}
                  style={[styles.subPill, isSubSelected && styles.subPillActive]}
                >
                  <Text style={[styles.subPillText, isSubSelected && styles.subPillTextActive]}>
                    {sub}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  resetText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  subCategoryContainer: {
    marginTop: 10,
    paddingTop: 8,
  },
  subCategoryScroll: {
    paddingHorizontal: 20,
    gap: 6,
  },
  subPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
  },
  subPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  subPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  subPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
