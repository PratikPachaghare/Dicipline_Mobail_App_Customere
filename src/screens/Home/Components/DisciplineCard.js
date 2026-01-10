import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function DisciplineCard({ disciplineStreak, navigation }) {
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2017/2017997.png' }}
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
              onPress={() => navigation.navigate('ShareStreak', {
                streakCount: disciplineStreak,
                streakType: 'Daily Goals',
              })}
            >
              <Text style={[styles.streakBtnText, { color: '#333' }]}>Share 🚀</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 18, elevation: 2 },
  streakIcon: { width: 70, height: 70 },
  streakLabelLarge: { fontSize: 16, fontWeight: '700' },
  streakDays: { fontSize: 24, fontWeight: '800', marginVertical: 8 },
  streakBtn: { backgroundColor: '#6B6BFF', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  streakBtnText: { color: '#fff', fontWeight: '700' },
});