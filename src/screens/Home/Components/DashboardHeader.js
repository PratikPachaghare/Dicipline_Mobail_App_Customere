import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function DashboardHeader() {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.iconBtn}>
        <Ionicons name="menu-outline" size={26} color="#111" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Dashboard</Text>
      <TouchableOpacity style={styles.iconBtn}>
        <Ionicons name="person-circle-outline" size={30} color="#111" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 85,
    paddingTop: 30,
    paddingHorizontal: 16,
    backgroundColor: '#FFE55B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  iconBtn: { padding: 5 },
});