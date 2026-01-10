import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function WeeklyStreak({ streakDays }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Weekly Streak</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
        {streakDays.map((d, i) => (
          <View style={styles.streakItem} key={i}>
            <View style={[styles.streakDot, d.completed && styles.streakDotDone]}>
              {d.completed && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={styles.streakLabel}>{d.day}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 18, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  streakItem: { alignItems: 'center', marginRight: 20 },
  streakDot: {
    width: 38, height: 38, borderRadius: 20, borderWidth: 1,
    borderColor: '#C9C9D1', alignItems: 'center', justifyContent: 'center',
  },
  streakDotDone: { backgroundColor: '#4CD964', borderColor: '#4CD964' },
  streakLabel: { marginTop: 6, color: '#444', fontSize: 12 },
});