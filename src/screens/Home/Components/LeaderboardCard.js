import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';



export default function LeaderboardCard({ onPress }) {
const rank = useSelector(state => state.streaks.Rank.currentRank) || '-';

  return (
    <TouchableOpacity
      style={styles.leaderboardCard}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.lbContent}>
        <View style={styles.trophyContainer}>
          <Text style={{ fontSize: 24 }}>🏆</Text>
        </View>
        <View style={styles.lbTextContainer}>
          <Text style={styles.lbTitle}>Leaderboard</Text>
          <Text style={styles.lbSubtitle}>
            You are ranked <Text style={{ fontWeight: 'bold', color: '#FFD700' }}>#{rank}</Text> this week!
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#C4C4C4" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  leaderboardCard: {
    backgroundColor: '#373737',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    elevation: 5,
  },
  lbContent: { flexDirection: 'row', alignItems: 'center' },
  trophyContainer: {
    width: 48, height: 48, backgroundColor: '#525252', borderRadius: 24,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  lbTextContainer: { justifyContent: 'center' },
  lbTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  lbSubtitle: { color: '#aaa', fontSize: 15, marginTop: 2 },
});