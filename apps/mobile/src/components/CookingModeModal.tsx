import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react-native';
import { Step, Recipe } from '@kusinadex/types';
import { colors } from '../theme/colors';

interface CookingModeModalProps {
  visible: boolean;
  onClose: () => void;
  recipe: Recipe;
  steps: Step[];
  onFinishCooking?: () => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({
  visible,
  onClose,
  recipe,
  steps,
  onFinishCooking,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const sortedSteps = [...steps].sort((a, b) => a.stepNumber - b.stepNumber);
  const totalSteps = sortedSteps.length;
  const currentStep = sortedSteps[currentStepIndex];

  // Initialize timer when step changes
  useEffect(() => {
    if (currentStep?.timerMinutes) {
      setTimerSeconds(currentStep.timerMinutes * 60);
    } else {
      setTimerSeconds(null);
    }
    setIsTimerRunning(false);
  }, [currentStepIndex, currentStep]);

  // Handle countdown interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const toggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    if (currentStep?.timerMinutes) {
      setTimerSeconds(currentStep.timerMinutes * 60);
    }
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const nextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  if (!visible || !currentStep) return null;

  const isLastStep = currentStepIndex === totalSteps - 1;
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.safeArea}>
        {/* Minimal Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
            <X size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.recipeTitle} numberOfLines={1}>
              {recipe.title}
            </Text>
            <Text style={styles.stepCounter}>
              Step {currentStepIndex + 1} of {totalSteps}
            </Text>
          </View>

          <View style={{ width: 38 }} />
        </View>

        {/* Minimal Hairline Progress Bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>

        {/* Step Body */}
        <ScrollView contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
          {/* Step Pill */}
          <View style={styles.stepPill}>
            <Text style={styles.stepPillText}>
              STEP {String(currentStep.stepNumber).padStart(2, '0')}
            </Text>
          </View>

          {/* Large Instruction */}
          <Text style={styles.instructionText}>{currentStep.instruction}</Text>

          {/* Minimal Timer if step specifies minutes */}
          {timerSeconds !== null ? (
            <View style={styles.timerCard}>
              <View style={styles.timerHeader}>
                <Clock size={16} color={colors.primary} />
                <Text style={styles.timerLabel}>STEP TIMER</Text>
              </View>

              <Text style={styles.timerDigits}>{formatTime(timerSeconds)}</Text>

              <View style={styles.timerControls}>
                <TouchableOpacity
                  onPress={toggleTimer}
                  style={[styles.timerButton, isTimerRunning ? styles.timerPause : styles.timerPlay]}
                  activeOpacity={0.85}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause size={16} color="#FFFFFF" />
                      <Text style={styles.timerBtnText}>Pause</Text>
                    </>
                  ) : (
                    <>
                      <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
                      <Text style={styles.timerBtnText}>Start Timer</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={resetTimer} style={styles.timerResetBtn} activeOpacity={0.7}>
                  <RotateCcw size={15} color={colors.textSecondary} />
                  <Text style={styles.timerResetText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {/* Minimal Chef Tip */}
          {currentStep.tips ? (
            <View style={styles.tipWrapper}>
              <Text style={styles.tipEyebrow}>Chef's Note</Text>
              <Text style={styles.tipText}>{currentStep.tips}</Text>
            </View>
          ) : null}

          {isLastStep ? (
            <View style={styles.finishedCard}>
              <CheckCircle2 size={32} color={colors.primary} />
              <Text style={styles.finishedTitle}>All Steps Complete!</Text>
              <Text style={styles.finishedSubtitle}>
                Your authentic Filipino dish is ready to serve. Kain tayo (Let's eat)!
              </Text>
            </View>
          ) : null}
        </ScrollView>

        {/* Minimal Bottom Navigation Bar */}
        <View style={styles.footerControls}>
          <TouchableOpacity
            onPress={prevStep}
            disabled={currentStepIndex === 0}
            style={[styles.navButton, styles.prevButton, currentStepIndex === 0 && styles.navDisabled]}
            activeOpacity={0.8}
          >
            <ChevronLeft size={18} color={currentStepIndex === 0 ? colors.textMuted : colors.textPrimary} />
            <Text
              style={[
                styles.prevButtonText,
                currentStepIndex === 0 && styles.navTextDisabled,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          {isLastStep ? (
            <TouchableOpacity
              onPress={() => {
                onFinishCooking?.();
                onClose();
              }}
              style={[styles.navButton, styles.finishButton]}
              activeOpacity={0.85}
            >
              <Text style={styles.finishButtonText}>Finish Cooking</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={nextStep}
              style={[styles.navButton, styles.nextButton]}
              activeOpacity={0.85}
            >
              <Text style={styles.nextButtonText}>Next Step</Text>
              <ChevronRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  recipeTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  stepCounter: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '800',
    marginTop: 1,
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#F1F5F9',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  bodyContent: {
    padding: 24,
    alignItems: 'center',
  },
  stepPill: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 20,
  },
  stepPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  instructionText: {
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 28,
  },
  timerCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  timerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  timerDigits: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: 2,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
    marginVertical: 4,
  },
  timerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 6,
  },
  timerPlay: {
    backgroundColor: colors.primary,
  },
  timerPause: {
    backgroundColor: '#DC2626',
  },
  timerBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  timerResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  timerResetText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tipWrapper: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 6,
  },
  tipEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#334155',
    fontWeight: '400',
  },
  finishedCard: {
    width: '100%',
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  finishedTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 8,
  },
  finishedSubtitle: {
    fontSize: 13,
    color: colors.primaryDark,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  footerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  navButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  prevButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  prevButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  nextButton: {
    backgroundColor: colors.primary,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  finishButton: {
    backgroundColor: colors.primary,
  },
  finishButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  navDisabled: {
    opacity: 0.4,
    borderColor: '#F1F5F9',
  },
  navTextDisabled: {
    color: colors.textMuted,
  },
});
