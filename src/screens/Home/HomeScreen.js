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
  Modal, // Added
  TextInput, // Added
  Alert, // Added
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// 1. IMPORT DISPATCH
import { useSelector, useDispatch } from 'react-redux';
// 2. IMPORT YOUR REDUX ACTION (Make sure to export this from your slice)
import { addAction } from '../../Store/steackSlice'; // Adjust path if needed

export default function Dashboard({ navigation }) {
  const dispatch = useDispatch();

  // --- REDUX DATA ---
  const quickActions = useSelector(state => state.streaks.actions) || [];

  const completedStreaks = quickActions.filter(
    action => action.completed === true,
  );
  const incompleteStreaks = quickActions.filter(action => !action.completed);

  // --- LOCAL STATE FOR MODAL ---
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSub, setNewTaskSub] = useState('');

  // --- TASKS STATE (Your existing dummy list) ---
  const [showMore, setShowMore] = useState(false);
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Read 20 pages', done: true },
    { id: '2', title: '30 min workout', done: false },
    { id: '3', title: 'Practice coding 1 hour', done: false },
    { id: '4', title: 'Meditation 10 min', done: false },
    { id: '5', title: 'Drink 3L water', done: false },
  ]);

  // --- CALCULATIONS ---
  const totalStreaksCount = quickActions.length;
  const doneStreaksCount = completedStreaks.length;
  const grandTotal = totalStreaksCount;
  const grandCompleted = doneStreaksCount;
  const progressPercent =
    grandTotal > 0 ? (grandCompleted / grandTotal) * 100 : 0;

  // --- HELPERS ---
  const streakDays = [
    { day: 'Mon', done: true },
    { day: 'Tue', done: false },
    { day: 'Wed', done: false },
    { day: 'Thu', done: false },
    { day: 'Fri', done: false },
    { day: 'Sat', done: false },
    { day: 'Sun', done: true },
  ];
  const disciplineStreak = 10;
  const visibleTasks = showMore ? tasks : tasks.slice(0, 3);

  function toggleTaskDone(id) {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  // --- FUNCTION: HANDLE ADD NEW TASK ---
  const handleAddNewTask = () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }

    const newTask = {
      id: Date.now().toString(), // Unique ID
      title: newTaskTitle,
      subtitle: newTaskSub || 'Custom Goal',
      icon: 'star-outline', // Default icon
      completed: false,
    };

    // Dispatch to Redux
    dispatch(addAction(newTask));

    // Reset and Close
    setNewTaskTitle('');
    setNewTaskSub('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="menu-outline" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="person-circle-outline" size={30} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* --- PROGRESS CARD --- */}
        <View style={styles.progressCard}>
          {/* 🔥 FIRE STREAK BADGE */}
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>{disciplineStreak}</Text>
            <Ionicons
              name="flame"
              size={40}
              color="#FF4500"
              style={styles.streakicon}
            />
          </View>
          <View>
            <Text style={styles.progressLabel}>Today’s Progress</Text>
            <Text style={styles.progressPercent}>
              {progressPercent.toFixed(0)}%
            </Text>
          </View>
          <View style={styles.progressRight}>
            <View style={styles.circleOuter}>
              <View
                style={[styles.circleInner, { height: `${progressPercent}%` }]}
              />
            </View>
            <Text style={styles.progressCount}>
              {grandCompleted}/{grandTotal}
            </Text>
          </View>
        </View>

        {/* LeaderBord buton componets mordern card  */}
        {/* <TouchableOpacity
          style={styles.bannerBtn}
          onPress={() => navigation.navigate('Leaderboard')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="podium"
              size={22}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.bannerText}>See Leaderboard</Text>
          </View>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#4</Text>
          </View>
        </TouchableOpacity> */}
        
        {/* leaderbord premium card  */}
        <TouchableOpacity
          style={styles.leaderboardCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Leaderboard')}
        >
          <View style={styles.lbContent}>
            {/* Icon Circle */}
            <View style={styles.trophyContainer}>
              <Text style={{ fontSize: 24 }}>🏆</Text>
            </View>

            {/* Text Section */}
            <View style={styles.lbTextContainer}>
              <Text style={styles.lbTitle}>Leaderboard</Text>
              <Text style={styles.lbSubtitle}>
                You are ranked{' '}
                <Text style={{ fontWeight: 'bold', color: '#FFD700' }}>#2</Text>{' '}
                this week!
              </Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#C4C4C4" />
        </TouchableOpacity>

        {/* --- COMPLETED STREAKS --- */}
        {completedStreaks.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Completed Today ✅</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {completedStreaks.map(action => (
                <TouchableOpacity
                  key={action.id}
                  style={[
                    styles.quickCard,
                    { backgroundColor: '#4CD964', borderColor: '#4CD964' },
                  ]}
                  disabled={true}
                >
                  <Ionicons name="checkmark-circle" size={32} color="#fff" />
                  <Text style={[styles.quickTitle, { color: '#fff' }]}>
                    {action.title}
                  </Text>
                  <Text style={[styles.quickSub, { color: '#eee' }]}>
                    Completed
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* --- INCOMPLETE STREAKS (QUICK ACTIONS) --- */}
        <View>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* 1. The List of Tasks */}
            {incompleteStreaks.map(action => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickCard}
                onPress={() =>
                  navigation.navigate('Capture', { streakType: action.id })
                }
              >
                <Ionicons name={action.icon || 'star'} size={32} color="#333" />
                <Text style={styles.quickTitle}>{action.title}</Text>
                <Text style={styles.quickSub}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}

            {/* 2. THE ADD NEW BUTTON (+) */}
            <TouchableOpacity
              style={[styles.quickCard, styles.addCard]}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle-outline" size={40} color="#6B6BFF" />
              <Text style={[styles.quickTitle, { color: '#6B6BFF' }]}>
                Add Task
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* WEEKLY STREAK */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Streak</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
          >
            {streakDays.map((d, i) => (
              <View style={styles.streakItem} key={i}>
                <View
                  style={[styles.streakDot, d.done && styles.streakDotDone]}
                >
                  {d.done && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
                <Text style={styles.streakLabel}>{d.day}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* DISCIPLINE STREAK CARD */}
        <View style={[styles.card, styles.streakCard]}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/2017/2017997.png',
            }}
            style={styles.streakIcon}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.streakLabelLarge}>Discipline Streak</Text>
            <Text style={styles.streakDays}>{disciplineStreak} days</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={styles.streakBtn}>
                <Text style={styles.streakBtnText}>Keep Going</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.streakBtn, { backgroundColor: '#FFD700' }]}
                onPress={() =>
                  navigation.navigate('ShareStreak', {
                    streakCount: disciplineStreak,
                    streakType: 'Daily Goals',
                  })
                }
              >
                <Text style={[styles.streakBtnText, { color: '#333' }]}>
                  Share 🚀
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* TASKS LIST */}
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
                <View
                  style={[styles.checkbox, item.done && styles.checkboxDone]}
                >
                  {item.done && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text
                  style={[styles.taskTitle, item.done && styles.taskTitleDone]}
                >
                  {item.title}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.showMoreBtn}
            onPress={() => setShowMore(!showMore)}
          >
            <Text style={styles.showMoreText}>
              {showMore ? 'Show Less' : 'Show More'}
            </Text>
            <Ionicons
              name={showMore ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#6B6BFF"
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* --- ADD TASK MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add Quick Action</Text>

            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Read Book"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />

            <Text style={styles.label}>Subtitle (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 10 Pages"
              value={newTaskSub}
              onChangeText={setNewTaskSub}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#eee' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: '#333' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#6B6BFF' }]}
                onPress={handleAddNewTask}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  Add Task
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FE' },
  header: {
    height: 85,
    paddingTop: 30,
    paddingHorizontal: 16,
    backgroundColor: '#FFE55B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: { padding: 5 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    gap: 4,
    elevation: 4,
    shadowColor: '#f50000ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  streakText: { fontSize: 32, fontWeight: '800', color: '#FF4500' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  container: { padding: 16, paddingBottom: 100 },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: { fontSize: 14, fontWeight: '600', color: '#555' },
  progressPercent: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
    marginTop: 6,
  },
  progressRight: { alignItems: 'center' },
  circleOuter: {
    width: 38,
    height: 80,
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  circleInner: { width: '100%', backgroundColor: '#6B6BFF' },
  progressCount: { fontSize: 13, color: '#666', marginTop: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  taskCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFEFF3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  taskCardDone: { opacity: 0.6 },
  taskLeft: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6E6EA',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // leaderBoard css for premium card
  leaderboardCard: {
    backgroundColor: '#373737ff', // Dark background for contrast
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  lbContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trophyContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#525252ff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lbTextContainer: {
    justifyContent: 'center',
  },
  lbTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  lbSubtitle: {
    color: '#aaa',
    fontSize: 15,
    marginTop: 2,
  },
  // leaderbord css modern card
  // minimalRow: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   paddingVertical: 15,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#f0f0f0',
  // },
  // rowLeft: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // iconBox: {
  //   width: 32,
  //   height: 32,
  //   backgroundColor: '#FFF4E5', // Light orange background
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginRight: 12,
  // },
  // rowText: {
  //   fontSize: 16,
  //   color: '#333',
  //   fontWeight: '500',
  // },

  checkboxDone: { backgroundColor: '#6B6BFF', borderColor: '#6B6BFF' },
  taskTitle: { fontSize: 14, color: '#111' },
  taskTitleDone: { textDecorationLine: 'line-through', color: '#666' },
  showMoreBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  showMoreText: { color: '#6B6BFF', fontWeight: '600', marginRight: 5 },
  streakItem: { alignItems: 'center', marginRight: 20 },
  streakDot: {
    width: 38,
    height: 38,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C9C9D1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakDotDone: { backgroundColor: '#4CD964', borderColor: '#4CD964' },
  streakLabel: { marginTop: 6, color: '#444', fontSize: 12 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 10,
  },
  quickCard: {
    width: 130,
    backgroundColor: '#fff',
    marginRight: 12,
    marginBottom: 10,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EFEFF3',
  },

  // NEW STYLE FOR ADD CARD
  addCard: {
    borderStyle: 'dashed',
    borderColor: '#6B6BFF',
    backgroundColor: '#F8F9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickTitle: { fontSize: 15, fontWeight: '700', marginTop: 10 },
  quickSub: { fontSize: 12, color: '#666', marginTop: 4 },
  streakCard: { flexDirection: 'row', alignItems: 'center' },
  streakIcon: { width: 70, height: 70 },
  streakLabelLarge: { fontSize: 16, fontWeight: '700' },
  streakDays: { fontSize: 24, fontWeight: '800', marginVertical: 8 },
  streakBtn: {
    backgroundColor: '#6B6BFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  streakBtnText: { color: '#fff', fontWeight: '700' },

  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: { fontSize: 14, color: '#666', marginBottom: 5, marginTop: 10 },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalButtons: { flexDirection: 'row', marginTop: 20, gap: 10 },
  modalBtn: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
});
