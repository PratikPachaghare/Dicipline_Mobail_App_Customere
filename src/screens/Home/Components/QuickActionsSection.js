import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function QuickActionsSection({ 
  completedStreaks, 
  incompleteStreaks, 
  navigation, 
  onAddPress 
}) {
  return (
    <View>
      {/* --- COMPLETED STREAKS --- */}
      {completedStreaks.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Completed Today ✅</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {completedStreaks.map(action => (
              <TouchableOpacity
                key={action._id}
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
      <View>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {incompleteStreaks.map(action => (
            <TouchableOpacity
              key={action._id}
              style={styles.quickCard}
              onPress={() => navigation.navigate('Capture', { taskId: action._id, streakType: action.title })}
            >
              <Ionicons name={action.icon || 'star'} size={32} color="#333" />
              <Text style={styles.quickTitle}>{action.title}</Text>
              <Text style={styles.quickSub}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}

          {/* ADD BUTTON */}
          <TouchableOpacity style={[styles.quickCard, styles.addCard]} onPress={onAddPress}>
            <Ionicons name="add-circle-outline" size={40} color="#6B6BFF" />
            <Text style={[styles.quickTitle, { color: '#6B6BFF' }]}>Add Task</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, marginTop: 10 },
  quickCard: {
    width: 130, backgroundColor: '#fff', marginRight: 12, marginBottom: 10,
    padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#EFEFF3',
  },
  addCard: {
    borderStyle: 'dashed', borderColor: '#6B6BFF', backgroundColor: '#F8F9FE',
    alignItems: 'center', justifyContent: 'center',
  },
  quickTitle: { fontSize: 15, fontWeight: '700', marginTop: 10 },
  quickSub: { fontSize: 12, color: '#666', marginTop: 4 },
});