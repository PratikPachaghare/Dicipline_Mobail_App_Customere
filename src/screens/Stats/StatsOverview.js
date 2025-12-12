// src/components/Profile/StatsOverview.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const StatBox = ({ label, value, icon, color }) => (
  <View style={[styles.statBox, { borderColor: color }]}>
    <View style={[styles.statIconCircle, { backgroundColor: color }]}>
       <Ionicons name={icon} size={18} color="#fff" />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function StatsOverview({ streaksCount, completedCount, habitsCount }) {
  return (
    <View style={styles.statsContainer}>
      <StatBox label="Best Streak" value={streaksCount} icon="flame" color="#FF4500" />
      <StatBox label="Completed" value={completedCount} icon="checkmark" color="#4CD964" />
      <StatBox label="Total Habits" value={habitsCount} icon="list" color="#6B6BFF" />
      <StatBox label="Completion %" value="85%" icon="analytics" color="#FFD700" />
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    gap: 10,
    marginBottom: 24 
  },
  statBox: {
    width: '48%', // 2 items per row
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 16, 
    alignItems: 'center',
    borderWidth: 1, 
    borderBottomWidth: 4, 
    elevation: 2,
    marginBottom: 10
  },
  statIconCircle: { padding: 10, borderRadius: 50, marginBottom: 8 },
  statValue: { fontSize: 22, fontWeight: '800', color: '#111' },
  statLabel: { fontSize: 12, color: '#666', fontWeight: '600', textTransform: 'uppercase' },
});