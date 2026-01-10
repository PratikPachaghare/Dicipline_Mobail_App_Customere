// screens/Onboarding/SplashScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/* Yahan apna App Logo lagayein */}
      <Image 
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2921/2921222.png' }} // Replace with your local logo
        style={styles.logo} 
      />
      
      <Text style={styles.title}>Routine App</Text>
      
      {/* Loading Spinner Logo ke niche */}
      <ActivityIndicator size="large" color="#6B6BFF" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Welcome screen wala background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  }
});