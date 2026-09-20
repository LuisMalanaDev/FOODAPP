import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, MapPin, Bookmark, Flame } from 'lucide-react-native';
import { Recipe } from '@kusinadex/types';
import { colors } from '../theme/colors';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = React.memo(({
  recipe,
  onPress,
  isBookmarked,
  onToggleBookmark,
}) => {
  const renderSpiceBadge = () => {
    if (recipe.spiceLevel === 'SPICY') {
      return (
        <View style={[styles.spiceBadge, { backgroundColor: '#F1F5F9' }]}>
          <Flame size={11} color="#64748B" />
          <Text style={[styles.spiceText, { color: '#475569' }]}>Spicy</Text>
        </View>
      );
    }
    if (recipe.spiceLevel === 'MILD') {
      return (
        <View style={[styles.spiceBadge, { backgroundColor: '#F8FAF8' }]}>
          <Flame size={11} color="#94A3B8" />
          <Text style={[styles.spiceText, { color: '#64748B' }]}>Mild</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: recipe.imageUrl }} style={styles.thumbnail} resizeMode="cover" />
        <TouchableOpacity
          style={[styles.bookmarkButton, isBookmarked && styles.bookmarkActive]}
          onPress={(e) => {
            e.stopPropagation();
            onToggleBookmark();
          }}
          activeOpacity={0.8}
        >
          <Bookmark
            size={16}
            color={isBookmarked ? '#FFFFFF' : '#44403C'}
            fill={isBookmarked ? '#FFFFFF' : 'none'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.details}>
        <View style={styles.metaRow}>
          {recipe.cutOrType ? (
            <View style={styles.cutBadge}>
              <Text style={styles.cutText} numberOfLines={1}>
                {recipe.cutOrType}
              </Text>
            </View>
          ) : null}
          <View style={styles.regionBadge}>
            <MapPin size={10} color={colors.primary} />
            <Text style={styles.regionText} numberOfLines={1}>
              {recipe.originRegion.split('/')[0].trim()}
            </Text>
          </View>
          {renderSpiceBadge()}
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {recipe.title}
        </Text>
        {recipe.englishTitle ? (
          <Text style={styles.englishTitle} numberOfLines={1}>
            {recipe.englishTitle}
          </Text>
        ) : null}

        <View style={styles.footerRow}>
          <View style={styles.statItem}>
            <Clock size={13} color={colors.textSecondary} />
            <Text style={styles.statText}>{recipe.cookTimeMinutes} min</Text>
          </View>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.servingsText}>{recipe.servings} servings</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
  },
  imageWrapper: {
    width: 110,
    height: 110,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkActive: {
    backgroundColor: colors.primary,
  },
  details: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cutBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cutText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  regionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  regionText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  spiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  spiceText: {
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },
  englishTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  bullet: {
    color: colors.textMuted,
    fontSize: 12,
  },
  servingsText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
