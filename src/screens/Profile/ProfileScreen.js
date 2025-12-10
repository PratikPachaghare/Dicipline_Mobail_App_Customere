import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

export default function ProfileScreen({ navigation }) {
  // --- 1. GET DATA (Mock + Redux) ---
  const streakActions = useSelector((state) => state.streaks.actions) || [];
  
  // Dummy User Data (Replace with real Auth data later)
  const user = {
    name: "Alex Johnson",
    email: "alex@disciplinapp.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    bio: "Building consistency one day at a time. 🚀"
  };

  // Dummy History Data
  const historyData = [
    { id: 1, action: 'Gym', date: 'Today, 9:00 AM', status: 'completed' },
    { id: 2, action: 'Reading', date: 'Yesterday, 8:30 PM', status: 'completed' },
    { id: 3, action: 'Meditation', date: 'Yesterday, 7:00 AM', status: 'missed' },
    { id: 4, action: 'Yoga', date: 'Mon, 6:00 AM', status: 'completed' },
  ];

  const StatBox = ({ label, value, icon, color }) => (
    <View style={[styles.statBox, { borderColor: color }]}>
      <View style={[styles.statIconCircle, { backgroundColor: color }]}>
         <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const MenuOption = ({ icon, title, isDestructive }) => (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <View style={[styles.menuIconBox, isDestructive && { backgroundColor: '#FFEBEE' }]}>
           <Ionicons name={icon} size={20} color={isDestructive ? 'red' : '#333'} />
        </View>
        <Text style={[styles.menuText, isDestructive && { color: 'red' }]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />
      
      {/* HEADER TITLE */}
      <View style={styles.header}>
         <Text style={styles.headerTitle}>My Profile</Text>
         <TouchableOpacity>
           <Ionicons name="settings-outline" size={24} color="#333" />
         </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- 1. PROFILE CARD --- */}
        <View style={styles.profileCard}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <TouchableOpacity style={styles.editBadge}>
             <Ionicons name="camera" size={14} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userBio}>{user.bio}</Text>

          <TouchableOpacity style={styles.editProfileBtn}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* --- 2. STATS OVERVIEW --- */}
        <View style={styles.statsContainer}>
          <StatBox label="Streaks" value="12" icon="flame" color="#FF4500" />
          <StatBox label="Completed" value="84" icon="checkmark" color="#4CD964" />
          <StatBox label="Habits" value={streakActions.length} icon="list" color="#6B6BFF" />
        </View>

        {/* --- 3. RECENT HISTORY --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent History</Text>
          {historyData.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <View style={[
                  styles.historyDot, 
                  { backgroundColor: item.status === 'completed' ? '#4CD964' : '#ff4444' }
                ]}>
                  <Ionicons 
                    name={item.status === 'completed' ? 'checkmark' : 'close'} 
                    size={14} 
                    color="#fff" 
                  />
                </View>
                <View>
                  <Text style={styles.historyAction}>{item.action}</Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>
              </View>
              <Text style={[
                styles.historyStatus, 
                { color: item.status === 'completed' ? '#4CD964' : '#ff4444' }
              ]}>
                {item.status === 'completed' ? 'Done' : 'Missed'}
              </Text>
            </View>
          ))}
        </View>

        {/* --- 4. SETTINGS & INFO --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuContainer}>
            <MenuOption icon="notifications-outline" title="Notifications" />
            <MenuOption icon="shield-checkmark-outline" title="Privacy & Security" />
            <MenuOption icon="help-circle-outline" title="Help & Support" />
            <MenuOption icon="log-out-outline" title="Log Out" isDestructive />
          </View>
        </View>

        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  
  // Header
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, paddingTop: 40, backgroundColor: '#F8F9FE'
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#111' },

  scrollContent: { paddingHorizontal: 20 },

  // Profile Card
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4,
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  editBadge: {
    position: 'absolute', top: 90, right: '38%',
    backgroundColor: '#6B6BFF', padding: 6, borderRadius: 20, borderWidth: 2, borderColor: '#fff'
  },
  userName: { fontSize: 20, fontWeight: '700', color: '#111' },
  userEmail: { fontSize: 14, color: '#666', marginBottom: 6 },
  userBio: { fontSize: 14, color: '#888', fontStyle: 'italic', marginBottom: 16 },
  editProfileBtn: {
    backgroundColor: '#F0F0F5', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20
  },
  editProfileText: { fontSize: 14, fontWeight: '600', color: '#333' },

  // Stats Grid
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statBox: {
    width: '31%', backgroundColor: '#fff', borderRadius: 16, padding: 12, alignItems: 'center',
    borderWidth: 1, borderBottomWidth: 4, elevation: 1
  },
  statIconCircle: { padding: 8, borderRadius: 50, marginBottom: 8 },
  statValue: { fontSize: 18, fontWeight: '800', color: '#111' },
  statLabel: { fontSize: 12, color: '#666', fontWeight: '500' },

  // Sections
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 12 },

  // History List
  historyItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 10,
    borderWidth: 1, borderColor: '#f0f0f0'
  },
  historyLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  historyDot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  historyAction: { fontSize: 15, fontWeight: '600', color: '#333' },
  historyDate: { fontSize: 12, color: '#999' },
  historyStatus: { fontSize: 13, fontWeight: '600' },

  // Menu Options
  menuContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 8 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 12,
    borderBottomWidth: 1, borderBottomColor: '#f5f5f5'
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIconBox: { 
    width: 32, height: 32, borderRadius: 8, backgroundColor: '#F5F5FA',
    alignItems: 'center', justifyContent: 'center' 
  },
  menuText: { fontSize: 15, fontWeight: '500', color: '#333' },
});