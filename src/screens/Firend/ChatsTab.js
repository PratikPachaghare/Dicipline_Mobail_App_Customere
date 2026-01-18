import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import male_profile from '../../Assete/images/Profile/male.png';
import female_profile from '../../Assete/images/Profile/female.png';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/150';

const ChatsTab = ({ activeChats, navigation, myUserId }) => {

  
  const getAvatarSource = avatarData => {
    // 1. Check if it is a valid string
    if (typeof avatarData === 'string' && avatarData.trim() !== '') {
      return { uri: avatarData };
    }
    // 2. Check if it is an object with a url (e.g. from Cloudinary/AWS)
    if (typeof avatarData === 'object' && avatarData?.url) {
      return { uri: avatarData.url };
    }

    // 3. Fallback: If empty or null, return local image
    return male_profile;
  };

const renderActiveChat = ({ item }) => {
    const myIdStr = myUserId ? myUserId.toString() : '';

    // 1. Find Friend
    const otherUser =
      item.participants.find(p => p._id && p._id.toString() !== myIdStr) ||
      item.participants[0];



    const unreadCount = item.unreadCount || 0;

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() =>
          navigation.navigate('ChatScreen', {
            roomId: item._id,
            user: otherUser,
            unreadCount: unreadCount
          })
        }
      >
        <Image
          source={getAvatarSource(otherUser?.avatar)}
          style={styles.avatar}
        />

        <View style={styles.infoArea}>
          <Text style={styles.name}>{otherUser?.name || 'User'}</Text>
          
          {/* ✅ UPDATED LOGIC HERE */}
          {item.lastMessage?.type === 'image' ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
               <Ionicons name="camera-outline" size={16} color="#888" style={{ marginRight: 4 }} />
               <Text style={styles.subText}>Photo</Text>
            </View>
          ) : (
            <Text style={styles.subText} numberOfLines={1}>
              {item.lastMessage?.content || 'Tap to chat 🔥'}
            </Text>
          )}

        </View>

        {/* 3. RIGHT SIDE: DATE & BADGE */}
        <View style={styles.metaArea}>
          <Text style={styles.timeText}>
            {item.lastMessage?.createdAt
              ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </Text>

          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
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
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: '#f9f9f9',
    backgroundColor: '#fff',
  },
  avatar: { width: 60, height: 60, borderRadius: 25, backgroundColor: '#eee' },
  infoArea: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '400', color: '#222', marginBottom: 2 },
  subText: { color: '#888', fontSize: 14 },

  // Right Side Styles
  metaArea: { alignItems: 'flex-end', marginLeft: 10 },
  timeText: { fontSize: 11, color: '#999', marginBottom: 5 },

  // 🔥 The Green Circle Styles
  badge: {
    backgroundColor: '#25D366', // WhatsApp Green Color
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, color: '#333', fontWeight: 'bold', marginTop: 10 },
});

export default ChatsTab;
