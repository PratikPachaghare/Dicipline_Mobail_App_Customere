import React, { useContext } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { AuthContext } from '../../context/AuthContext';

// --- IMPORT SUB-COMPONENTS ---
import ProfileHeader from './componets/ProfileHeader';     // The file we created above
import RecentHistory from './componets/RecentHistory';     // The file we created above
import AccountSettings from './componets/AccountSettings'; // The file we created above
import StatsOverview from '../Stats/StatsOverview';
import BadgesSection from '../Stats/BadgesSection';
import HabitHeatmap from '../Stats/HabitHeatmap';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext) || {};
  const streakActions = useSelector(state => state.streaks.actions) || [];
    const streakDays = useSelector(state => state.streaks.weekly) || [];
    const streak = useSelector(state => state.streaks.streak) || {
      currentStreak: 0,
      longestStreak: 0,
    };

  // Data for History (could eventually come from API)
  const historyData = [
    { id: 1, action: 'Gym', date: 'Today, 9:00 AM', status: 'completed' },
    { id: 2, action: 'Reading', date: 'Yesterday, 8:30 PM', status: 'completed' },
    { id: 3, action: 'Meditation', date: 'Yesterday, 7:00 AM', status: 'missed' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. PASS USER DATA TO PROFILE HEADER */}
        <ProfileHeader user={user} />

        {/* 2. HARD MODE BUTTON (Kept here as it navigates) */}
        <View style={styles.section}>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Commitment')}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconBox, { backgroundColor: '#FFF5F5' }]}>
                  <Ionicons name="flame" size={20} color="#FF4500" />
                </View>
                <Text style={[styles.menuText, { color: '#FF4500', fontWeight: 'bold' }]}>
                  Hard Diciplin Mode 💀
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. EXISTING COMPONENTS */}
        <StatsOverview
          habitsCount={streakActions.length}
          streakDays={streakDays}
          streak={streak}
        />
        <HabitHeatmap />
        <BadgesSection />

        {/* 4. PASS DATA TO HISTORY */}
        <RecentHistory data={historyData} />

        {/* 5. PASS LOGOUT TO SETTINGS */}
        <AccountSettings onLogout={logout} userID={user.id} />
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, paddingTop: 40, backgroundColor: '#F8F9FE',
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#111' },
  scrollContent: { paddingHorizontal: 20 },
  section: { marginBottom: 24 },
  
  // Styles for the Hard Mode button (since it's still in this file)
  menuContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 12 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIconBox: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  menuText: { fontSize: 15, fontWeight: '500' },
});