import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Check, RotateCcw } from 'lucide-react-native';
import { Step } from '@kusinadex/types';
import { colors } from '../theme/colors';

interface CookingStepsListProps {
  steps: Step[];
}

export const CookingStepsList: React.FC<CookingStepsListProps> = ({ steps }) => {
  const sorted = [...steps].sort((a, b) => a.stepNumber - b.stepNumber);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = sorted.length > 0 ? (completedCount / sorted.length) * 100 : 0;

  const resetAll = () => {
    setCompletedSteps({});
  };

  const totalMinutes = sorted.reduce((acc, s) => acc + (s.timerMinutes || 0), 0);

  return (
    <View style={styles.container}>
      {/* Minimal Header with Metadata & Progress */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>COOKING PROCEDURE</Text>
          <Text style={styles.title}>
            {sorted.length} {sorted.length === 1 ? 'Step' : 'Steps'}
            {totalMinutes > 0 ? ` • ~${totalMinutes} mins total` : ''}
          </Text>
        </View>

        {completedCount > 0 && (
          <TouchableOpacity onPress={resetAll} style={styles.resetButton} activeOpacity={0.7}>
            <RotateCcw size={12} color={colors.textSecondary} />
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Progress Bar (appears when any step is checked) */}
      {completedCount > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {completedCount} of {sorted.length} completed
          </Text>
        </View>
      )}

      {/* Steps List */}
      <View style={styles.list}>
        {sorted.map((step, index) => {
          const isDone = !!completedSteps[step.stepNumber];
          const isLast = index === sorted.length - 1;

          return (
            <View key={step.id || step.stepNumber} style={styles.stepItemWrapper}>
              {/* Stepper Node & Vertical Spine */}
              <View style={styles.stepperColumn}>
                <TouchableOpacity
                  onPress={() => toggleStep(step.stepNumber)}
                  style={[styles.nodeCircle, isDone && styles.nodeCircleDone]}
                  activeOpacity={0.8}
                >
                  {isDone ? (
                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  ) : (
                    <Text style={styles.nodeNumber}>
                      {String(step.stepNumber).padStart(2, '0')}
                    </Text>
                  )}
                </TouchableOpacity>

                {!isLast && <View style={[styles.verticalSpine, isDone && styles.verticalSpineDone]} />}
              </View>

              {/* Step Content Card */}
              <TouchableOpacity
                onPress={() => toggleStep(step.stepNumber)}
                style={[styles.stepCard, isDone && styles.stepCardDone]}
                activeOpacity={0.9}
              >
                {/* Card Top Strip */}
                <View style={styles.cardHeader}>
                  <Text style={[styles.stepLabel, isDone && styles.stepLabelDone]}>
                    STEP {step.stepNumber}
                  </Text>

                  {step.timerMinutes ? (
                    <View style={styles.timerPill}>
                      <Clock size={12} color={colors.primary} />
                      <Text style={styles.timerPillText}>{step.timerMinutes} mins</Text>
                    </View>
                  ) : null}
                </View>

                {/* Instruction */}
                <Text style={[styles.instruction, isDone && styles.instructionDone]}>
                  {step.instruction}
                </Text>

                {/* Chef's Tip - Clean Plain Box */}
                {step.tips ? (
                  <View style={styles.tipWrapper}>
                    <Text style={styles.tipEyebrow}>Chef's Note</Text>
                    <Text style={styles.tipText}>{step.tips}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  resetText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  progressContainer: {
    marginBottom: 16,
    gap: 6,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  list: {
    marginTop: 4,
  },
  stepItemWrapper: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  stepperColumn: {
    alignItems: 'center',
    width: 36,
    marginRight: 10,
  },
  nodeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  nodeCircleDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  nodeNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  verticalSpine: {
    width: 1.5,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  verticalSpineDone: {
    backgroundColor: colors.primary,
  },
  stepCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepCardDone: {
    backgroundColor: '#FAFDFB',
    borderColor: '#CBD5E1',
    opacity: 0.85,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  stepLabelDone: {
    color: colors.textSecondary,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timerPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  instruction: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  instructionDone: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  tipWrapper: {
    marginTop: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tipEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 3,
  },
  tipText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#334155',
    fontWeight: '400',
  },
});
