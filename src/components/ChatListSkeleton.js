import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const ChatListSkeleton = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Blinking Animation Loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // 8 Nakli Chat Items render karein
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((key) => (
        <View key={key} style={styles.skeletonItem}>
          {/* Avatar Circle */}
          <Animated.View style={[styles.skeletonAvatar, { opacity }]} />
          
          {/* Text Lines */}
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Animated.View style={[styles.skeletonLine, { width: '60%', height: 15, marginBottom: 8, opacity }]} />
            <Animated.View style={[styles.skeletonLine, { width: '80%', height: 12, opacity }]} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  skeletonAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E1E9EE', // Light Grey Blue
  },
  skeletonLine: {
    borderRadius: 4,
    backgroundColor: '#E1E9EE',
  },
});

export default ChatListSkeleton;