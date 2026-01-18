import React, { useState, useContext, useCallback } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import apiCall from '../../utils/apiCalls'; 
import apiEndpoint from '../../utils/endpoint'; 
import { AuthContext } from '../../context/AuthContext'; 

import ChatsTab from './ChatsTab';
import PeopleTab from './PeopleTab';

import ChatListSkeleton from '../../components/ChatListSkeleton';

export default function FriendsScreen({ navigation }) {
  const { user } = useContext(AuthContext); 
  const [activeTab, setActiveTab] = useState('Chats'); 
  const [activeChats, setActiveChats] = useState([]);
  const [requests, setRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Search/Pagination States
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const myUserId = user?.id || null; 

  useFocusEffect(
    useCallback(() => {
      if (myUserId) {
        fetchInitialData();
      }
    }, [myUserId]) 
  );

  const fetchInitialData = async () => {
    try {
      if(activeChats.length === 0) setLoadingInitial(true);

      const [chatRes, reqRes] = await Promise.all([
        apiCall('GET', apiEndpoint?.chat?.list),
        apiCall('GET', apiEndpoint?.chat?.pending),
      ]);

      if (chatRes) setActiveChats(chatRes);
      if (reqRes) setRequests(reqRes);

      setSuggestions([]); 
      await fetchSuggestions(1, "");
      
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setTimeout(() => setLoadingInitial(false), 500);
    }
  };

  const fetchSuggestions = async (pageNum, search) => {
    if (loadingSuggestions && pageNum !== 1) return; 
    setLoadingSuggestions(true);
    try {
      const url = `${apiEndpoint?.chat?.suggestions}?page=${pageNum}&limit=10&search=${search}`;
      const res = await apiCall('GET', url);
      if (res?.success) {
        if (pageNum === 1) setSuggestions(res.users); 
        else setSuggestions(prev => [...prev, ...res.users]); 
        setHasMore(res.pagination?.hasMore || false);
        setPage(pageNum);
      }
    } catch (error) {
      console.error("Suggestion Error:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Actions...
  const handleSearch = (text) => { setSearchText(text); fetchSuggestions(1, text); };
  const handleLoadMore = () => { if (hasMore && !loadingSuggestions) fetchSuggestions(page + 1, searchText); };
  
  const sendInvite = async (friendId) => {
    try {
      const res = await apiCall('POST', apiEndpoint.chat.invite, { friendId });
      if(res?.success) {
          setSuggestions(prev => prev.filter(u => u._id !== friendId));
          Alert.alert("Invite Sent", "Waiting for them to accept.");
      }
    } catch (err) { Alert.alert("Error", "Could not send invite"); }
  };

  const acceptInvite = async (roomId) => {
    try {
      const res = await apiCall('POST', apiEndpoint.chat.accept, { roomId });
      if(res?.success) { fetchInitialData(); setActiveTab('Chats'); }
    } catch (err) { console.error("Accept Error:", err); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
           style={[styles.tabButton, activeTab === 'Chats' && styles.activeTabButton]} 
           onPress={() => setActiveTab('Chats')}
        >
           <Text style={[styles.tabText, activeTab === 'Chats' && styles.activeTabText]}>Chats</Text>
        </TouchableOpacity>

        <TouchableOpacity 
           style={[styles.tabButton, activeTab === 'People' && styles.activeTabButton]} 
           onPress={() => setActiveTab('People')}
        >
           <Text style={[styles.tabText, activeTab === 'People' && styles.activeTabText]}>
             People {requests.length > 0 && `(${requests.length})`}
           </Text>
        </TouchableOpacity>
      </View>

      {/* 👇 2. USE IMPORTED COMPONENT HERE */}
      {loadingInitial ? (
         <ChatListSkeleton />
      ) : (
         <>
            {activeTab === 'Chats' ? (
              <ChatsTab activeChats={activeChats} navigation={navigation} myUserId={myUserId} />
            ) : (
              <PeopleTab 
                  requests={requests}
                  suggestions={suggestions}
                  searchText={searchText}
                  handleSearch={handleSearch}
                  handleLoadMore={handleLoadMore}
                  hasMore={hasMore}
                  loadingSuggestions={loadingSuggestions}
                  sendInvite={sendInvite}
                  acceptInvite={acceptInvite}
                  myUserId={myUserId}
              />
            )}
         </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 15, paddingTop: 50, backgroundColor:'#ffffff' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#333' },
  
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  tabButton: {
    marginRight: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#fff'
  },
  activeTabButton: { backgroundColor: '#F5F7FA' },
  tabText: { fontSize: 16, fontWeight: '600', color: '#999' },
  activeTabText: { color: '#333', fontWeight: '800' },

});