import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet,
  Alert, FlatList, Image, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import io from 'socket.io-client';
import { launchImageLibrary } from 'react-native-image-picker';

// 👇 Imports updated
import apiCall, { apiCallImageChat, encryptMessage, decryptMessage } from '../../utils/apiCalls'; 
import apiEndpoint from '../../utils/endpoint';
import { AuthContext } from '../../context/AuthContext';
import { SERVER_URL } from '../../utils/api'; 

const SOCKET_URL = SERVER_URL;

const getImageUrl = (imgData) => {
  if (!imgData) return 'https://via.placeholder.com/150';
  if (typeof imgData === 'string') return imgData;
  if (typeof imgData === 'object' && imgData.url) return imgData.url;
  return 'https://via.placeholder.com/150';
};

export default function ChatScreen({ route, navigation }) {
  const { user: currentUser } = useContext(AuthContext);
  
  // Ensure friend object has publicKey
  const { user: friend, roomId, unreadCount = 0 } = route.params;

  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  const socket = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    socket.current = io(SOCKET_URL);
    socket.current.emit('join_room', roomId);

    socket.current.on('receive_message', async (newMessage) => {
      let processedMsg = { ...newMessage };

      if (processedMsg.type === 'text') {
          // Check karo: Kya ye msg maine bheja hai?
          const isMe = processedMsg.sender._id === currentUser._id;
          
          // Agar maine bheja hai -> contentForSender uthao
          // Agar dost ne bheja hai -> contentForReceiver uthao
          const encryptedText = isMe 
              ? processedMsg.contentForSender 
              : processedMsg.contentForReceiver;

          // Decrypt karo apni Private Key se
          const decryptedText = await decryptMessage(encryptedText, currentUser._id);
          processedMsg.content = decryptedText;
      }
      
      setMessages(prev => [processedMsg, ...prev]);
    });

    socket.current.on('chat_cleared', () => {
      setMessages([]);
      Alert.alert('Notice', 'Chat history was cleared.');
    });

    let initialLimit = 20;
    if (unreadCount > 20) {
        initialLimit = unreadCount + 5;
    }

    fetchMessages(1, initialLimit);
    markMessagesRead();

    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Auto Scroll Logic
  useEffect(() => {
    if (!initialScrollDone && messages.length > 0 && unreadCount > 0) {
        setTimeout(() => {
            try {
                const targetIndex = Math.min(unreadCount - 1, messages.length - 1);
                if (targetIndex > 0 && flatListRef.current) {
                    flatListRef.current.scrollToIndex({ 
                        index: targetIndex, 
                        animated: false, 
                        viewPosition: 0.5 
                    });
                }
            } catch (e) { console.log("Scroll Error:", e); }
            setInitialScrollDone(true);
        }, 500);
    }
  }, [messages]);

  const markMessagesRead = async () => {
      try {
        await apiCall('PUT', apiEndpoint.chat.markRead(roomId)); 
      } catch (error) { console.log(error); }
  };

  // FIX 2: Fetch Messages with Bulk Decryption
  const fetchMessages = async (pageNum, limit = 20) => {
    try {
      if (pageNum === 1) setLoadingMore(true);

      const res = await apiCall('GET', `${apiEndpoint?.chat.messages(roomId)}?page=${pageNum}&limit=${limit}`);
      
      if (Array.isArray(res)) {
        if (res.length < limit) setHasMore(false);

        // Decrypt all text messages in this batch
        const decryptedBatch = await Promise.all(res.map(async (m) => {
            if (m.type === 'text') {
                const realText = await decryptMessage(m.content, currentUser._id);
                return { ...m, content: realText };
            }
            return m; // Images return as is
        }));

        if (pageNum === 1) {
            setMessages(decryptedBatch); 
        } else {
            setMessages(prev => {
                const existingIds = new Set(prev.map(m => m._id));
                const uniqueNewMessages = decryptedBatch.filter(m => !existingIds.has(m._id));
                return [...prev, ...uniqueNewMessages];
            }); 
        }
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
        setLoadingMore(true);
        fetchMessages(page + 1);
    }
  };

  //  FIX 3: Sending with Encryption
  const handleSend = async () => {
    if (msg.trim().length === 0) return;
    
    try {
        const friendPublicKey = friend.publicKey; 
        const myPublicKey = currentUser.publicKey; // 👈 Hame apni Public Key bhi chahiye

        if (!friendPublicKey || !myPublicKey) {
            Alert.alert("Error", "Public keys missing. Cannot secure chat.");
            return;
        }

        // 🔒 1. Friend ke liye Encrypt (Taaki wo padh sake)
        const encryptedForFriend = await encryptMessage(msg, friendPublicKey);

        // 🔒 2. Khud ke liye Encrypt (Taaki hum history me padh sake)
        const encryptedForMe = await encryptMessage(msg, myPublicKey);

        if (!encryptedForFriend || !encryptedForMe) {
            Alert.alert("Error", "Encryption failed");
            return;
        }

        // API Call
        await apiCall('POST', apiEndpoint.chat.messages(roomId), {
            contentForReceiver: encryptedForFriend, // Friend wala packet
            contentForSender: encryptedForMe,       // Mera wala packet
            type: 'text',
        });

        setMsg('');
        
    } catch (error) {
        console.error('Send Error', error);
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const formData = new FormData();
        formData.append('chatRoomId', roomId);
        formData.append('type', 'image');

        const uri = Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', '');
        const imageFile = {
            uri: uri,
            type: asset.type || 'image/jpeg', 
            name: asset.fileName || `chat_image_${Date.now()}.jpg`, 
        };
        formData.append('image', imageFile);

        await apiCallImageChat('POST', apiEndpoint.chat.messages(roomId), formData);
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }
    } catch (error) {
      console.error('Image Upload Error:', error);
      Alert.alert('Error', 'Failed to upload image.');
    }
  };

  const handleClearChat = () => {
    Alert.alert('Clear Chat', 'Delete all messages?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => await apiCall('POST', apiEndpoint?.chat.clear(roomId)) },
    ]);
  };

  const renderMessage = ({ item }) => {
    const senderId = item.sender?._id ? item.sender._id.toString() : item.sender.toString();
    const myId = currentUser?._id ? currentUser._id.toString() : currentUser?.userId?.toString();
    const isMe = senderId === myId;

    return (
      <View style={[styles.msgBubble, isMe ? styles.meBubble : styles.friendBubble]}>
        {item.type === 'image' ? (
           <Image source={{ uri: item.content }} style={styles.msgImage} resizeMode="cover" />
        ) : (
           <Text style={isMe ? styles.meText : styles.friendText}>{item.content}</Text>
        )}
        {item.createdAt && (
            <Text style={styles.timeText}>
                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Image source={{ uri: getImageUrl(friend.avatar) }} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.name}>{friend.name || 'User'}</Text>
        </View>
        <TouchableOpacity onPress={handleClearChat}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item._id || index.toString()} 
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 15 }}
          inverted={true}  
          onEndReached={handleLoadMore} 
          onEndReachedThreshold={0.1}
          onScrollToIndexFailed={info => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
            });
          }}
          ListFooterComponent={ loadingMore && page > 1 ? <ActivityIndicator size="small" color="#999" /> : null }
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.cameraBtn} onPress={handleImagePick}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Send a chat"
            value={msg}
            onChangeText={setMsg}
            placeholderTextColor="#999"
          />
          {msg.length > 0 ? (
            <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
              <Ionicons name="send" size={20} color="#fff" style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          ) : (
            <Ionicons name="mic-outline" size={28} color="#333" />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', paddingTop: 40, padding: 15,
    borderBottomWidth: 1, borderColor: '#eee',
  },
  name: { fontSize: 18, fontWeight: '700' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginLeft: 10, backgroundColor: '#eee' },
  msgBubble: { maxWidth: '75%', padding: 12, borderRadius: 18, marginBottom: 10 },
  meBubble: { alignSelf: 'flex-end', backgroundColor: '#007AFF', borderBottomRightRadius: 2 },
  friendBubble: { alignSelf: 'flex-start', backgroundColor: '#F0F0F0', borderBottomLeftRadius: 2 },
  meText: { color: '#fff', fontSize: 16 },
  friendText: { color: '#333', fontSize: 16 },
  timeText: { fontSize: 10, marginTop: 5, alignSelf: 'flex-end' },
  msgImage: { width: 200, height: 200, borderRadius: 10, backgroundColor: '#ddd' },
  inputContainer: { flexDirection: 'row', marginBottom: 15, alignItems: 'center', padding: 10, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  cameraBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, fontSize: 16, color: '#333' },
  sendBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginLeft: 5, elevation: 2 },
});