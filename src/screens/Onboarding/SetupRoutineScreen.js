import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { setAllActions } from '../../Store/steackSlice.js'; // Adjust path

export default function SetupRoutineScreen({ navigation }) {
  const dispatch = useDispatch();
  
  // 1. Pre-defined Popular Habits
  const popularHabits = [
    { id: 'gym', title: 'Gym', subtitle: 'Start workout', icon: 'barbell-outline' },
    { id: 'yoga', title: 'Yoga', subtitle: 'Morning Stretch', icon: 'body-outline' },
    { id: 'study', title: 'Study', subtitle: 'Focus session', icon: 'create-outline' },
    { id: 'meditation', title: 'Meditation', subtitle: 'Relax & focus', icon: 'leaf-outline' },
    { id: 'water', title: 'Drink Water', subtitle: '3L Goal', icon: 'water-outline' },
    { id: 'read', title: 'Reading', subtitle: '20 Pages', icon: 'book-outline' },
  ];

  // 2. State for Selected & Custom Tasks
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  // 3. Custom Task Form State
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');

  // Toggle Selection of Popular Habits
  const toggleHabit = (habit) => {
    const exists = selectedTasks.find(t => t.id === habit.id);
    if (exists) {
      setSelectedTasks(selectedTasks.filter(t => t.id !== habit.id));
    } else {
      setSelectedTasks([...selectedTasks, { ...habit, completed: false }]);
    }
  };

  // Add Custom Task Logic
  const addCustomTask = () => {
    if (!customName.trim()) {
      Alert.alert("Missing Name", "Please enter a task name.");
      return;
    }
    
    // Validate Description Word Count (Max 10 words for AI)
    const wordCount = customDesc.trim().split(/\s+/).length;
    if (wordCount > 10) {
      Alert.alert("Too Long", "Description must be 10 words or less for AI validation.");
      return;
    }

    const newTask = {
      id: Date.now().toString(), // Unique ID
      title: customName,
      subtitle: customDesc || 'Custom Goal',
      icon: 'star-outline', // Default icon for custom
      completed: false
    };

    setSelectedTasks([...selectedTasks, newTask]);
    setModalVisible(false);
    setCustomName('');
    setCustomDesc('');
  };

  // Save & Continue
  const handleFinish = () => {
    if (selectedTasks.length === 0) {
      Alert.alert("Empty Routine", "Please select at least one habit to start.");
      return;
    }
    
    // Save to Redux
    dispatch(setAllActions(selectedTasks));
    
    // Navigate to Home
    // If you are using Stack Navigator inside App.js, you might need to 'replace' 
    // to prevent going back to setup.
    navigation.replace('HomeStack'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Build Your Routine 🛠️</Text>
        <Text style={styles.subtitle}>Select at least 1 habit to track daily.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* SECTION A: Popular Habits */}
        <Text style={styles.sectionTitle}>Popular Habits</Text>
        <View style={styles.grid}>
          {popularHabits.map((habit) => {
            const isSelected = selectedTasks.find(t => t.id === habit.id);
            return (
              <TouchableOpacity
                key={habit.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => toggleHabit(habit)}
              >
                <Ionicons 
                  name={isSelected ? "checkmark-circle" : habit.icon} 
                  size={32} 
                  color={isSelected ? "#fff" : "#333"} 
                />
                <Text style={[styles.cardTitle, isSelected && {color:'#fff'}]}>{habit.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* SECTION B: Your Routine List */}
        <Text style={styles.sectionTitle}>Your Daily Plan ({selectedTasks.length})</Text>
        {selectedTasks.map((task, index) => (
          <View key={task.id} style={styles.listItem}>
            <View style={{flexDirection:'row', alignItems:'center', gap:10}}>
              <Ionicons name={task.icon} size={24} color="#6B6BFF" />
              <View>
                <Text style={styles.listTitle}>{task.title}</Text>
                <Text style={styles.listSub}>{task.subtitle}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => toggleHabit(task)}>
              <Ionicons name="trash-outline" size={20} color="#ff4444" />
            </TouchableOpacity>
          </View>
        ))}

        {/* SECTION C: Add Custom Button */}
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={24} color="#6B6BFF" />
          <Text style={styles.addBtnText}>Add Custom Task</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* FOOTER: Finish Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
          <Text style={styles.finishText}>Start My Journey 🚀</Text>
        </TouchableOpacity>
      </View>

      {/* --- MODAL FOR CUSTOM TASK --- */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Custom Task</Text>
            
            <Text style={styles.label}>Task Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Piano Practice"
              value={customName}
              onChangeText={setCustomName}
            />

            <Text style={styles.label}>AI Validation Description (Max 10 words)</Text>
            <TextInput 
              style={[styles.input, {height: 80, textAlignVertical:'top'}]} 
              placeholder="e.g. Playing scales for 15 mins"
              multiline
              value={customDesc}
              onChangeText={setCustomDesc}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={{color:'#666'}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={addCustomTask}>
                <Text style={{color:'#fff', fontWeight:'bold'}}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingTop: 30 },
  title: { fontSize: 28, fontWeight: '800', color: '#111' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  
  scrollContent: { padding: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15, marginTop: 10 },
  
  // Grid for Popular Habits
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '30%', 
    aspectRatio: 1, 
    backgroundColor: '#F5F5F5', 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee'
  },
  cardSelected: { backgroundColor: '#6B6BFF', borderColor: '#6B6BFF' },
  cardTitle: { fontSize: 12, fontWeight: '600', marginTop: 8, color: '#333' },

  // List Items
  listItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, backgroundColor: '#F8F9FE', borderRadius: 12, marginBottom: 10,
    borderWidth: 1, borderColor: '#eee'
  },
  listTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  listSub: { fontSize: 12, color: '#666' },

  // Add Button
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: 16, borderStyle: 'dashed', borderWidth: 2, borderColor: '#ccc',
    borderRadius: 12, marginTop: 10
  },
  addBtnText: { color: '#666', fontWeight: '600' },

  // Footer
  footer: {
    padding: 20, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff'
  },
  finishBtn: {
    backgroundColor: '#FFD700', padding: 18, borderRadius: 16, alignItems: 'center'
  },
  finishText: { fontSize: 18, fontWeight: '800', color: '#111' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#ddd' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  cancelBtn: { padding: 15, flex: 1, alignItems: 'center' },
  saveBtn: { backgroundColor: '#6B6BFF', padding: 15, borderRadius: 10, flex: 1, alignItems: 'center' }
});