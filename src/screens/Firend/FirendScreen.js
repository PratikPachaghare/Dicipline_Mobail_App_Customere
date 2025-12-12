import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- MOCK DATA ---
const FRIENDS_DATA = [
  { 
    id: '1', 
    name: 'Sarah Connor', 
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg', 
    streak: 154, 
    status: 'New Snap • 2m', 
    statusColor: '#F23C57', // Red for new snap
    hasStory: true 
  },
  { 
    id: '2', 
    name: 'John Wick', 
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg', 
    streak: 89, 
    status: 'Opened • 1h', 
    statusColor: '#ddd', // Grey for opened
    hasStory: false 
  },
  { 
    id: '3', 
    name: 'Emily Rose', 
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg', 
    streak: 12, 
    status: 'Received • 5m', 
    statusColor: '#9B51E0', // Purple for video
    hasStory: true 
  },
  { 
    id: '4', 
    name: 'Mike Ross', 
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg', 
    streak: 0, 
    status: 'Tap to chat', 
    statusColor: '#ddd',
    hasStory: false 
  },
  { 
    id: '5', 
    name: 'Jessica P.', 
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg', 
    streak: 365, 
    status: '🔥 365 day streak!', 
    statusColor: '#FFA500',
    hasStory: true 
  },
];

export default function FriendsScreen({ navigation }) {

  // --- RENDER SINGLE ROW (FRIEND) ---
  const renderFriendRow = ({ item }) => (
    <TouchableOpacity 
      style={styles.row} 
      onPress={() => navigation.navigate('ChatScreen', { friendName: item.name })}
      activeOpacity={0.7}
    >
      
      {/* 1. Avatar with Story Ring */}
      <View style={[styles.avatarContainer, item.hasStory && styles.storyRing]}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      </View>

      {/* 2. Main Info */}
      <View style={styles.infoArea}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.statusRow}>
          {/* Status Indicator Box (Red/Purple square) */}
          <View style={[styles.statusIndicator, { backgroundColor: item.statusColor }]} />
          <Text style={[styles.statusText, item.statusColor === '#F23C57' && styles.boldText]}>
            {item.status}
          </Text>
        </View>
      </View>

      {/* 3. Streak & Camera Action */}
      <View style={styles.actionArea}>
        {/* Only show streak if > 0 */}
        {item.streak > 0 && (
          <View style={styles.streakContainer}>
            <Text style={styles.streakNumber}>{item.streak}</Text>
            <Text style={styles.fireEmoji}>🔥</Text>
          </View>
        )}
        
        {/* Snapchat Divider Line */}
        <View style={styles.verticalLine} />

        {/* Camera Icon or Chat Icon */}
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="camera-outline" size={24} color="#aaa" />
        </TouchableOpacity>
      </View>

    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
           <View style={styles.myAvatar}><Text style={{fontSize:10}}>ME</Text></View>
           <Ionicons name="search" size={24} color="#333" style={{marginLeft: 15}}/>
        </View>
        <Text style={styles.headerTitle}>Friends</Text>
        <Ionicons name="person-add" size={24} color="#333" />
      </View>

      <FlatList
        data={FRIENDS_DATA}
        keyExtractor={item => item.id}
        renderItem={renderFriendRow}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  myAvatar: { 
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#eee', 
    alignItems: 'center', justifyContent: 'center' 
  },

  // Row Styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#fafafa',
  },
  
  // Avatar Section
  avatarContainer: { padding: 2 }, // Space for the ring
  storyRing: {
    borderWidth: 2,
    borderColor: '#6B6BFF', // Blue ring for stories
    borderRadius: 30,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#ddd' },

  // Info Section
  infoArea: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusIndicator: { width: 10, height: 10, borderRadius: 2, marginRight: 6 },
  statusText: { fontSize: 13, color: '#666' },
  boldText: { fontWeight: '700', color: '#111' },

  // Right Side (Streak + Icons)
  actionArea: { flexDirection: 'row', alignItems: 'center' },
  streakContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  streakNumber: { fontSize: 14, fontWeight: '800', color: '#111' },
  fireEmoji: { fontSize: 14, marginLeft: 2 },
  
  verticalLine: { width: 1, height: 20, backgroundColor: '#eee', marginHorizontal: 10 },
  iconButton: { padding: 5 },
});