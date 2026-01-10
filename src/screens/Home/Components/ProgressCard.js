import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ProgressCard({ disciplineStreak, progressPercent, completedCount, totalCount }) {
  return (
    <View style={styles.progressCard}>
      {/* 🔥 FIRE STREAK BADGE */}
      <View style={styles.streakBadge}>
        <Text style={styles.streakText}>{disciplineStreak}</Text>
        <Ionicons name="flame" size={40} color="#FF4500" />
      </View>
      
      <View>
        <Text style={styles.progressLabel}>Today’s Progress</Text>
        <Text style={styles.progressPercent}>{progressPercent.toFixed(0)}%</Text>
      </View>

      <View style={styles.progressRight}>
        <View style={styles.circleOuter}>
          <View style={[styles.circleInner, { height: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.progressCount}>
          {completedCount}/{totalCount}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    gap: 4,
    elevation: 4,
    shadowColor: '#f50000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  streakText: { fontSize: 32, fontWeight: '800', color: '#FF4500' },
  progressLabel: { fontSize: 14, fontWeight: '600', color: '#555' },
  progressPercent: { fontSize: 28, fontWeight: '800', color: '#111', marginTop: 6 },
  progressRight: { alignItems: 'center' },
  circleOuter: {
    width: 38,
    height: 80,
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  circleInner: { width: '100%', backgroundColor: '#6B6BFF' },
  progressCount: { fontSize: 13, color: '#666', marginTop: 4 },
});