import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, MapPin, Sparkles, ChevronRight, Bookmark } from 'lucide-react-native';
import { Recipe } from '@kusinadex/types';
import { colors } from '../theme/colors';

interface BentoCardProps {
  recipe: Recipe;
  onPress: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  recipe,
  onPress,
  isBookmarked,
  onToggleBookmark,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={styles.cardContainer}
    >
      <Image source={{ uri: recipe.imageUrl }} style={styles.heroImage} resizeMode="cover" />

      {/* Dark gradient overlay */}
      <View style={styles.overlay} />

      {/* Top badges */}
      <View style={styles.topRow}>
        <View style={styles.dishOfTheDayBadge}>
          <Sparkles size={13} color="#FFFFFF" />
          <Text style={styles.badgeText}>Dish of the Day</Text>
        </View>

        <TouchableOpacity
          onPress={onToggleBookmark}
          style={[styles.bookmarkButton, isBookmarked && styles.bookmarkActive]}
          activeOpacity={0.8}
        >
          <Bookmark size={18} color="#FFFFFF" fill={isBookmarked ? '#FFFFFF' : 'none'} />
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <View style={styles.tagsRow}>
          <View style={styles.tagPill}>
            <Clock size={12} color="#E7E5E4" />
            <Text style={styles.tagText}>{recipe.cookTimeMinutes} min</Text>
          </View>
          <View style={styles.tagPill}>
            <MapPin size={12} color="#E7E5E4" />
            <Text style={styles.tagText}>{recipe.originRegion}</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {recipe.title}
        </Text>
        {recipe.englishTitle ? (
          <Text style={styles.englishTitle} numberOfLines={1}>
            {recipe.englishTitle}
          </Text>
        ) : null}

        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Cook Now</Text>
            <ChevronRight size={16} color="#FFFFFF" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    height: 320,
    position: 'relative',
    borderRadius: 24,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  dishOfTheDayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#15803D',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  bookmarkButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bookmarkActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  contentSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  tagText: {
    color: '#F5F5F4',
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  englishTitle: {
    color: '#DCFCE7',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  description: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    gap: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
