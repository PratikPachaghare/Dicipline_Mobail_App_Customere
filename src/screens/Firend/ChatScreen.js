import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, 
  Alert, FlatList, Image, KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import io from 'socket.io-client';
import { launchImageLibrary } from 'react-native-image-picker';

// UTILS
import apiCall from '../../utils/apiCalls'; 
import apiEndpoint from '../../utils/endpoint';
import { AuthContext } from '../../context/AuthContext'; 
import { SERVER_URL } from '../../utils/api';


// ⚠️ REPLACE WITH YOUR BACKEND URL
const SOCKET_URL = SERVER_URL; 

export default function ChatScreen({ route, navigation }) {
  const { user: currentUser } = useContext(AuthContext); 
  const { user: friend, roomId } = route.params; 
  
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Refs
  const socket = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    // 1. Initialize Socket
    socket.current = io(SOCKET_URL);
    
    // 2. Join Room
    socket.current.emit("join_room", roomId);

    // 3. Listen for Messages
    socket.current.on("receive_message", (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
    });

    // 4. Listen for Clear Chat
    socket.current.on("chat_cleared", () => {
      setMessages([]);
      Alert.alert("Notice", "Chat history was cleared.");
    });

    // 5. Fetch History
    fetchMessages();

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const fetchMessages = async () => {
    try {
      // You need to add this route to your backend
      const res = await apiCall('GET', `/messages/${roomId}`); 
      if(Array.isArray(res)) {
          setMessages(res);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // --- SEND TEXT ---
  const handleSend = async () => {
    if (msg.trim().length === 0) return;

    try {
      const textToSend = msg;
      setMsg(''); // Clear input immediately for UX

      // API Call to save DB + Emit Socket
      await apiCall('POST', `/messages/${roomId}`, {
         content: textToSend,
         type: 'text'
      });
      // Note: We don't manually setMessages here because 
      // the socket "receive_message" event will trigger and add it.
    } catch (error) {
      console.error("Send Error", error);
      Alert.alert("Error", "Failed to send message");
    }
  };

  // --- SEND IMAGE ---
  const handleImagePick = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
    
    if (result.assets && result.assets.length > 0) {
       const imageUri = result.assets[0].uri;
       // ⚠️ TODO: You need to upload this image to your server/Cloudinary 
       // and get a URL string back. 
       // For now, I will simulate sending the URI as content.
       
       // Example Upload Logic:
       // const formData = new FormData();
       // formData.append('image', { uri: imageUri, type: 'image/jpeg', name: 'upload.jpg' });
       // const uploadRes = await apiCall('POST', '/upload', formData, true); // true for multipart
       
       await apiCall('POST', `/messages/${roomId}`, {
           content: imageUri, // Replace with uploadRes.url
           type: 'image'
       });
    }
  };

  const handleClearChat = () => {
    Alert.alert("Clear Chat", "Delete all messages for everyone?", [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: 'destructive', onPress: async () => {
            await apiCall('POST', `/chats/clear/${roomId}`);
        }} 
    ]);
  };

  // --- RENDER ITEM ---
  const renderMessage = ({ item }) => {
    const isMe = item.sender._id === currentUser._id || item.sender === currentUser._id;
    
    return (
      <View style={[
          styles.msgBubble, 
          isMe ? styles.meBubble : styles.friendBubble
      ]}>
         {item.type === 'image' ? (
             <Image source={{ uri: item.content }} style={styles.msgImage} />
         ) : (
             <Text style={isMe ? styles.meText : styles.friendText}>{item.content}</Text>
         )}
         <Text style={[styles.timeText, isMe ? {color:'#ddd'} : {color:'#888'}]}>
            {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
         </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        
        <Image 
            source={{ uri: friend.avatar || 'https://via.placeholder.com/40' }} 
            style={styles.avatar} 
        />
        <View style={{flex:1, marginLeft: 10}}>
            <Text style={styles.name}>{friend.name}</Text>
        </View>

        <TouchableOpacity onPress={handleClearChat}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Chat Area */}
      <KeyboardAvoidingView 
         behavior={Platform.OS === "ios" ? "padding" : undefined} 
         style={{flex:1}} 
         keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
          {loading ? (
             <ActivityIndicator size="large" color="#007AFF" style={{marginTop: 50}} />
          ) : (
             <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item._id || Math.random().toString()}
                renderItem={renderMessage}
                contentContainerStyle={{ padding: 15 }}
                onContentSizeChange={scrollToBottom}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={{color: '#aaa'}}>Start your streak 🔥</Text>
                    </View>
                }
             />
          )}

          {/* Input Bar */}
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
               <TouchableOpacity onPress={handleSend}>
                   <Text style={{fontWeight:'bold', color: '#007AFF', fontSize: 16}}>Send</Text>
               </TouchableOpacity>
            ) : (
               <Ionicons name="mic-outline" size={24} color="#333" />
            )}
          </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 40, padding: 15, borderBottomWidth: 1, borderColor: '#eee'},
  name: { fontSize: 18, fontWeight: '700' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginLeft: 10, backgroundColor: '#eee'},
  
  // Message Styles
  msgBubble: { maxWidth: '75%', padding: 12, borderRadius: 18, marginBottom: 10 },
  meBubble: { alignSelf: 'flex-end', backgroundColor: '#007AFF', borderBottomRightRadius: 2 },
  friendBubble: { alignSelf: 'flex-start', backgroundColor: '#F0F0F0', borderBottomLeftRadius: 2 },
  
  meText: { color: '#fff', fontSize: 16 },
  friendText: { color: '#333', fontSize: 16 },
  timeText: { fontSize: 10, marginTop: 5, alignSelf: 'flex-end' },
  
  msgImage: { width: 200, height: 200, borderRadius: 10 },

  // Input
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  cameraBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, fontSize: 16, color: '#333' },
  
  emptyContainer: { alignItems: 'center', marginTop: 50 }
});