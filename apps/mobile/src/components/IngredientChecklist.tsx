import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckSquare, Square, CheckCheck, RotateCcw, Users } from 'lucide-react-native';
import { Ingredient } from '@kusinadex/types';
import { colors } from '../theme/colors';

interface IngredientChecklistProps {
  ingredients: Ingredient[];
  defaultServings?: number;
}

function formatScaledAmount(amount: number, multiplier: number): string {
  if (!amount || amount <= 0) return '';
  const scaled = Math.round(amount * multiplier * 100) / 100;
  if (scaled % 1 === 0) return String(scaled);
  return scaled.toFixed(scaled % 0.1 === 0 ? 1 : 2).replace(/\.?0+$/, '');
}

export const IngredientChecklist: React.FC<IngredientChecklistProps> = ({
  ingredients,
  defaultServings = 4,
}) => {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [multiplier, setMultiplier] = useState<number>(1);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const checkAll = () => {
    setCheckedIds(new Set(ingredients.map((i) => i.id)));
  };

  const resetAll = () => {
    setCheckedIds(new Set());
  };

  const checkedCount = checkedIds.size;
  const totalCount = ingredients.length;
  const progressPercent = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Portion Scaler (Solo, Pair, Pamilya) */}
      <View style={styles.portionBar}>
        <View style={styles.portionLabelGroup}>
          <Users size={14} color={colors.primary} />
          <Text style={styles.portionLabel}>PORTION SCALER:</Text>
        </View>

        <View style={styles.portionToggles}>
          <TouchableOpacity
            style={[styles.portionBtn, multiplier === 0.5 && styles.portionBtnActive]}
            onPress={() => setMultiplier(0.5)}
            activeOpacity={0.8}
          >
            <Text style={[styles.portionBtnText, multiplier === 0.5 && styles.portionBtnTextActive]}>
              Solo (0.5x)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.portionBtn, multiplier === 1 && styles.portionBtnActive]}
            onPress={() => setMultiplier(1)}
            activeOpacity={0.8}
          >
            <Text style={[styles.portionBtnText, multiplier === 1 && styles.portionBtnTextActive]}>
              Pair (1x)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.portionBtn, multiplier === 2 && styles.portionBtnActive]}
            onPress={() => setMultiplier(2)}
            activeOpacity={0.8}
          >
            <Text style={[styles.portionBtnText, multiplier === 2 && styles.portionBtnTextActive]}>
              Pamilya (2x)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress & Quick Actions */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Ingredients ({totalCount})</Text>
          <Text style={styles.subtitle}>
            {checkedCount === totalCount && totalCount > 0
              ? '🎉 All ingredients prepared and ready!'
              : `${checkedCount} of ${totalCount} ingredients checked`}
          </Text>
        </View>

        <View style={styles.actionsGroup}>
          <TouchableOpacity onPress={checkAll} style={styles.iconBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <CheckCheck size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={resetAll} style={styles.iconBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <RotateCcw size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>

      {/* Items list */}
      <View style={styles.list}>
        {ingredients.map((item) => {
          const isChecked = checkedIds.has(item.id);
          const formattedAmount = item.amount > 0 ? formatScaledAmount(item.amount, multiplier) : '';

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => toggleCheck(item.id)}
              style={[styles.itemRow, isChecked && styles.itemRowChecked]}
            >
              <View style={styles.checkboxContainer}>
                {isChecked ? (
                  <CheckSquare size={22} color={colors.primary} />
                ) : (
                  <Square size={22} color={colors.textMuted} />
                )}
              </View>

              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, isChecked && styles.itemNameChecked]}>
                  {formattedAmount ? `${formattedAmount} ${item.unit} ` : ''}
                  {item.name}
                </Text>
                {item.notes ? (
                  <Text style={[styles.itemNotes, isChecked && styles.itemNotesChecked]}>
                    {item.notes}
                  </Text>
                ) : null}
              </View>

              {item.isOptional ? (
                <View style={styles.optionalBadge}>
                  <Text style={styles.optionalText}>Optional</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  portionBar: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  portionLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  portionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  portionToggles: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 2,
    gap: 4,
  },
  portionBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 6,
  },
  portionBtnActive: {
    backgroundColor: colors.primary,
  },
  portionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  portionBtnTextActive: {
    color: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  list: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  itemRowChecked: {
    backgroundColor: '#F8FAF8',
    borderColor: '#E2E8F0',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  itemNotes: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemNotesChecked: {
    color: colors.textMuted,
  },
  optionalBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  optionalText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});
