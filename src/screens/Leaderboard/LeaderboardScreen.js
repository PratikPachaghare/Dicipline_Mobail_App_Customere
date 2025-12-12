import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- MOCK DATA (Sorted by XP) ---
const LEADERBOARD_DATA = [
  { id: '1', name: 'Jessica P.', xp: 2450, avatar: 'https://randomuser.me/api/portraits/women/12.jpg', rank: 1 },
  { id: '2', name: 'You', xp: 2100, avatar: 'https://randomuser.me/api/portraits/men/32.jpg', rank: 2 }, // This is the User
  { id: '3', name: 'Sarah C.', xp: 1850, avatar: 'https://randomuser.me/api/portraits/women/44.jpg', rank: 3 },
  { id: '4', name: 'Mike Ross', xp: 1200, avatar: 'https://randomuser.me/api/portraits/men/85.jpg', rank: 4 },
  { id: '5', name: 'Emily Rose', xp: 950, avatar: 'https://randomuser.me/api/portraits/women/68.jpg', rank: 5 },
  { id: '6', name: 'John Wick', xp: 500, avatar: 'https://randomuser.me/api/portraits/men/11.jpg', rank: 6 },
];

export default function LeaderboardScreen() {
  
  // Separate Top 3 from the rest
  const topThree = LEADERBOARD_DATA.slice(0, 3);
  const restOfList = LEADERBOARD_DATA.slice(3);

  // --- COMPONENT: PODIUM ITEM ---
  const renderPodium = (item, position) => {
    // Styles change based on rank (1st is biggest)
    const isFirst = position === 1;
    const size = isFirst ? 100 : 80;
    const borderColor = position === 1 ? '#FFD700' : position === 2 ? '#C0C0C0' : '#CD7F32'; // Gold, Silver, Bronze
    const crown = position === 1 ? '👑' : '';

    return (
      <View style={[styles.podiumItem, isFirst && { marginBottom: 30 }]}> 
        <Text style={styles.crown}>{crown}</Text>
        <View style={[styles.avatarContainer, { width: size, height: size, borderColor }]}>
          <Image source={{ uri: item.avatar }} style={{ width: size - 6, height: size - 6, borderRadius: size / 2 }} />
          <View style={[styles.rankBadge, { backgroundColor: borderColor }]}>
            <Text style={styles.rankText}>{position}</Text>
          </View>
        </View>
        <Text style={styles.podiumName}>{item.name}</Text>
        <Text style={styles.podiumXP}>{item.xp} XP</Text>
      </View>
    );
  };

  // --- COMPONENT: LIST ROW ---
  const renderRow = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.listRank}>{index + 4}</Text>
      <Image source={{ uri: item.avatar }} style={styles.listAvatar} />
      <View style={styles.listInfo}>
        <Text style={styles.listName}>{item.name}</Text>
      </View>
      <View style={styles.xpBadge}>
        <Text style={styles.listXP}>{item.xp} XP</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard 🏆</Text>
      </View>

      {/* --- TOP 3 PODIUM SECTION --- */}
      <View style={styles.podiumContainer}>
        {/* Render 2nd, 1st, then 3rd for visual pyramid */}
        {renderPodium(topThree[1], 2)} 
        {renderPodium(topThree[0], 1)} 
        {renderPodium(topThree[2], 3)} 
      </View>

      {/* --- REST OF THE LIST --- */}
      <View style={styles.listContainer}>
        <FlatList
          data={restOfList}
          keyExtractor={item => item.id}
          renderItem={renderRow}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6B6BFF' }, // Purple Background for header feel
  header: { padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },

  // Podium Styles
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
    height: 180,
  },
  podiumItem: { alignItems: 'center', marginHorizontal: 10 },
  avatarContainer: { borderWidth: 3, justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderRadius: 100 },
  crown: { fontSize: 24, marginBottom: -10, zIndex: 10 },
  rankBadge: {
    position: 'absolute',
    bottom: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  rankText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  podiumName: { color: '#fff', fontWeight: 'bold', fontSize: 14, marginTop: 5 },
  podiumXP: { color: '#e0e0e0', fontSize: 12 },

  // List Styles
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listRank: { fontSize: 16, fontWeight: 'bold', color: '#999', width: 30, textAlign: 'center' },
  listAvatar: { width: 44, height: 44, borderRadius: 22, marginHorizontal: 15 },
  listInfo: { flex: 1 },
  listName: { fontSize: 16, fontWeight: '600', color: '#333' },
  xpBadge: { backgroundColor: '#F0F0FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  listXP: { color: '#6B6BFF', fontWeight: 'bold', fontSize: 14 },
});