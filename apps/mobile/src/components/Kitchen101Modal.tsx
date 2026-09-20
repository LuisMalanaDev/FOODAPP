import React from 'react';
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
import { X, Flame, UtensilsCrossed, Sparkles, ChefHat, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { colors } from '../theme/colors';

interface Kitchen101ModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTechnique?: (searchQuery: string) => void;
}

interface Technique {
  id: string;
  name: string;
  filipinoName: string;
  tagline: string;
  order: string;
  goldenRule: string;
  sensoryCue: string;
  searchTag: string;
  sampleDishes: string[];
}

const TECHNIQUES: Technique[] = [
  {
    id: 'gisa',
    name: 'The Holy Sauté',
    filipinoName: 'Ang Banal na Gisa',
    tagline: 'The fragrant aromatic foundation of 80% of Filipino viands.',
    order: 'Sibuyas muna (sweat until sweet) ➔ Bawang (cook until pale gold) ➔ Kamatis (crush until soft & juicy).',
    goldenRule: 'Never burn the garlic! Bitter burnt garlic will ruin the entire dish. Sauté garlic over gentle medium-low heat.',
    sensoryCue: 'Amoy: Sweet, nutty garlic aroma without any acrid smoke. Hitsura: Tomatoes have collapsed into a rich paste.',
    searchTag: 'ginisang',
    sampleDishes: ['Pinakbet', 'Ginisang Monggo', 'Chop Suey', 'Tortang Giniling'],
  },
  {
    id: 'paksiw',
    name: 'The Acid Simmer',
    filipinoName: 'Paksiw at Adobo Simmer',
    tagline: 'Preserving and tenderizing meats in natural vinegar and aromatics.',
    order: 'Meat + Suka + Bawang + Paminta ➔ Pakuluan nang HINDI HINAHALO ➔ Add soy sauce / water once cooked.',
    goldenRule: 'BAWAL HALUIN! Never stir adobo or paksiw right after adding vinegar. Let it boil uncovered for 3–5 minutes so raw acid evaporates.',
    sensoryCue: 'Amoy: The sharp, stinging vapor softens into a deep, savory-sour fragrance.',
    searchTag: 'adobo',
    sampleDishes: ['Adobong Baboy', 'Paksiw na Bangus', 'Adobong Sitaw', 'Chicken Adobo'],
  },
  {
    id: 'sinigang',
    name: 'The Sour Broth Harmony',
    filipinoName: 'Timplang Sinigang',
    tagline: 'Comforting sour soup balanced with savory patis and native greens.',
    order: 'Boil tough meats low & slow ➔ Add souring agent & vegetables ➔ Drop tender greens at the very end.',
    goldenRule: 'Turn off the stove right as you drop the kangkong or talbos ng kamote. The residual broth heat will cook them to a crisp, vibrant green.',
    sensoryCue: 'Hitsura: Broth has a gentle cloudiness with a natural rim of glistening meat glaze.',
    searchTag: 'sinigang',
    sampleDishes: ['Sinigang na Baboy', 'Sinigang na Hipon', 'Sinigang na Bangus', 'Bulalo'],
  },
  {
    id: 'ginataan',
    name: 'The Silky Coconut Simmer',
    filipinoName: 'Ginataang Malapot',
    tagline: 'Rich coconut cream simmering that coats every ingredient in velvety richness.',
    order: 'Cook ingredients in pangalawang gata (thin extract) ➔ Finish with kakang gata (thick cream) on low heat.',
    goldenRule: 'Never boil coconut cream over high heat! High heat breaks the emulsion and curdles the milk into oily clumps.',
    sensoryCue: 'Hitsura: Silky, glossy sauce that coats the back of a spoon without separating.',
    searchTag: 'ginataang',
    sampleDishes: ['Bicolano Laing', 'Bicol Express', 'Ginataang Tilapia', 'Ginataang Kalabasa'],
  },
  {
    id: 'prito',
    name: 'The Crackling Crisp',
    filipinoName: 'Pritong Malutong (Bagnet / Kawali)',
    tagline: 'Achieving blistering, airy crackling skin safely without oil explosions.',
    order: 'Boil meat until tender ➔ Air-dry or chill until skin is bone-dry ➔ Deep-fry in 350°F (175°C) oil.',
    goldenRule: 'Moisture is the enemy of crunch! Dry the skin thoroughly before it touches hot oil. Cold, dry skin blisters best.',
    sensoryCue: 'Tunog: Tapping the cooked skin with the back of a metal spoon makes a hollow, woody crunch sound.',
    searchTag: 'crispy',
    sampleDishes: ['Ilocos Bagnet', 'Crispy Lechon Kawali', 'Crispy Pata', 'Fried Chicken'],
  },
];

export const Kitchen101Modal: React.FC<Kitchen101ModalProps> = ({
  visible,
  onClose,
  onSelectTechnique,
}) => {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.tagWrapper}>
              <View style={styles.dot} />
              <Text style={styles.tagText}>PRACTICAL CULINARY GUIDE</Text>
            </View>
            <Text style={styles.title}>Filipino Kitchen 101</Text>
            <Text style={styles.subtitle}>
              Master these 5 core disciplines to cook almost any Filipino dish with confidence.
            </Text>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.8}>
            <X size={20} color={colors.textDark} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {TECHNIQUES.map((tech, idx) => (
            <View key={tech.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>0{idx + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.techFilipinoName}>{tech.filipinoName}</Text>
                  <Text style={styles.techName}>{tech.name}</Text>
                </View>
              </View>

              <Text style={styles.tagline}>{tech.tagline}</Text>

              {/* Sequence / Order */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionLabel}>TAMANG PAGKAKASUNOD-SUNOD (SEQUENCE):</Text>
                <Text style={styles.sectionBody}>{tech.order}</Text>
              </View>

              {/* Golden Rule */}
              <View style={styles.goldenRuleBlock}>
                <View style={styles.goldenRuleHeader}>
                  <Sparkles size={14} color={colors.primary} />
                  <Text style={styles.goldenRuleTitle}>THE GOLDEN RULE</Text>
                </View>
                <Text style={styles.goldenRuleText}>{tech.goldenRule}</Text>
              </View>

              {/* Sensory Cues */}
              <View style={styles.cueBlock}>
                <Text style={styles.cueLabel}>TIYEMPO & SENSORY CUE (PAANO MALALAMAN):</Text>
                <Text style={styles.cueText}>{tech.sensoryCue}</Text>
              </View>

              {/* Sample Dishes & Quick Filter */}
              <View style={styles.actionRow}>
                <View style={styles.sampleDishesWrapper}>
                  <Text style={styles.sampleLabel}>Examples: </Text>
                  <Text style={styles.sampleDishesText}>{tech.sampleDishes.join(', ')}</Text>
                </View>

                {onSelectTechnique ? (
                  <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => {
                      onSelectTechnique(tech.searchTag);
                      onClose();
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.filterButtonText}>Explore Dishes</Text>
                    <ChevronRight size={14} color={colors.primary} />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ))}

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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  techFilipinoName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textDark,
  },
  techName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tagline: {
    fontSize: 13,
    color: colors.textMedium,
    lineHeight: 18,
    marginBottom: 14,
  },
  sectionBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionBody: {
    fontSize: 12,
    color: colors.textDark,
    lineHeight: 18,
    fontWeight: '500',
  },
  goldenRuleBlock: {
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 10,
  },
  goldenRuleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  goldenRuleTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  goldenRuleText: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 17,
    fontWeight: '600',
  },
  cueBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  cueLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cueText: {
    fontSize: 12,
    color: colors.textDark,
    lineHeight: 17,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  sampleDishesWrapper: {
    flex: 1,
    marginRight: 8,
  },
  sampleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  sampleDishesText: {
    fontSize: 11,
    color: colors.textMedium,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  filterButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
});
