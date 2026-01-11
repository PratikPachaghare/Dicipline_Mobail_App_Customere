import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StatusBar
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// 1. Check your imports!
import apiCall from '../../utils/apiCalls'; 
import  apiEndpoint  from '../../utils/endpoint'; // <--- MAKE SURE THIS IS IMPORTED
import male_Profile from "../../Assete/images/Profile/male.png"; 
import HetmapByUserId from "./HeatmapLederbordUser";

// 2. Component defined OUTSIDE to prevent re-render bugs
const StatCard = ({ icon, label, value, color }) => (
  <View style={styles.statCard}>
    <View style={[styles.iconBox, { backgroundColor: color }]}>
      <Ionicons name={icon} size={24} color="#fff" />
    </View>
    <View>
      {/* Ensure value is wrapped in Text. Numbers need to be cast to string or inside Text */}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

export default function UserProfileScreen({ route, navigation }) {
  const { userId } = route.params; 
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Ensure apiEndpoint is defined
        const url = apiEndpoint?.leaderboard?.leaderboard_profile(userId);
        if (!url) {
            console.error("API Endpoint not defined");
            return;
        }

        const res = await apiCall('GET', url);
        
        if (res?.success) {
          setProfile(res.data);
        }
      } catch (error) {
        console.error("Profile Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B6BFF" />
      </View>
    );
  }

  // --- ERROR/EMPTY STATE ---
  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6B6BFF" />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* --- PROFILE CARD --- */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={profile.avatar ? { uri: profile.avatar } : male_Profile} 
              style={styles.avatar} 
            />
            <View style={styles.genderBadge}>
              <Ionicons 
                name={profile.gender === 'female' ? 'female' : 'male'} 
                size={14} 
                color="#fff" 
              />
            </View>
          </View>

          {/* Fallback for Name */}
          <Text style={styles.name}>{profile.name || "Unknown"}</Text>
          <Text style={styles.subtext}>Master of Discipline</Text>
        </View>

        {/* --- STATS GRID --- */}
        <Text style={styles.sectionTitle}>Performance Stats</Text>
        
        <View style={styles.statsGrid}>
          <StatCard 
            icon="flame" 
            label="Current Streak" 
            value={`${profile.currentStreak || 0} Days`} 
            color="#FF6B6B" 
          />
          <StatCard 
            icon="trophy" 
            label="Best Streak" 
            value={`${profile.bestStreak || 0} Days`} 
            color="#FFD93D" 
          />
          <StatCard 
            icon="diamond" 
            label="Total Points" 
            value={profile.totalPoints || 0} 
            color="#6B6BFF" 
          />
          <StatCard 
            icon="calendar" 
            label="weekly Points" 
            value={profile.weeklyPoints || 0} // Ensure this field exists in backend response
            color="#4D96FF" 
          />
        </View>

        {/* --- HEATMAP COMPONENT --- */}
        {/* If the error persists, comment this line out to confirm the bug is inside this file */}
        <View style={styles.heatmapContainer}>
            <HetmapByUserId userId={userId}/>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Header
  header: {
    backgroundColor: '#6B6BFF',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50, 
    paddingBottom: 15, // Increased to make room for overlapping card
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  backButton: { padding: 5 },

  scrollContent: { paddingBottom: 40 },

  // Profile Card
  profileCard: {
    alignItems: 'center',
    marginTop: 10, // Negative margin creates the overlap effect
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 25,
  },
  avatarWrapper: { position: 'relative', marginBottom: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#fff' },
  genderBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6B6BFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subtext: { fontSize: 14, color: '#888' },

  // Stats Grid
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 20, marginBottom: 15 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: '#888' },
  heatmapContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  }
});