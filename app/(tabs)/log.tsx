import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLogStore } from '@/stores/logStore';

export default function LogScreen() {
  const { 
    entries, 
    selectedDate, 
    setSelectedDate, 
    getTotalCalories, 
    getAverageHealthScore,
    getEntriesForDate 
  } = useLogStore();

  const displayEntries = getEntriesForDate(selectedDate);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 8) return '#34C759'; // Green
    if (score >= 6) return '#FF9500'; // Orange
    return '#FF3B30'; // Red
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Daily Log
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Track your nutrition journey
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.summaryCard}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Today's Summary
        </ThemedText>
        
        <ThemedView style={styles.summaryRow}>
          <ThemedView style={styles.summaryItem}>
            <ThemedText style={styles.summaryValue}>{getTotalCalories()}</ThemedText>
            <ThemedText style={styles.summaryLabel}>Total Calories</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.summaryItem}>
            <ThemedText style={styles.summaryValue}>{displayEntries.length}</ThemedText>
            <ThemedText style={styles.summaryLabel}>Items Scanned</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.summaryItem}>
            <ThemedText style={[styles.summaryValue, { color: getHealthScoreColor(getAverageHealthScore()) }]}>
              {getAverageHealthScore()}
            </ThemedText>
            <ThemedText style={styles.summaryLabel}>Avg Health Score</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, selectedDate === 'today' && styles.filterButtonActive]}
          onPress={() => setSelectedDate('today')}
        >
          <ThemedText style={[styles.filterText, selectedDate === 'today' && styles.filterTextActive]}>
            Today
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, selectedDate === 'week' && styles.filterButtonActive]}
          onPress={() => setSelectedDate('week')}
        >
          <ThemedText style={[styles.filterText, selectedDate === 'week' && styles.filterTextActive]}>
            This Week
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, selectedDate === 'month' && styles.filterButtonActive]}
          onPress={() => setSelectedDate('month')}
        >
          <ThemedText style={[styles.filterText, selectedDate === 'month' && styles.filterTextActive]}>
            This Month
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.logContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Scan History
        </ThemedText>
        
        {displayEntries.map((entry) => (
          <ThemedView key={entry.id} style={styles.logEntry}>
            <ThemedView style={styles.logHeader}>
              <ThemedView style={styles.logInfo}>
                <ThemedText style={styles.productName}>{entry.product.name}</ThemedText>
                <ThemedText style={styles.brand}>{entry.product.brand}</ThemedText>
                <ThemedText style={styles.servingSize}>{entry.servingSize}</ThemedText>
              </ThemedView>
              
              <ThemedView style={styles.logMeta}>
                <ThemedText style={styles.timestamp}>
                  {formatDate(entry.timestamp)} at {formatTime(entry.timestamp)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            
            <ThemedView style={styles.logStats}>
              <ThemedView style={styles.statItem}>
                <ThemedText style={styles.statValue}>{entry.calories}</ThemedText>
                <ThemedText style={styles.statLabel}>Calories</ThemedText>
              </ThemedView>
              
              <ThemedView style={styles.statItem}>
                <ThemedText style={[styles.statValue, { color: getHealthScoreColor(entry.healthScore) }]}>
                  {entry.healthScore}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Health Score</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        ))}
      </ThemedView>

      {displayEntries.length === 0 && (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>No scans yet today</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Start scanning products to track your nutrition
          </ThemedText>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  sectionTitle: {
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  logContainer: {
    marginBottom: 20,
  },
  logEntry: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  logHeader: {
    marginBottom: 10,
  },
  logInfo: {
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  brand: {
    opacity: 0.7,
    marginBottom: 2,
  },
  servingSize: {
    fontSize: 12,
    opacity: 0.5,
  },
  logMeta: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.6,
  },
  logStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    opacity: 0.7,
  },
  emptySubtext: {
    textAlign: 'center',
    opacity: 0.5,
    paddingHorizontal: 40,
  },
});
