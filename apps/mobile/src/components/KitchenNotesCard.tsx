import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Edit3, Check, Sparkles } from 'lucide-react-native';
import { colors } from '../theme/colors';

interface KitchenNotesCardProps {
  initialNote?: string;
  onSaveNote: (note: string) => void;
}

export const KitchenNotesCard: React.FC<KitchenNotesCardProps> = ({
  initialNote = '',
  onSaveNote,
}) => {
  const [note, setNote] = useState(initialNote);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote]);

  const handleSave = () => {
    onSaveNote(note.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrapper}>
          <Edit3 size={16} color={colors.primary} />
          <Text style={styles.title}>Tala ng Kusinero (My Cooking Notes)</Text>
        </View>

        {isSaved ? (
          <View style={styles.savedBadge}>
            <Check size={12} color={colors.primary} />
            <Text style={styles.savedText}>Saved</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.subtitle}>
        Write personal reminders, extra seasonings, or timing tweaks for next time.
      </Text>

      <TextInput
        style={styles.textInput}
        multiline
        placeholder="Halimbawa: 'Dagdagan ng 2 pirasong calamansi sa susunod, at pakuluan ng 10 minuto pa para mas malambot.'"
        placeholderTextColor={colors.textLight}
        value={note}
        onChangeText={(text) => {
          setNote(text);
          setIsSaved(false);
        }}
        onBlur={handleSave}
      />

      {note.trim() !== (initialNote || '').trim() ? (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveButtonText}>Save Note</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 18,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  savedText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    fontSize: 13,
    color: colors.textDark,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  saveButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
