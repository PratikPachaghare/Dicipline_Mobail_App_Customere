import React, { useState, useCallback, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import apiCall from '../../utils/apiCalls'; 
import apiEndpoint from '../../utils/endpoint'; 
import { AuthContext } from '../../context/AuthContext';

import male_Profile from "../../Assete/images/Profile/male.png";
// import female_Profile from "../../Assete/images/Profile/female.avif";

// Standard Row Height for calculation (Padding + Content + Border)
const ROW_HEIGHT = 80; 

export default function LeaderboardScreen() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext); // Get logged-in user details
  const flatListRef = useRef(null); // Ref for auto-scrolling

  // --- STATE ---
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [myRankInfo, setMyRankInfo] = useState(null); // Store user's specific rank info

  // --- API CALL ---
  const fetchLeaderboard = async () => {
    try {
      if (!refreshing) setIsLoading(true);
      
      const res = await apiCall('GET', apiEndpoint?.leaderboard?.weakly_Leaderboard);
      
      if (res?.success) {
        setLeaderboardData(res.leaderboardData || []);
        
        // Find current user's rank info immediately
        const myData = res.leaderboardData.find(u => u.userId === user?._id);
        setMyRankInfo(myData ? { rank: res.leaderboardData.indexOf(myData) + 1, ...myData } : null);
      }
    } catch (error) {
      console.error("Leaderboard Fetch Error:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLeaderboard();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard();
  };

  // --- AUTO SCROLL FUNCTION ---
  const scrollToMyRank = () => {
    if (!myRankInfo || !flatListRef.current) return;

    // Case 1: User is in Top 3 (Scroll to top)
    if (myRankInfo.rank <= 3) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        return;
    }

    // Case 2: User is in the list (Rank 4+)
    // We need to find the index inside 'restOfList', not the main list
    // restOfList starts from index 3 of main list.
    const indexInList = myRankInfo.rank - 4; 

    if (indexInList >= 0) {
      flatListRef.current.scrollToIndex({
        index: indexInList,
        animated: true,
        viewPosition: 0.5 // 0.5 means scroll the item to the MIDDLE of the screen
      });
    }
  };

  const handleUserPress = (userId) => {
    navigation.navigate('UserProfile', { userId: userId });
  };

  // --- DATA SLICING ---
  const topThree = leaderboardData.slice(0, 3);
  const restOfList = leaderboardData.slice(3);

  // --- RENDER PODIUM ---
  const renderPodium = (item, position) => {
    if (!item) return null;
    const isFirst = position === 1;
    const size = isFirst ? 100 : 80;
    const borderColor = position === 1 ? '#FFD700' : position === 2 ? '#C0C0C0' : '#CD7F32';
    const crown = position === 1 ? '👑' : '';
    const isMe = item.userId === user?._id;

    return (
      <TouchableOpacity 
        style={[styles.podiumItem, isFirst && { marginBottom: 30 }]}
        onPress={() => handleUserPress(item.userId)}
        activeOpacity={0.8}
      >
        <Text style={styles.crown}>{crown}</Text>
        <View style={[
            styles.avatarContainer, 
            { width: size, height: size, borderColor },
            isMe && { borderWidth: 4, borderColor: '#fff' } // Extra highlight if it's me
        ]}>
          <Image 
            source={item.avatar ? { uri: item.avatar } : male_Profile}
            style={{ width: size - 6, height: size - 6, borderRadius: size / 2 }} 
          />
          <View style={[styles.rankBadge, { backgroundColor: borderColor }]}>
            <Text style={styles.rankText}>{position}</Text>
          </View>
        </View>
        <Text style={styles.podiumName} numberOfLines={1}>
            {isMe ? "You" : item.name}
        </Text>
        <Text style={styles.podiumXP}>{item.points} pts</Text>
      </TouchableOpacity>
    );
  };

  // --- RENDER ROW ---
  const renderRow = ({ item, index }) => {
    const isMe = item.userId === user?._id; // Check if this row belongs to current user
    const rank = index + 4;

    return (
      <TouchableOpacity 
        style={[
            styles.row, 
            isMe && styles.myRow // Apply special style if it's me
        ]} 
        onPress={() => handleUserPress(item.userId)}
      >
        <Text style={[styles.listRank, isMe && styles.myText]}>{rank}</Text>
        <Image 
          source={item.avatar ? { uri: item.avatar } : male_Profile}
          style={styles.listAvatar} 
        />
        <View style={styles.listInfo}>
          <Text style={[styles.listName, isMe && styles.myText]}>
            {isMe ? "You" : item.name}
          </Text>
          {isMe && <Text style={styles.meBadge}>It's You!</Text>}
        </View>
        <View style={[styles.xpBadge, isMe && { backgroundColor: '#fff' }]}>
          <Text style={styles.listXP}>{item.points} XP</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // --- HEADER ---
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>Weekly Leaderboard 🏆</Text>
        
        {/* BUTTON: GO TO MY RANK */}
        {myRankInfo && (
            <TouchableOpacity 
                style={styles.goToRankBtn} 
                onPress={scrollToMyRank}
                activeOpacity={0.7}
            >
                <Text style={styles.goToRankText}>
                    My Rank: <Text style={{fontWeight:'bold'}}>#{myRankInfo.rank}</Text> ⬇
                </Text>
            </TouchableOpacity>
        )}
      </View>

      <View style={styles.podiumContainer}>
        {renderPodium(topThree[1], 2)} 
        {renderPodium(topThree[0], 1)} 
        {renderPodium(topThree[2], 3)} 
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6B6BFF" />
      
      {isLoading && !refreshing ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef} // Attach Ref here
          data={restOfList}
          keyExtractor={(item) => item.userId.toString()}
          renderItem={renderRow}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          
          // Optimization for precise scrolling
          getItemLayout={(data, index) => (
            { length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index }
          )}

          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
              colors={['#6B6BFF']}
            />
          }
          ListEmptyComponent={
            !isLoading && (
              <View style={styles.emptyContainer}>
                 <Text style={{color:'#888'}}>No participants yet this week.</Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6B6BFF' },
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  flatListContent: { flexGrow: 1, backgroundColor: '#fff' },

  // HEADER
  headerContainer: {
    backgroundColor: '#6B6BFF',
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop:40,
    marginBottom: 10, 
  },
  titleContainer: { padding: 20, alignItems: 'center', width:'100%' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  
  // "Go To Rank" Button
  goToRankBtn: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.4)'
  },
  goToRankText: { color: '#fff', fontSize: 14 },

  // PODIUM
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 10,
    height: 180,
  },
  podiumItem: { alignItems: 'center', marginHorizontal: 10, width: 80 },
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
  podiumName: { color: '#fff', fontWeight: 'bold', fontSize: 14, marginTop: 5, textAlign:'center' },
  podiumXP: { color: '#e0e0e0', fontSize: 12 },

  // LIST ROWS
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: ROW_HEIGHT, // Fixed height for smoother scrolling
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  // SPECIAL STYLE FOR MY ROW
  myRow: {
      backgroundColor: '#6B6BFF', // Highlight Color (Purple)
      borderLeftWidth: 5,
      borderLeftColor: '#FFD700', // Gold strip on left
  },
  myText: {
      color: '#fff', // White text for my row
  },
  meBadge: {
      fontSize: 10,
      color: '#FFD700',
      marginTop: 2,
      fontWeight:'bold'
  },

  listRank: { fontSize: 16, fontWeight: 'bold', color: '#999', width: 30, textAlign: 'center' },
  listAvatar: { width: 44, height: 44, borderRadius: 22, marginHorizontal: 15 },
  listInfo: { flex: 1 },
  listName: { fontSize: 16, fontWeight: '600', color: '#333' },
  xpBadge: { backgroundColor: '#F0F0FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  listXP: { color: '#6B6BFF', fontWeight: 'bold', fontSize: 14 },
  
  emptyContainer: { alignItems: 'center', marginTop: 50 }
});