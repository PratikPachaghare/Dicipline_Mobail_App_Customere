import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
  Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CommitmentScreen({ navigation }) {
  const [amount, setAmount] = useState('50'); // Default ₹50
  const [upiId, setUpiId] = useState('');
  const [isLinked, setIsLinked] = useState(false);

  const handleLink = () => {
    if (!upiId.includes('@')) {
      Alert.alert("Invalid UPI ID", "Please enter a valid UPI ID (e.g., name@okaxis)");
      return;
    }
    // Simulate API Call to verify VPA
    Alert.alert("Success", "UPI ID Verified. Hard Mode is ready to activate.");
    setIsLinked(true);
  };

  const activateHardMode = () => {
    Alert.alert(
      "⚠️ Activate Hard Mode?",
      `If you miss a task, ₹${amount} will be deducted from your account. This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "I Accept the Risk", 
          style: 'destructive',
          onPress: () => {
             // Here you would save this state to Redux/Backend
             navigation.goBack();
             Alert.alert("Hard Mode ON 🔥", "Don't miss a day!");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Dark Header for "Serious" feel */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hard Diciplin Mode 💀</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Hero Image / Icon */}
        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="alert-circle" size={50} color="#FF4500" />
          </View>
          <Text style={styles.heroTitle}>Put Your Money Where Your Mouth Is.</Text>
          <Text style={styles.heroSub}>
            Loss aversion is the strongest motivator. If you miss a task, you pay the price.
          </Text>
        </View>

        {/* 1. Set Amount */}
        <View style={styles.card}>
          <Text style={styles.label}>PENALTY AMOUNT (₹)</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currency}>₹</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
          <Text style={styles.helperText}>Recommended: ₹50 - ₹100 per missed task</Text>
        </View>

        {/* 2. Link UPI */}
        <View style={styles.card}>
          <Text style={styles.label}>LINK UPI ACCOUNT</Text>
          
          {!isLinked ? (
            <View>
              <TextInput
                style={styles.input}
                placeholder="e.g. 9876543210@paytm"
                placeholderTextColor="#666"
                value={upiId}
                onChangeText={setUpiId}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.verifyBtn} onPress={handleLink}>
                <Text style={styles.verifyText}>Verify & Link</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.linkedBox}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                 <Ionicons name="checkmark-circle" size={24} color="#4CD964" />
                 <Text style={styles.linkedText}>{upiId}</Text>
              </View>
              <TouchableOpacity onPress={() => setIsLinked(false)}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 3. The Big Button */}
        <View style={styles.footer}>
          <Text style={styles.disclaimer}>
            By activating, you agree to the <Text style={{color:'#4CD964'}}>Terms of Commitment</Text>. Money deducted goes to charity.
          </Text>
          
          <TouchableOpacity 
            style={[styles.activateBtn, !isLinked && {opacity: 0.5}]} 
            disabled={!isLinked}
            onPress={activateHardMode}
          >
            <Text style={styles.activateText}>ACTIVATE HARD MODE</Text>
            <Ionicons name="flash" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' }, // Dark Mode Background
  
  header: {
    flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 10,
    borderBottomWidth: 1, borderBottomColor: '#333',marginTop:40
  },
  backBtn: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: 1 },

  content: { padding: 20 },

  heroSection: { alignItems: 'center', marginBottom: 30 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255, 69, 0, 0.1)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 15,
    borderWidth: 1, borderColor: '#FF4500'
  },
  heroTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
  heroSub: { fontSize: 14, color: '#aaa', textAlign: 'center', lineHeight: 22 },

  card: {
    backgroundColor: '#1E1E1E', borderRadius: 12, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: '#333'
  },
  label: { fontSize: 12, fontWeight: '700', color: '#666', marginBottom: 10, letterSpacing: 1 },
  
  // Amount Styles
  amountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  currency: { fontSize: 40, fontWeight: '300', color: '#fff', marginRight: 5 },
  amountInput: { fontSize: 48, fontWeight: 'bold', color: '#fff', minWidth: 50 },
  helperText: { color: '#555', fontSize: 12, textAlign: 'center' },

  // Input Styles
  input: {
    backgroundColor: '#2C2C2C', borderRadius: 8, padding: 15, color: '#fff', fontSize: 16, marginBottom: 10
  },
  verifyBtn: {
    backgroundColor: '#333', padding: 12, borderRadius: 8, alignItems: 'center',
    borderWidth: 1, borderColor: '#444'
  },
  verifyText: { color: '#fff', fontWeight: '600' },

  // Linked State
  linkedBox: {
    backgroundColor: 'rgba(76, 217, 100, 0.1)', padding: 15, borderRadius: 8,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#4CD964'
  },
  linkedText: { color: '#fff', fontWeight: 'bold', marginLeft: 10 },
  changeText: { color: '#aaa', fontSize: 12, textDecorationLine: 'underline' },

  // Footer
  footer: { marginTop: 10 },
  disclaimer: { color: '#555', fontSize: 11, textAlign: 'center', marginBottom: 15, lineHeight: 16 },
  activateBtn: {
    backgroundColor: '#FF4500', // Scary Red/Orange
    paddingVertical: 18, borderRadius: 12,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    shadowColor: '#FF4500', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10,
  },
  activateText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 }
});