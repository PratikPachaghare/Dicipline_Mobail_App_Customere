import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MenuOption = ({ icon, title, isDestructive, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <View style={[styles.menuIconBox, isDestructive && { backgroundColor: '#FFEBEE' }]}>
        <Ionicons
          name={icon}
          size={20}
          color={isDestructive ? 'red' : '#333'}
        />
      </View>
      <Text style={[styles.menuText, isDestructive && { color: 'red' }]}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </TouchableOpacity>
);

export default function AccountSettings({ onLogout,userID }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.menuContainer}>
        <MenuOption icon="notifications-outline" title="Notifications" />
        <MenuOption icon="shield-checkmark-outline" title="Privacy & Security" />
        <MenuOption icon="help-circle-outline" title="Help & Support" />
        <MenuOption icon="log-out-outline" title="Log Out" isDestructive onPress={() => onLogout(userID)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 12 },
  menuContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F5F5FA', alignItems: 'center', justifyContent: 'center' },
  menuText: { fontSize: 15, fontWeight: '500', color: '#333' },
});