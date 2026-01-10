import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Modal,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import { setAllActions } from '../../Store/steackSlice.js'; 
import apiCall from "../../utils/apiCalls";
import apiEndpoint from "../../utils/endpoint";

export default function SetupRoutineScreen({ navigation }) {
  const dispatch = useDispatch();
  
  // 1. Popular Habits (Pre-filled with time and isCustom: false)
  const popularHabits = [
    { id: 'gym', title: 'Gym', description: 'Start workout', icon: 'barbell-outline', time: '06:00 AM', isCustom: false },
    { id: 'yoga', title: 'Yoga', description: 'Morning Stretch', icon: 'body-outline', time: '07:00 AM', isCustom: false },
    { id: 'study', title: 'Study', description: 'Focus session', icon: 'create-outline', time: '08:00 PM', isCustom: false },
    { id: 'meditation', title: 'Meditation', description: 'Relax & focus', icon: 'leaf-outline', time: '06:30 AM', isCustom: false },
    { id: 'water', title: 'Drink Water', description: '3L Goal', icon: 'water-outline', time: '09:00 AM', isCustom: false },
    { id: 'read', title: 'Reading', description: '20 Pages', icon: 'book-outline', time: '09:30 PM', isCustom: false },
  ];

  // 2. State
  const [selectedTasks, setSelectedTasks] = useState([]);
  
  // Modal State (Custom Task)
  const [modalVisible, setModalVisible] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customTime, setCustomTime] = useState(new Date());

  // Time Picker State (For Editing)
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('add'); // 'add' or 'edit'
  const [editingTaskId, setEditingTaskId] = useState(null);

  // --- HELPER: Format Time ---
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // --- LOGIC: Toggle Selection (Uses existing fields in array) ---
  const toggleHabit = (habit) => {
    const exists = selectedTasks.find(t => t.id === habit.id);
    if (exists) {
      setSelectedTasks(selectedTasks.filter(t => t.id !== habit.id));
    } else {
      // Simply add the habit as it is defined in the array
      setSelectedTasks([...selectedTasks, { ...habit, completed: false }]);
    }
  };

  // --- LOGIC: Add Custom Task (Sets isCustom: true) ---
  const addCustomTask = () => {
    if (!customName.trim()) {
      Alert.alert("Missing Name", "Please enter a task name.");
      return;
    }
    
    const wordCount = customDesc.trim().split(/\s+/).length;
    if (wordCount > 10) {
      Alert.alert("Too Long", "Description must be 10 words or less.");
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: customName,
      description: customDesc || 'Custom Goal',
      icon: 'star-outline',
      isCustom: true,      // Custom tasks are true
      time: formatTime(customTime),
      completed: false
    };

    setSelectedTasks([...selectedTasks, newTask]);
    setModalVisible(false);
    setCustomName('');
    setCustomDesc('');
    setCustomTime(new Date());
  };

  // --- LOGIC: Handle Time Change (Edit Time) ---
  const onTimeChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowPicker(false);
    
    if (selectedDate) {
      if (pickerMode === 'add') {
        setCustomTime(selectedDate);
      } else if (pickerMode === 'edit' && editingTaskId) {
        // Edit the time for the specific task in the list
        const formatted = formatTime(selectedDate);
        setSelectedTasks(prev => prev.map(t => 
            t.id === editingTaskId ? { ...t, time: formatted } : t
        ));
      }
    }
  };

  const openEditTime = (task) => {
    setEditingTaskId(task.id);
    setPickerMode('edit');
    setShowPicker(true);
  };

  // --- LOGIC: Save & Continue ---
  const handleFinish = async () => {
    if (selectedTasks.length === 0) {
      Alert.alert("Empty Routine", "Please select at least one habit to start.");
      return;
    }

    try {
      const tasks = selectedTasks.map(({ title, description, icon, time, isCustom }) => ({
        title,
        description,
        icon,
        time,
        isCustom
      }));

      const response = await apiCall(
        "POST",
        apiEndpoint?.task?.createList, 
        { tasks }
      );

      console.log("API Response:", response);

      if (response && response.success) {
        navigation.replace("HomeStack");
      } else {
        Alert.alert("Error", response?.message || "Failed to create list");
      }

    } catch (error) {
      console.error("Setup Error:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Build Your Routine 🛠️</Text>
        <Text style={styles.description}>Select at least 1 habit to track daily.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Popular Habits */}
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

        {/* Your Routine List */}
        <Text style={styles.sectionTitle}>Your Daily Plan ({selectedTasks.length})</Text>
        {selectedTasks.map((task) => (
          <View key={task.id} style={styles.listItem}>
            <View style={{flexDirection:'row', alignItems:'center', gap:12, flex: 1}}>
              <Ionicons name={task.icon} size={24} color="#6B6BFF" />
              <View style={{flex: 1}}>
                <Text style={styles.listTitle}>{task.title}</Text>
                <View style={{flexDirection:'row', alignItems:'center', gap: 5}}>
                    <Text style={styles.listSub}>{task.description}</Text>
                    <Text style={styles.tag}>{task.isCustom ? 'Custom' : 'System'}</Text>
                </View>
              </View>
            </View>

            {/* Time Edit Button */}
            <TouchableOpacity 
                style={styles.timeBadge} 
                onPress={() => openEditTime(task)}
            >
                <Ionicons name="time-outline" size={14} color="#555" />
                <Text style={styles.timeText}>{task.time}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => toggleHabit(task)} style={{marginLeft: 10}}>
              <Ionicons name="trash-outline" size={20} color="#ff4444" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Custom Button */}
        <TouchableOpacity style={styles.addBtn} onPress={() => {
            setPickerMode('add'); 
            setCustomTime(new Date());
            setModalVisible(true);
        }}>
          <Ionicons name="add-circle" size={24} color="#6B6BFF" />
          <Text style={styles.addBtnText}>Add Custom Task</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
          <Text style={styles.finishText}>Start My Journey 🚀</Text>
        </TouchableOpacity>
      </View>

      {/* Add Custom Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
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

            <Text style={styles.label}>Description</Text>
            <TextInput 
              style={[styles.input, {height: 60, textAlignVertical:'top'}]} 
              placeholder="e.g. Playing scales"
              multiline
              value={customDesc}
              onChangeText={setCustomDesc}
            />

            <Text style={styles.label}>Notification Time</Text>
            <TouchableOpacity 
                style={styles.input} 
                onPress={() => { setPickerMode('add'); setShowPicker(true); }}
            >
                <Text>{formatTime(customTime)}</Text>
            </TouchableOpacity>

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

      {/* Shared Time Picker */}
      {showPicker && (
        <DateTimePicker
            value={pickerMode === 'add' ? customTime : new Date()} 
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour={false}
            onChange={onTimeChange}
        />
      )}
      
      {showPicker && Platform.OS === 'ios' && (
         <View style={styles.iosPickerOverlay}>
             <View style={styles.iosPickerContent}>
                <TouchableOpacity onPress={() => setShowPicker(false)} style={{alignItems:'flex-end', padding:10}}>
                    <Text style={{color:'#6B6BFF', fontWeight:'bold', fontSize:16}}>Done</Text>
                </TouchableOpacity>
             </View>
         </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingTop: 30 },
  title: { fontSize: 28, fontWeight: '800', color: '#111' },
  description: { fontSize: 16, color: '#666', marginTop: 5 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15, marginTop: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '30%', aspectRatio: 1, backgroundColor: '#F5F5F5', borderRadius: 16, 
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#eee'
  },
  cardSelected: { backgroundColor: '#6B6BFF', borderColor: '#6B6BFF' },
  cardTitle: { fontSize: 12, fontWeight: '600', marginTop: 8, color: '#333' },
  listItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 12, backgroundColor: '#F8F9FE', borderRadius: 12, marginBottom: 10,
    borderWidth: 1, borderColor: '#eee'
  },
  listTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  listSub: { fontSize: 12, color: '#666' },
  tag: { fontSize: 10, color: '#999', backgroundColor: '#eef', paddingHorizontal: 4, borderRadius: 4},
  timeBadge: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6,
      borderRadius: 20, borderWidth: 1, borderColor: '#ddd'
  },
  timeText: { fontSize: 12, fontWeight: '600', color: '#555' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: 16, borderStyle: 'dashed', borderWidth: 2, borderColor: '#ccc',
    borderRadius: 12, marginTop: 10
  },
  addBtnText: { color: '#666', fontWeight: '600' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' },
  finishBtn: { backgroundColor: '#FFD700', padding: 18, borderRadius: 16, alignItems: 'center' },
  finishText: { fontSize: 18, fontWeight: '800', color: '#111' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#ddd' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  cancelBtn: { padding: 15, flex: 1, alignItems: 'center' },
  saveBtn: { backgroundColor: '#6B6BFF', padding: 15, borderRadius: 10, flex: 1, alignItems: 'center' },
  iosPickerOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.3)'},
  iosPickerContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20 }
});