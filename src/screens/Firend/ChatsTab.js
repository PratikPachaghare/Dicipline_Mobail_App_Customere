import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/150';

const ChatsTab = ({ activeChats, navigation, myUserId }) => {

  const getAvatarUrl = (avatarData) => {
    if (typeof avatarData === 'string' && avatarData.trim() !== '') return avatarData;
    if (typeof avatarData === 'object' && avatarData?.url) return avatarData.url;
    return PLACEHOLDER_IMG;
  };

  const renderActiveChat = ({ item }) => {
    const otherUser = item.participants.find(p => p._id !== myUserId) || item.participants[0];
    
    return (
      <TouchableOpacity 
        style={styles.row} 
        onPress={() => navigation.navigate('ChatScreen', { roomId: item._id, user: otherUser })}
      >
        <Image source={{ uri: getAvatarUrl(otherUser?.avatar) }} style={styles.avatar} />
        <View style={styles.infoArea}>
          <Text style={styles.name}>{otherUser?.name || "User"}</Text>
          <Text style={styles.subText} numberOfLines={1}>Tap to chat 🔥</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={activeChats}
      keyExtractor={item => item._id}
      renderItem={renderActiveChat}
      ListEmptyComponent={
        <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={50} color="#ddd" />
            <Text style={styles.emptyText}>No active chats</Text>
            <Text style={styles.emptySubText}>Go to "People" to find friends!</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderColor: '#f9f9f9' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#eee' },
  infoArea: { flex: 1, marginLeft: 15 },
  name: { fontSize: 16, fontWeight: '600', color: '#222' },
  subText: { color: '#888', fontSize: 13, marginTop: 2 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, color: '#333', fontWeight: 'bold', marginTop: 10 },
  emptySubText: { fontSize: 14, color: '#999', marginTop: 5 }
});

export default ChatsTab;