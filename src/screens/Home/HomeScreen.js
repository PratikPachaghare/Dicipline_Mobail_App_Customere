import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

export default function Dashboard({ navigation }) {
  // --- 1. REDUX DATA ---
  const streaks = useSelector((state) => state.streaks) || {};

// --- 1. REDUX DATA ---
// We only need the 'actions' array. It contains everything (id, title, AND completed status).
const quickActions = useSelector((state) => state.streaks.actions) || [];

const completedStreaks = quickActions.filter((action) => action.completed === true);
const incompleteStreaks = quickActions.filter((action) => !action.completed);

  // --- 2. DEFINE STREAK ACTIONS ---
  // const quickActions = [
  //   { id: 'gym', title: 'Gym', subtitle: 'Start workout', icon: 'barbell-outline' },
  //   { id: 'yoga', title: 'Yoga', subtitle: 'Morning Stretch', icon: 'body-outline' },
  //   { id: 'study', title: 'Study', subtitle: 'Start session', icon: 'create-outline' },
  //   { id: 'meditation', title: 'Meditation', subtitle: 'Relax & focus', icon: 'leaf-outline' },
  // ];
  // // Filter Streaks
  // const completedStreaks = quickActions.filter((action) => streaks[action.id] === true);
  // const incompleteStreaks = quickActions.filter((action) => !streaks[action.id]);

  // --- 3. TASKS STATE ---
  const [showMore, setShowMore] = useState(false);
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Read 20 pages', done: true },
    { id: '2', title: '30 min workout', done: false },
    { id: '3', title: 'Practice coding 1 hour', done: false },
    { id: '4', title: 'Meditation 10 min', done: false },
    { id: '5', title: 'Drink 3L water', done: false },
  ]);

  // --- 4. MASTER PROGRESS CALCULATION (The Update) ---
  
  // A. Count Streaks
  const totalStreaksCount = quickActions.length;
  const doneStreaksCount = completedStreaks.length;

  // B. Count Tasks
  const totalTasksCount = tasks.length;
  const doneTasksCount = tasks.filter(t => t.done).length;

  // C. Combine Both
  const grandTotal = totalStreaksCount;
  const grandCompleted = doneStreaksCount ;

  // D. Calculate Percentage
  const progressPercent = grandTotal > 0 ? (grandCompleted / grandTotal) * 100 : 0;

  // --- Helpers ---
  const streakDays = [
    { day: 'Mon', done: true }, { day: 'Tue', done: false }, { day: 'Wed', done: false },
    { day: 'Thu', done: false }, { day: 'Fri', done: false }, { day: 'Sat', done: false }, { day: 'Sun', done: true },
  ];
  const disciplineStreak = 10;
  const visibleTasks = showMore ? tasks : tasks.slice(0, 3);

  function toggleTaskDone(id) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn}><Ionicons name="menu-outline" size={26} color="#111" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity style={styles.iconBtn}><Ionicons name="person-circle-outline" size={30} color="#111" /></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        
        {/* --- PROGRESS CARD (Updated with Master Calculation) --- */}
        <View style={styles.progressCard}>
         
         
           {/* --- 🔥 FIRE STREAK BADGE --- */}
        <View style={styles.streakBadge}>
           <Text style={styles.streakText}>{disciplineStreak}</Text>
           <Ionicons name="flame" size={40} color="#FF4500" style={styles.streakicon} />
        </View>
        <View>
            <Text style={styles.progressLabel}>Today’s Progress</Text>
            <Text style={styles.progressPercent}>{progressPercent.toFixed(0)}%</Text>
          </View>
         
          
          <View style={styles.progressRight}>
            <View style={styles.circleOuter}>
              {/* Dynamic Height based on progress */}
              <View style={[styles.circleInner, { height: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressCount}>{grandCompleted}/{grandTotal}</Text>
          </View>
        </View>

        {/* --- COMPLETED STREAKS --- */}
        {completedStreaks.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Completed Today ✅</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {completedStreaks.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={[styles.quickCard, { backgroundColor: '#4CD964', borderColor: '#4CD964' }]}
                  disabled={true}
                >
                  <Ionicons name="checkmark-circle" size={32} color="#fff" />
                  <Text style={[styles.quickTitle, { color: '#fff' }]}>{action.title}</Text>
                  <Text style={[styles.quickSub, { color: '#eee' }]}>Completed</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* --- INCOMPLETE STREAKS --- */}
        {incompleteStreaks.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {incompleteStreaks.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickCard}
                  onPress={() => navigation.navigate("Capture", { streakType: action.id })}
                >
                  <Ionicons name={action.icon} size={32} color="#333" />
                  <Text style={styles.quickTitle}>{action.title}</Text>
                  <Text style={styles.quickSub}>{action.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* WEEKLY STREAK */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Streak</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {streakDays.map((d, i) => (
              <View style={styles.streakItem} key={i}>
                <View style={[styles.streakDot, d.done && styles.streakDotDone]}>
                  {d.done && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <Text style={styles.streakLabel}>{d.day}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ---------- DISCIPLINE STREAK CARD ---------- */}
        <View style={[styles.card, styles.streakCard]}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2017/2017997.png' }}
            style={styles.streakIcon}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.streakLabelLarge}>Discipline Streak</Text>
            <Text style={styles.streakDays}>{disciplineStreak} days</Text>
            
            <View style={{ flexDirection: 'row', gap: 10 }}>
                {/* Existing Keep Going Button */}
                <TouchableOpacity style={styles.streakBtn}>
                  <Text style={styles.streakBtnText}>Keep Going</Text>
                </TouchableOpacity>

                {/* NEW SHARE BUTTON */}
                <TouchableOpacity 
                    style={[styles.streakBtn, { backgroundColor: '#FFD700' }]}
                    onPress={() => navigation.navigate('ShareStreak', { 
                        streakCount: disciplineStreak, 
                        streakType: "Daily Goals" 
                    })}
                >
                  <Text style={[styles.streakBtnText, { color: '#333' }]}>Share 🚀</Text>
                </TouchableOpacity>
            </View>

          </View>
        </View>

        {/* TASKS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Tasks</Text>
          {visibleTasks.map(item => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={[styles.taskCard, item.done && styles.taskCardDone]}
              onPress={() => toggleTaskDone(item.id)}
            >
              <View style={styles.taskLeft}>
                <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
                  {item.done && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
                <Text style={[styles.taskTitle, item.done && styles.taskTitleDone]}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.showMoreBtn} onPress={() => setShowMore(!showMore)}>
            <Text style={styles.showMoreText}>{showMore ? 'Show Less' : 'Show More'}</Text>
            <Ionicons name={showMore ? 'chevron-up' : 'chevron-down'} size={18} color="#6B6BFF" />
          </TouchableOpacity>
        </View>

        {/* DISCIPLINE CARD */}
        {/* <View style={[styles.card, styles.streakCard]}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2017/2017997.png' }} style={styles.streakIcon} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.streakLabelLarge}>Discipline Streak</Text>
            <Text style={styles.streakDays}>{disciplineStreak} days</Text>
            <TouchableOpacity style={styles.streakBtn}><Text style={styles.streakBtnText}>Keep Going</Text></TouchableOpacity>
          </View>
        </View> */}

        <View style={{ height: 80 }} />
      </ScrollView>
     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FE' },
  header: { height: 85,paddingTop:30,  paddingHorizontal: 16, backgroundColor: '#FFE55B', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { padding: 5 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center', // Centers text and icon vertically
    backgroundColor: '#ffffffff', // White background pops against yellow header
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50, // Makes it a perfect pill shape
    gap: 4, // Adds space between Text and Icon automatically
    
    // Shadow for depth (like a sticker)
    elevation: 4,
    shadowColor: '#f50000ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  streakText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF4500', // Fire Orange Color
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  container: { padding: 16, paddingBottom: 100 },
  progressCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 18, elevation: 3, flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: 14, fontWeight: '600', color: '#555' },
  progressPercent: { fontSize: 28, fontWeight: '800', color: '#111', marginTop: 6 },
  progressRight: { alignItems: 'center' },
  circleOuter: { width: 38, height: 80, backgroundColor: '#eee', borderRadius: 10, overflow: 'hidden', justifyContent: 'flex-end' },
  circleInner: { width: '100%', backgroundColor: '#6B6BFF' },
  progressCount: { fontSize: 13, color: '#666', marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 18, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  taskCard: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#EFEFF3', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', marginBottom: 10 },
  taskCardDone: { opacity: 0.6 },
  taskLeft: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, borderColor: '#E6E6EA', marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { backgroundColor: '#6B6BFF', borderColor: '#6B6BFF' },
  taskTitle: { fontSize: 14, color: '#111' },
  taskTitleDone: { textDecorationLine: 'line-through', color: '#666' },
  showMoreBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  showMoreText: { color: '#6B6BFF', fontWeight: '600', marginRight: 5 },
  streakItem: { alignItems: 'center', marginRight: 20 },
  streakDot: { width: 38, height: 38, borderRadius: 20, borderWidth: 1, borderColor: '#C9C9D1', alignItems: 'center', justifyContent: 'center' },
  streakDotDone: { backgroundColor: '#4CD964', borderColor: '#4CD964' },
  streakLabel: { marginTop: 6, color: '#444', fontSize: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, marginTop: 10 },
  quickCard: { width: 130, backgroundColor: '#fff', marginRight: 12, marginBottom: 10, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#EFEFF3' },
  quickTitle: { fontSize: 15, fontWeight: '700', marginTop: 10 },
  quickSub: { fontSize: 12, color: '#666', marginTop: 4 },
  streakCard: { flexDirection: 'row', alignItems: 'center' },
  streakIcon: { width: 70, height: 70 },
  streakLabelLarge: { fontSize: 16, fontWeight: '700' },
  streakDays: { fontSize: 24, fontWeight: '800', marginVertical: 8 },
  streakBtn: { backgroundColor: '#6B6BFF', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  streakBtnText: { color: '#fff', fontWeight: '700' },
  bottomNav: { height: 68, borderTopWidth: 1, borderTopColor: '#ddd', backgroundColor: '#fff', position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  navBtn: { alignItems: 'center' },
  navLabel: { fontSize: 11, marginTop: 2 },
});