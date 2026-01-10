import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';

export default function AddTaskModal({ visible, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [sub, setSub] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }
    onAdd(title, sub);
    setTitle('');
    setSub('');
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Add Quick Action</Text>
          
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Read Book"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Subtitle (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 10 Pages"
            value={sub}
            onChangeText={setSub}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#eee' }]} onPress={onClose}>
              <Text style={{ color: '#333' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#6B6BFF' }]} onPress={handleSubmit}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  modalHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  label: { fontSize: 14, color: '#666', marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: '#F5F5F5', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  modalButtons: { flexDirection: 'row', marginTop: 20, gap: 10 },
  modalBtn: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
});