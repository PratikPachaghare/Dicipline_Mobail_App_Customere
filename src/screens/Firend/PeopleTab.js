import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/150';

const PeopleTab = ({ 
  requests, 
  suggestions, 
  searchText, 
  handleSearch, 
  handleLoadMore, 
  hasMore, 
  loadingSuggestions, 
  sendInvite, 
  acceptInvite, 
  myUserId 
}) => {

  const getAvatarUrl = (avatarData) => {
    if (typeof avatarData === 'string' && avatarData.trim() !== '') return avatarData;
    if (typeof avatarData === 'object' && avatarData?.url) return avatarData.url;
    return PLACEHOLDER_IMG;
  };

  // --- RENDERERS ---
  const renderRequest = (item) => {
    const otherUser = item.participants.find(p => p._id !== myUserId) || item.participants[0];
    return (
      <View key={item._id} style={styles.row}>
          <Image source={{ uri: getAvatarUrl(otherUser?.avatar) }} style={styles.avatar} />
          <View style={styles.infoArea}>
              <Text style={styles.name}>{otherUser?.name}</Text>
              <Text style={styles.subText}>Sent you an invite</Text>
          </View>
          <TouchableOpacity style={styles.acceptBtn} onPress={() => acceptInvite(item._id)}>
              <Text style={styles.btnTextWhite}>Accept</Text>
          </TouchableOpacity>
      </View>
    );
  };

  const renderSuggestion = ({ item }) => (
    <View style={styles.row}>
      <Image source={{ uri: getAvatarUrl(item.avatar) }} style={styles.avatar} />
      <View style={styles.infoArea}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.subText}>Suggested Friend</Text>
      </View>
      <TouchableOpacity style={styles.inviteBtn} onPress={() => sendInvite(item._id)}>
        <Ionicons name="add" size={16} color="#333" style={{marginRight: 2}} />
        <Text style={styles.btnTextDark}>Invite</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={suggestions}
      keyExtractor={item => item._id}
      renderItem={renderSuggestion}
      
      // HEADER: Search Bar & Requests
      ListHeaderComponent={
        <>
          <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#888" style={{marginRight: 10}}/>
              <TextInput 
                placeholder="Search people..." 
                style={styles.searchInput}
                value={searchText}
                onChangeText={handleSearch}
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
           </View>

           {requests.length > 0 && (
               <View style={styles.sectionHeader}>
                   <Text style={styles.sectionTitle}>Invitations ({requests.length})</Text>
                   {requests.map(req => renderRequest(req))}
               </View>
           )}

           <View style={styles.sectionHeader}>
               <Text style={styles.sectionTitle}>Suggestions</Text>
           </View>
        </>
      }

      // FOOTER: Load More
      ListFooterComponent={
        <View style={{paddingVertical: 20}}>
           {suggestions.length === 0 && !loadingSuggestions && (
              <Text style={{textAlign:'center', color:'#999'}}>No users found</Text>
           )}
           
           {hasMore && (
             <TouchableOpacity 
                style={styles.loadMoreBtn} 
                onPress={handleLoadMore}
                disabled={loadingSuggestions}
             >
                {loadingSuggestions ? (
                  <ActivityIndicator color="#4D96FF" size="small" />
                ) : (
                  <Text style={styles.loadMoreText}>Load More</Text>
                )}
             </TouchableOpacity>
           )}
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7FA',
    borderRadius: 12, marginHorizontal: 15, marginTop: 15, paddingHorizontal: 15, paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#333', paddingVertical: 0 },
  sectionHeader: { marginTop: 15, paddingHorizontal: 15, marginBottom: 5 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#888', textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderColor: '#f9f9f9' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#eee' },
  infoArea: { flex: 1, marginLeft: 15 },
  name: { fontSize: 16, fontWeight: '600', color: '#222' },
  subText: { color: '#888', fontSize: 13, marginTop: 2 },
  inviteBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  acceptBtn: { backgroundColor: '#4D96FF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  loadMoreBtn: { padding: 15, alignItems: 'center', justifyContent: 'center' },
  btnTextWhite: { color: '#fff', fontWeight: '600', fontSize: 12 },
  btnTextDark: { color: '#333', fontWeight: '600', fontSize: 12 },
  loadMoreText: { color: '#4D96FF', fontWeight: '600', fontSize: 14 },
});

export default PeopleTab;