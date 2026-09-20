import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react-native';
import { colors } from '../theme/colors';

export interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export const PaginationControl: React.FC<PaginationControlProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [12, 24, 48],
}) => {
  if (totalItems === 0 || totalPages <= 1) {
    if (totalItems > 0) {
      return (
        <View style={styles.singlePageContainer}>
          <Text style={styles.singlePageText}>
            Showing all {totalItems} {totalItems === 1 ? 'dish' : 'dishes'}
          </Text>
        </View>
      );
    }
    return null;
  }

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Calculate smart page window
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 3) {
        pages.push(2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <View style={styles.container}>
      {/* Items Summary & Page Size Toggle */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          Showing <Text style={styles.boldText}>{startItem}–{endItem}</Text> of{' '}
          <Text style={styles.boldText}>{totalItems}</Text> recipes
        </Text>

        {onPageSizeChange && (
          <View style={styles.pageSizeRow}>
            <Text style={styles.perPageLabel}>Per page:</Text>
            {pageSizeOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => onPageSizeChange(opt)}
                style={[
                  styles.pageSizeChip,
                  pageSize === opt && styles.pageSizeChipActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.pageSizeChipText,
                    pageSize === opt && styles.pageSizeChipTextActive,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Pagination Controls */}
      <View style={styles.controlsRow}>
        {/* Jump to First Page */}
        <TouchableOpacity
          onPress={() => onPageChange(1)}
          disabled={currentPage === 1}
          style={[styles.arrowButton, currentPage === 1 && styles.disabledButton]}
          activeOpacity={0.7}
          accessibilityLabel="Go to first page"
        >
          <ChevronsLeft size={18} color={currentPage === 1 ? '#CBD5E1' : colors.primary} />
        </TouchableOpacity>

        {/* Previous Button */}
        <TouchableOpacity
          onPress={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          style={[styles.arrowButton, currentPage === 1 && styles.disabledButton]}
          activeOpacity={0.7}
          accessibilityLabel="Previous page"
        >
          <ChevronLeft size={18} color={currentPage === 1 ? '#CBD5E1' : colors.primary} />
        </TouchableOpacity>

        {/* Numbered Buttons */}
        <View style={styles.pageNumbersContainer}>
          {pageNumbers.map((p, idx) => {
            if (typeof p === 'string') {
              return (
                <View key={`ellipsis-${idx}`} style={styles.ellipsisBox}>
                  <Text style={styles.ellipsisText}>•••</Text>
                </View>
              );
            }

            const isActive = p === currentPage;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => onPageChange(p)}
                style={[styles.pageButton, isActive && styles.pageButtonActive]}
                activeOpacity={0.7}
                accessibilityLabel={`Page ${p}`}
              >
                <Text style={[styles.pageButtonText, isActive && styles.pageButtonTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          style={[styles.arrowButton, currentPage === totalPages && styles.disabledButton]}
          activeOpacity={0.7}
          accessibilityLabel="Next page"
        >
          <ChevronRight size={18} color={currentPage === totalPages ? '#CBD5E1' : colors.primary} />
        </TouchableOpacity>

        {/* Jump to Last Page */}
        <TouchableOpacity
          onPress={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          style={[styles.arrowButton, currentPage === totalPages && styles.disabledButton]}
          activeOpacity={0.7}
          accessibilityLabel="Go to last page"
        >
          <ChevronsRight size={18} color={currentPage === totalPages ? '#CBD5E1' : colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Indicator Text */}
      <View style={styles.pageIndicatorContainer}>
        <Text style={styles.pageIndicatorText}>
          Page <Text style={styles.boldText}>{currentPage}</Text> of{' '}
          <Text style={styles.boldText}>{totalPages}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  singlePageContainer: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singlePageText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryText: {
    fontSize: 13,
    color: '#64748B',
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  pageSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  perPageLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginRight: 2,
  },
  pageSizeChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pageSizeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pageSizeChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  pageSizeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#F8FAFC',
    borderColor: '#F1F5F9',
    opacity: 0.6,
  },
  pageNumbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pageButton: {
    minWidth: 36,
    height: 36,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pageButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  pageButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  ellipsisBox: {
    width: 24,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ellipsisText: {
    fontSize: 11,
    color: '#94A3B8',
    letterSpacing: 1,
  },
  pageIndicatorContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  pageIndicatorText: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
