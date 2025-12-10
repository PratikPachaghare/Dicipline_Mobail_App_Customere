import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

export default function ShareStreakScreen({ route, navigation }) {
  // Get data passed from Home Screen
  const { streakCount = 0, streakType = "General" } = route.params || {};
  
  const viewShotRef = useRef();

  // Function to Capture & Share
  const handleShare = async () => {
    try {
      // 1. Capture the Banner View as an image
      const uri = await viewShotRef.current.capture();
      
      // 2. Open Social Media Share Dialog
      const shareOptions = {
        title: 'Share my Streak',
        message: `I'm on a ${streakCount} day streak doing ${streakType}! Join me on DisciplinApp.`,
        url: uri, // The captured image
        type: 'image/png',
      };
      
      await Share.open(shareOptions);
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6B6BFF" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
           <Ionicons name="close" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preview Post</Text>
        <View style={{width: 28}} /> 
      </View>

      <View style={styles.content}>
        <Text style={styles.instruction}>Your generated banner:</Text>

        {/* --- THE BANNER (This part gets captured) --- */}
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }} style={styles.bannerContainer}>
            
            {/* 1. Branding Header */}
            <View style={styles.bannerHeader}>
              <Ionicons name="sparkles" size={24} color="#FFD700" />
              <Text style={styles.appName}>DISCIPLINAPP</Text>
            </View>

            {/* 2. Main Streak Content */}
            <View style={styles.mainContent}>
                <View style={styles.fireCircle}>
                   <Ionicons name="flame" size={60} color="#FF4500" />
                </View>
                
                <Text style={styles.streakCount}>{streakCount}</Text>
                <Text style={styles.daysText}>DAY STREAK</Text>
                
                <View style={styles.divider} />
                
                <Text style={styles.activityText}>
                  I just crushed my <Text style={{fontWeight:'900', color: '#FFE55B'}}>{streakType}</Text> session!
                </Text>
            </View>

            {/* 3. Footer / Slogan */}
            <View style={styles.bannerFooter}>
                <Text style={styles.slogan}>BUILD YOUR BEST SELF</Text>
                <Text style={styles.joinText}>Join the movement @DisciplinApp</Text>
            </View>

        </ViewShot>
      </View>

      {/* --- SHARE BUTTONS --- */}
      <View style={styles.bottomSheet}>
          <Text style={styles.shareTitle}>Share to Socials</Text>
          <TouchableOpacity style={styles.shareBtnMain} onPress={handleShare}>
              <Ionicons name="share-social" size={24} color="#6B6BFF" />
              <Text style={styles.shareBtnText}>Share Image</Text>
          </TouchableOpacity>
          
          <View style={styles.iconRow}>
              {/* These simulate shortcuts, but the main Share button handles all */}
              <View style={styles.socialIcon}><Ionicons name="logo-instagram" size={24} color="#fff" /></View>
              <View style={styles.socialIcon}><Ionicons name="logo-whatsapp" size={24} color="#fff" /></View>
              <View style={styles.socialIcon}><Ionicons name="logo-facebook" size={24} color="#fff" /></View>
          </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' }, // Dark background for preview
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  instruction: { color: '#ccc', textAlign: 'center', marginBottom: 20 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  closeBtn:{
    top:40,
    left:5
  },
  
  // --- BANNER STYLES ---
  bannerContainer: {
    width: 320,
    height: 450, // 4:5 Aspect Ratio (Good for IG)
    backgroundColor: '#6B6BFF', // Vibrant Brand Color
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 10,
  },
  bannerHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  appName: { color: '#fff', fontWeight: '900', fontSize: 18, letterSpacing: 2 },
  
  mainContent: { alignItems: 'center' },
  fireCircle: { 
    backgroundColor: '#fff', 
    width: 100, height: 100, 
    borderRadius: 50, 
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
    elevation: 5
  },
  streakCount: { fontSize: 80, fontWeight: '900', color: '#fff', lineHeight: 85 },
  daysText: { fontSize: 20, fontWeight: '700', color: 'rgba(255,255,255,0.8)', letterSpacing: 1 },
  divider: { height: 2, width: 50, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 15 },
  activityText: { fontSize: 22, color: '#fff', textAlign: 'center', fontWeight: '500' },

  bannerFooter: { alignItems: 'center', gap: 4 },
  slogan: { color: '#FFD700', fontWeight: '800', fontSize: 14, letterSpacing: 1 },
  joinText: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },

  // --- BOTTOM SHEET ---
  bottomSheet: { backgroundColor: '#fff', padding: 24, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  shareTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 16, color: '#333' },
  shareBtnMain: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#eee', padding: 16, borderRadius: 12, marginBottom: 20 
  },
  shareBtnText: { fontSize: 16, fontWeight: '700', color: '#6B6BFF' },
  iconRow: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
  socialIcon: { backgroundColor: '#6B6BFF', padding: 12, borderRadius: 50 },
});