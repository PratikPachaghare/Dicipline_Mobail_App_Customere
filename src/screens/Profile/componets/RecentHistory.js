import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function RecentHistory({ data }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent History</Text>
      {data.map((item) => (
        <View key={item.id} style={styles.historyItem}>
          <View style={styles.historyLeft}>
            <View
              style={[
                styles.historyDot,
                { backgroundColor: item.status === 'completed' ? '#4CD964' : '#ff4444' },
              ]}
            >
              <Ionicons
                name={item.status === 'completed' ? 'checkmark' : 'close'}
                size={14}
                color="#fff"
              />
            </View>
            <View>
              <Text style={styles.historyAction}>{item.action}</Text>
              <Text style={styles.historyDate}>{item.date}</Text>
            </View>
          </View>
          <Text
            style={[
              styles.historyStatus,
              { color: item.status === 'completed' ? '#4CD964' : '#ff4444' },
            ]}
          >
            {item.status === 'completed' ? 'Done' : 'Missed'}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 12 },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#f0f0f0' },
  historyLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  historyDot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  historyAction: { fontSize: 15, fontWeight: '600', color: '#333' },
  historyDate: { fontSize: 12, color: '#999' },
  historyStatus: { fontSize: 13, fontWeight: '600' },
});