import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import apiCall from '../../../utils/apiCalls'; 
import apiEndpoint from '../../../utils/endpoint';
import { useSelector } from 'react-redux';

const ICONS = ['star', 'fitness', 'book', 'water', 'code-slash', 'bed', 'cafe'];

export default function SettingTask({ navigation }) {
  const quickActions = useSelector(state => state.streaks.actions) || [];
  const [tasks, setTasks] = useState(quickActions || []); 
  const [loading, setLoading] = useState(false);
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('star');
  const [isCustomTask, setIsCustomTask] = useState(true); 

  // --- ⏰ TIME PICKER STATE ---
  const [taskTime, setTaskTime] = useState(new Date()); 
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeString, setTimeString] = useState(''); 

  useEffect(() => {
    // loadTasks(); 
  }, []);

  // --- 1. SEPARATE FUNCTION: ADD NEW TASK ---
  const addNewTask = async (taskData) => {
    setLoading(true);
    try {
      // Force isCustom to true for new tasks created here
      const payload = { ...taskData, isCustom: true };
      
      const response = await apiCall('POST', apiEndpoint?.task?.addTaskInList, payload);

      if (response && response.success) {
        const createdTask = response.data || response.task; 
        if (createdTask) {
          setTasks(prev => [...prev, createdTask]); 
          Alert.alert('Success', 'Task added successfully');
          setModalVisible(false);
        }
      } else {
        Alert.alert('Error', response?.message || 'Failed to add task');
      }
    } catch (error) {
      console.error("Add Error:", error);
      Alert.alert('Error', 'Something went wrong adding the task.');
    } finally {
      setLoading(false);
    }
  };

  // --- 2. SEPARATE FUNCTION: UPDATE EXISTING TASK ---
  const updateExistingTask = async (id, taskData) => {
    setLoading(true);
    try {
      // Use the specific endpoint for updating
      const response = await apiCall('PATCH', apiEndpoint?.task?.updateTaskInList(id), taskData);

      if (response && response.success) {
        // Update local state to reflect changes immediately
        setTasks(prev => prev.map(t => t._id === id ? { ...t, ...taskData } : t));
        Alert.alert('Success', 'Task updated successfully');
        setModalVisible(false);
      } else {
        Alert.alert('Error', response?.message || 'Failed to update task');
      }
    } catch (error) {
      console.error("Update Error:", error);
      Alert.alert('Error', 'Something went wrong updating the task.');
    } finally {
      setLoading(false);
    }
  };

  // --- MAIN SAVE HANDLER ---
  const handleSave = () => {
    if (!title.trim()) return Alert.alert('Error', 'Title is required');

    // Prepare the data object
    const taskData = { 
        title, 
        time: timeString, 
        description: desc, 
        icon: selectedIcon, 
        isCustom: isCustomTask 
    };

    // Decide which function to call
    if (isEditing && selectedId) {
        updateExistingTask(selectedId, taskData);
    } else {
        addNewTask(taskData);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Task', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: async () => {
          setLoading(true);
          try {
             const response = await apiCall('DELETE', apiEndpoint?.task?.deleteTask(id));
             if (response && response.success) {
                setTasks(prev => prev.filter(t => t._id !== id));
             }
          } catch(e) {
             Alert.alert("Error", "Could not delete task");
          } finally {
             setLoading(false);
          }
        }
      }
    ]);
  };

  // --- ⏰ TIME HANDLERS ---
  const onTimeChange = (event, selectedDate) => {
    setShowTimePicker(Platform.OS === 'ios'); 
    if (selectedDate) {
      setTaskTime(selectedDate);
      formatAndSetTime(selectedDate);
      if (Platform.OS === 'android') setShowTimePicker(false); 
    }
  };

  const formatAndSetTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const formatted = date.toLocaleTimeString('en-US', options);
    setTimeString(formatted);
  };

  // --- UI HANDLERS ---
  const handleAddNew = () => {
    setIsEditing(false);
    resetForm();
    setIsCustomTask(true);
    
    const now = new Date();
    setTaskTime(now);
    setTimeString(''); 
    setModalVisible(true);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setSelectedId(item._id);
    
    setTitle(item.title);
    setDesc(item.description || '');
    setSelectedIcon(item.icon || 'star');
    setIsCustomTask(item.isCustom !== false); 
    
    if (item.time) {
        setTimeString(item.time);
        const now = new Date();
        const [timePart, modifier] = item.time.split(' ');
        if(timePart && modifier) {
            let [hours, minutes] = timePart.split(':');
            if (hours === '12') hours = '00';
            if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
            now.setHours(hours, minutes);
            setTaskTime(now);
        }
    } else {
        setTimeString('');
        setTaskTime(new Date());
    }
    
    setModalVisible(true);
  };

  const resetForm = () => {
    setTitle('');
    setTimeString('');
    setDesc('');
    setSelectedIcon('star');
  };

  // --- RENDER ---
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <Ionicons name={item.icon || 'star'} size={24} color="#6B6BFF" />
      </View>
      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskTime}>
            {item.time ? item.time : 'No time set'} 
            {item.description ? ` • ${item.description}` : ''}
        </Text>
        {!item.isCustom && <Text style={styles.systemTag}>System Task</Text>}
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionBtn}>
          <Ionicons name="pencil" size={20} color="#FFA500" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.actionBtn}>
        <Ionicons name="trash" size={20} color="#FF4500" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 5}}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Settings</Text>
        <TouchableOpacity onPress={handleAddNew} style={{padding: 5}}>
          <Ionicons name="add" size={30} color="#6B6BFF" />
        </TouchableOpacity>
      </View>

      {loading && tasks.length === 0 ? (
        <ActivityIndicator size="large" color="#6B6BFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>{isEditing ? 'Edit Task' : 'New Task'}</Text>

            {/* Title */}
            <Text style={styles.label}>Task Name {(!isCustomTask) && '(Read-Only)'}</Text>
            <TextInput
              style={[styles.input, !isCustomTask && styles.disabledInput]}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Meditate"
              editable={isCustomTask} 
            />

            {/* ⏰ TIME PICKER INPUT */}
            <Text style={styles.label}>Notification Time</Text>
            <TouchableOpacity 
                style={styles.timeInputBtn} 
                onPress={() => setShowTimePicker(true)}
            >
                <Text style={[styles.timeText, !timeString && {color: '#999'}]}>
                    {timeString || "Select Time"}
                </Text>
                <Ionicons name="time-outline" size={20} color="#666" />
            </TouchableOpacity>

            {/* The Actual Picker */}
            {showTimePicker && (
                <DateTimePicker
                    value={taskTime}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    is24Hour={false}
                    onChange={onTimeChange}
                />
            )}
            
            {showTimePicker && Platform.OS === 'ios' && (
                <TouchableOpacity 
                    style={styles.iosPickerDone} 
                    onPress={() => setShowTimePicker(false)}
                >
                    <Text style={{color: '#6B6BFF', fontWeight:'bold'}}>Done</Text>
                </TouchableOpacity>
            )}

            {/* Description */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, !isCustomTask && styles.disabledInput]}
              value={desc}
              onChangeText={setDesc}
              placeholder="Short description..."
              editable={isCustomTask}
            />

            {/* Icon Picker */}
            <Text style={styles.label}>Choose Icon</Text>
            <View style={[styles.iconRow, !isCustomTask && {opacity: 0.5}]}>
              {ICONS.map(icon => (
                <TouchableOpacity
                  key={icon}
                  disabled={!isCustomTask}
                  style={[styles.iconSelect, selectedIcon === icon && styles.iconActive]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Ionicons name={icon} size={24} color={selectedIcon === icon ? '#fff' : '#555'} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={{ color: '#555' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveBtn} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>{isEditing ? 'Update' : 'Save'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  header: {
    flexDirection: 'row', marginTop: 42, alignItems: 'center', justifyContent: 'space-between',
    padding: 16, backgroundColor: '#fff', elevation: 2, height: 60
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color:'#111' },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2
  },
  iconBox: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF0FF',
    alignItems: 'center', justifyContent: 'center'
  },
  taskTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  taskTime: { fontSize: 13, color: '#888', marginTop: 2 },
  systemTag: { fontSize: 10, color: '#666', backgroundColor: '#eee', alignSelf: 'flex-start', paddingHorizontal:6, borderRadius:4, marginTop:4},
  actionRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { padding: 5 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  modalHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color:'#111' },
  label: { fontSize: 14, color: '#666', marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: '#F5F5F5', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', color:'#111' },
  disabledInput: { backgroundColor: '#E0E0E0', color: '#888', borderColor:'#ccc' },
  
  timeInputBtn: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      backgroundColor: '#F5F5F5', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd'
  },
  timeText: { fontSize: 16, color: '#333' },
  iosPickerDone: { alignItems: 'flex-end', padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8, marginTop: 5 },

  iconRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, flexWrap:'wrap', gap: 5 },
  iconSelect: { padding: 10, borderRadius: 50, backgroundColor: '#eee' },
  iconActive: { backgroundColor: '#6B6BFF' },
  
  btnRow: { flexDirection: 'row', marginTop: 25, gap: 10 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#eee', alignItems: 'center' },
  saveBtn: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#6B6BFF', alignItems: 'center' },
});