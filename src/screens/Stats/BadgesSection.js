// src/components/Profile/BadgesSection.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const BADGES_DATA = [
  { id: 1, name: 'Early Bird', icon: 'https://cdn-icons-png.flaticon.com/512/3075/3075908.png', unlocked: true },
  { id: 2, name: '7 Day Streak', icon: 'https://cdn-icons-png.flaticon.com/512/616/616490.png', unlocked: true },
  { id: 3, name: 'Task Master', icon: 'https://cdn-icons-png.flaticon.com/512/1041/1041168.png', unlocked: false },
  { id: 4, name: 'Weekend Warrior', icon: 'https://cdn-icons-png.flaticon.com/512/2663/2663503.png', unlocked: false },
];

export default function BadgesSection() {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Badges & Achievements</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {BADGES_DATA.map((badge) => (
          <View key={badge.id} style={[styles.badgeCard, !badge.unlocked && styles.lockedBadge]}>
            <Image 
              source={{ uri: badge.icon }} 
              style={[styles.badgeIcon, !badge.unlocked && { opacity: 0.3 }]} 
            />
            <Text style={styles.badgeName}>{badge.name}</Text>
            {badge.unlocked ? (
              <Text style={styles.status}>Unlocked</Text>
            ) : (
              <Text style={styles.lockedText}>Locked 🔒</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 18, fontWeight: '700', color: '#111' },
  seeAll: { color: '#6B6BFF', fontWeight: '600', fontSize: 13 },
  scroll: { paddingLeft: 5 },
  badgeCard: {
    width: 110,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2
  },
  lockedBadge: { backgroundColor: '#f5f5f5', borderColor: '#ddd', elevation: 0 },
  badgeIcon: { width: 50, height: 50, marginBottom: 8 },
  badgeName: { fontSize: 12, fontWeight: '700', color: '#333', textAlign: 'center', marginBottom: 4 },
  status: { fontSize: 10, color: '#4CD964', fontWeight: 'bold' },
  lockedText: { fontSize: 10, color: '#999', fontWeight: 'bold' },
});