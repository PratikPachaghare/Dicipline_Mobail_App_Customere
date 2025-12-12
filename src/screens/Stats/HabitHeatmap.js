// src/components/Stats/HabitHeatmap.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HabitHeatmap() {
  const [showAll, setShowAll] = useState(false);

  // Helper for random data
  const generateMonthData = (daysCount) => {
    return Array.from({ length: daysCount }).map(() => {
      const rand = Math.random();
      if (rand > 0.8) return 3; 
      if (rand > 0.6) return 2; 
      if (rand > 0.4) return 1; 
      return 0; 
    });
  };

  // 1. DATA: 6 Months (Current -> Oldest)
  const allMonthsData = [
    { name: 'December 2025', data: generateMonthData(31) }, // 1. Visible
    { name: 'November 2025', data: generateMonthData(30) }, // 2. Visible
    { name: 'October 2025', data: generateMonthData(31) },  // 3. Visible
    { name: 'September 2025', data: generateMonthData(30) }, // 4. Hidden
    { name: 'August 2025', data: generateMonthData(31) },    // 5. Hidden
    { name: 'July 2025', data: generateMonthData(31) },      // 6. Hidden
  ];

  // 2. LOGIC: Default show 3, Expand to show all
  const visibleMonths = showAll ? allMonthsData : allMonthsData.slice(0, 3);

  const toggleShowMore = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowAll(!showAll);
  };

  const getColor = (level) => {
    switch (level) {
      case 3: return '#216e39'; 
      case 2: return '#30a14e'; 
      case 1: return '#9be9a8'; 
      default: return '#ebedf0'; 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Consistency Graph 📅</Text>
      </View>
      
      {/* 3. Render List */}
      <View style={styles.monthsWrapper}>
        {visibleMonths.map((month, mIndex) => (
          <View key={mIndex} style={styles.monthContainer}>
            <Text style={styles.monthLabel}>{month.name}</Text>
            <View style={styles.monthGrid}>
              {month.data.map((level, dIndex) => (
                <View 
                  key={dIndex} 
                  style={[styles.box, { backgroundColor: getColor(level) }]} 
                />
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* 4. Button */}
      <TouchableOpacity style={styles.seeMoreBtn} onPress={toggleShowMore}>
        <Text style={styles.seeMoreText}>
          {showAll ? 'Show Less' : 'See Older Months'}
        </Text>
        <Ionicons 
          name={showAll ? 'chevron-up' : 'chevron-down'} 
          size={16} 
          color="#6B6BFF" 
        />
      </TouchableOpacity>

      {/* Legend (Always visible at bottom) */}
      <View style={styles.legend}>
        <Text style={styles.legendText}>Less</Text>
        <View style={[styles.legendBox, { backgroundColor: '#ebedf0' }]} />
        <View style={[styles.legendBox, { backgroundColor: '#9be9a8' }]} />
        <View style={[styles.legendBox, { backgroundColor: '#30a14e' }]} />
        <View style={[styles.legendBox, { backgroundColor: '#216e39' }]} />
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  title: { fontSize: 16, fontWeight: '700', color: '#111' },
  
  monthsWrapper: { gap: 24 }, // Space between months
  monthContainer: { width: '100%' },
  
  monthLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555',
    marginBottom: 8,
    textAlign: 'left',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'flex-start',
  },
  box: { width: 16, height: 16, borderRadius: 3,margin:1 },

  seeMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5'
  },
  seeMoreText: {
    color: '#6B6BFF',
    fontWeight: '600',
    fontSize: 13,
    marginRight: 4
  },

  legend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 5, gap: 4 },
  legendBox: { width: 12, height: 12, borderRadius: 3 },
  legendText: { fontSize: 12, color: '#666', marginHorizontal: 4 }
});