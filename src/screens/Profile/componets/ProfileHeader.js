import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ProfileHeader({ user }) {
  // Logic specific to this component
  const getRankColor = (rank) => {
    if (!rank) return '#6B6BFF';
    if (rank <= 10) return '#E5E4E2'; // Platinum
    if (rank <= 20) return '#FFD700'; // Gold
    return '#CD7F32'; // Bronze
  };

  const rankColor = getRankColor(user?.totalPoints);

  return (
    <View style={styles.profileCard}>
      <View style={styles.avatarWrapper}>
        <Image 
          source={{ uri: user?.avatar?.url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80' }} 
          style={styles.avatar} 
        />
        
        {/* Camera Icon */}
        <TouchableOpacity style={styles.editBadge}>
          <Ionicons name="camera" size={14} color="#fff" />
        </TouchableOpacity>

        {/* Rank Badge */}
        <View style={[styles.rankBadge, { backgroundColor: rankColor }]}>
          <Ionicons name="medal" size={12} color="#fff" />
          <Text style={styles.rankText}>{user?.rank || 'N/A'}</Text>
        </View>
      </View>

      <Text style={styles.userName}>{user?.name || 'User'}</Text>
      <Text style={styles.userEmail}>{user?.email || 'No Email'}</Text>
      <Text style={styles.userBio}>{user?.role || 'Member'}</Text>

      <TouchableOpacity style={styles.editProfileBtn}>
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2, shadowOpacity: 0.05 },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#6B6BFF', padding: 8, borderRadius: 20, borderWidth: 3, borderColor: '#fff' },
  rankBadge: { position: 'absolute', bottom: 0, left: -10, flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 14, borderWidth: 3, borderColor: '#fff' },
  rankText: { color: '#fff', fontWeight: 'bold', fontSize: 10, textTransform: 'uppercase' },
  userName: { fontSize: 20, fontWeight: '700', color: '#111', marginTop: 8 },
  userEmail: { fontSize: 14, color: '#666', marginBottom: 6 },
  userBio: { fontSize: 14, color: '#888', fontStyle: 'italic', marginBottom: 16 },
  editProfileBtn: { backgroundColor: '#F0F0F5', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  editProfileText: { fontSize: 14, fontWeight: '600', color: '#333' },
});