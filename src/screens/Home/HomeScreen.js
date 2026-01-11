import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { addAction } from '../../Store/steackSlice'; 
import { fetchMyRank, loadQuickActions, loadStreaks, loadWeeklyStreak } from './Components/DashbordLogic';

// Import Components
import DashboardHeader from './Components/DashboardHeader';
import ProgressCard from './Components/ProgressCard';
import LeaderboardCard from './Components/LeaderboardCard';
import QuickActionsSection from './Components/QuickActionsSection';
import WeeklyStreak from './Components/WeeklyStreak';
import DisciplineCard from './Components/DisciplineCard';
import AddTaskModal from './Components/AddTaskModal';

// (Optional) Move tasks list to a separate component if it grows
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, Text } from 'react-native';

export default function Dashboard({ navigation }) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  // --- REDUX DATA ---
  useEffect(() => {
    if (isFocused) {
      console.log('Refreshing Dashboard Data...');
      loadQuickActions(dispatch);
      loadWeeklyStreak(dispatch);
      loadStreaks(dispatch);
      fetchMyRank(dispatch);
    }
  }, [isFocused, dispatch]);

  const quickActions = useSelector(state => state.streaks.actions) || [];
  const streakDays = useSelector(state => state.streaks.weekly) || [];
  const streak = useSelector(state => state.streaks.streak) || { current: 0, longest: 0 };

  const disciplineStreak = streak.current;
  const completedStreaks = quickActions.filter(action => action.isCompleted === true);
  const incompleteStreaks = quickActions.filter(action => !action.isCompleted);

  // --- LOCAL STATE ---
  const [modalVisible, setModalVisible] = useState(false);
  
  // Dummy Tasks State
  const [showMore, setShowMore] = useState(false);
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Read 20 pages', done: true },
    { id: '2', title: '30 min workout', done: false },
    { id: '3', title: 'Practice coding 1 hour', done: false },
  ]);

  // --- CALCULATIONS ---
  const grandTotal = quickActions.length;
  const grandCompleted = completedStreaks.length;
  const progressPercent = grandTotal > 0 ? (grandCompleted / grandTotal) * 100 : 0;

  // --- HANDLERS ---
  const handleAddNewTask = (title, subtitle) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      subtitle: subtitle || 'Custom Goal',
      icon: 'star-outline',
      completed: false,
    };
    dispatch(addAction(newTask));
    setModalVisible(false);
  };

  const toggleTaskDone = (id) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const visibleTasks = showMore ? tasks : tasks.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      
      <DashboardHeader />

      <ScrollView contentContainerStyle={styles.container}>
        
        <ProgressCard 
          disciplineStreak={disciplineStreak}
          progressPercent={progressPercent}
          completedCount={grandCompleted}
          totalCount={grandTotal}
        />

        <LeaderboardCard onPress={() => navigation.navigate('Leaderboard')} />

        <View style={styles.settingContainer}>
          <TouchableOpacity 
            style={styles.settingBtn} 
            onPress={() => navigation.navigate('SettingTask')}
          >
            <Ionicons name="settings-outline" size={20} color="#666" />
            <Text style={styles.settingText}>Manage Tasks</Text>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>
        </View>  

        <QuickActionsSection 
          completedStreaks={completedStreaks}
          incompleteStreaks={incompleteStreaks}
          navigation={navigation}
          onAddPress={() => setModalVisible(true)}
        />

        <WeeklyStreak streakDays={streakDays} />

        <DisciplineCard 
          disciplineStreak={disciplineStreak}
          navigation={navigation}
        />

        {/* --- SIMPLE TASK LIST (Can also be extracted if needed) --- */}
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
                <Text style={[styles.taskTitle, item.done && styles.taskTitleDone]}>
                  {item.title}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.showMoreBtn} onPress={() => setShowMore(!showMore)}>
            <Text style={styles.showMoreText}>{showMore ? 'Show Less' : 'Show More'}</Text>
            <Ionicons name={showMore ? 'chevron-up' : 'chevron-down'} size={18} color="#6B6BFF" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <AddTaskModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onAdd={handleAddNewTask} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FE' },
  container: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 18, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  taskCard: {
    padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#EFEFF3',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', marginBottom: 10,
  },
  taskCardDone: { opacity: 0.6 },
  taskLeft: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 32, height: 32, borderRadius: 8, borderWidth: 1, borderColor: '#E6E6EA',
    marginRight: 12, alignItems: 'center', justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: '#6B6BFF', borderColor: '#6B6BFF' },
  taskTitle: { fontSize: 14, color: '#111' },
  taskTitleDone: { textDecorationLine: 'line-through', color: '#666' },
  showMoreBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  showMoreText: { color: '#6B6BFF', fontWeight: '600', marginRight: 5 },
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Aligns to the right           // Spacing before the next section
    marginBottom:-20,
    marginTop: 5,              // Pulls it slightly closer to Leaderboard
    paddingHorizontal: 4,
  },
  settingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#fff', // Optional: adds a small pill background
    // elevation: 1,         // Optional: adds shadow
  },
  settingText: {
    fontSize: 16,
    color: '#444',
    fontWeight: '600',
  },
});