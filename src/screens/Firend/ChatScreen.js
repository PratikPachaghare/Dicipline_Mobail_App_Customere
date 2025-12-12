import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ChatScreen({ route, navigation }) {
  // Get the name passed from the Friends Screen
  const { friendName } = route.params || { friendName: 'Friend' };
  const [msg, setMsg] = useState('');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      
      {/* Chat Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.name}>{friendName}</Text>
        <Ionicons name="videocam-outline" size={26} color="#333" />
      </View>

      {/* Messages Area (Empty for now) */}
      <View style={styles.chatArea}>
         <Text style={{color: '#aaa'}}>Start of your streak with {friendName} 🔥</Text>
      </View>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <View style={styles.cameraBtn}>
           <Ionicons name="camera" size={20} color="#fff" />
        </View>
        <TextInput 
          style={styles.input} 
          placeholder="Send a chat" 
          value={msg}
          onChangeText={setMsg} 
        />
        {msg.length > 0 ? (
           <Text style={{fontWeight:'bold', color: '#007AFF'}}>Send</Text>
        ) : (
           <Ionicons name="mic-outline" size={24} color="#333" />
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#eee', marginTop:30},
  name: { fontSize: 18, fontWeight: '700' },
  chatArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'center',marginBottom:15, padding: 10, borderTopWidth: 1, borderColor: '#eee' },
  cameraBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10, fontSize: 16 }
});