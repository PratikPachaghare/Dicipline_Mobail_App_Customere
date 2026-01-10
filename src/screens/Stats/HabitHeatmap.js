import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiCall from '../../utils/apiCalls';
import apiEndpoint from '../../utils/endpoint';
import { useFocusEffect } from '@react-navigation/native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SCREEN_WIDTH = Dimensions.get('window').width;
// We calculate the box size based on container padding (approx 32px padding total)
const CONTAINER_PADDING = 32;
const AVAILABLE_WIDTH = SCREEN_WIDTH - CONTAINER_PADDING;
const DAY_SIZE = AVAILABLE_WIDTH / 7;
const BOX_SIZE = DAY_SIZE - 10; // Leave a small gap between boxes

export default function HabitHeatmap() {
  // 1. ALL HOOKS FIRST
  const [showAll, setShowAll] = useState(false);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchHeatmapData();
    }, []),
  );

  const fetchHeatmapData = async () => {
    try {
      const response = await apiCall(
        'GET',
        apiEndpoint?.heatmap?.activity_heatmap,
      );
      if (response?.success && response?.data) {
        setHeatmapData(transformBackendData(response.data));
      }
    } catch (error) {
      console.error('Heatmap Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const transformBackendData = backendList => {
    const dataMap = {};
    backendList.forEach(item => {
      if (!item.date) return;
      try {
        const dateKey = new Date(item.date).toISOString().split('T')[0];
        dataMap[dateKey] = {
          level: item.level,
          count: item.completedTasks || 0,
        };
      } catch (e) {
        console.warn('Invalid date:', item.date);
      }
    });

    const monthsResult = [];
    const today = new Date();

    for (let i = 0; i < 6; i++) {
      const currentLoopDate = new Date(
        today.getFullYear(),
        today.getMonth() - i,
        1,
      );
      const year = currentLoopDate.getFullYear();
      const monthIndex = currentLoopDate.getMonth();
      const monthName = currentLoopDate.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

      // 0 = Sunday, 1 = Monday, ...
      const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();

      const dailyLevels = [];

      // Add "Empty" placeholders to shift the 1st day to the correct column
      for (let pad = 0; pad < firstDayOfWeek; pad++) {
        dailyLevels.push({ isEmpty: true, id: `pad-${i}-${pad}` });
      }

      // Add actual days
      for (let d = 1; d <= daysInMonth; d++) {
        const dayStr = d.toString().padStart(2, '0');
        const monthStr = (monthIndex + 1).toString().padStart(2, '0');
        const dateKey = `${year}-${monthStr}-${dayStr}`;
        const dayData = dataMap[dateKey] || { level: 0, count: 0 };

        dailyLevels.push({
          day: d,
          fullDate: dateKey,
          level: dayData.level,
          count: dayData.count,
          isEmpty: false,
          id: dateKey,
        });
      }
      monthsResult.push({ name: monthName, data: dailyLevels });
    }
    return monthsResult;
  };

  const visibleMonths = showAll ? heatmapData : heatmapData.slice(0, 3);

  const getColor = level => {
    if (level >= 4) return '#196127';
    switch (level) {
      case 3:
        return '#216e39';
      case 2:
        return '#30a14e';
      case 1:
        return '#9be9a8';
      default:
        return '#ebedf0';
    }
  };

  const handleDayPress = dayInfo => {
    if (dayInfo.isEmpty) return;
    if (selectedDay && selectedDay.fullDate === dayInfo.fullDate) {
      setSelectedDay(null);
    } else {
      setSelectedDay(dayInfo);
    }
  };

  if (loading) {
    return (
      <View
        style={[styles.container, { minHeight: 150, justifyContent: 'center' }]}
      >
        <ActivityIndicator size="small" color="#6B6BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Consistency Graph 📅</Text>
      </View>

      {/* FIX: The Week Row now uses the EXACT same column logic as the grid.
         Each Text is inside a view with width '14.28%' (100/7).
      */}
      <View style={styles.row}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <View key={index} style={styles.columnWrapper}>
            <Text style={styles.weekText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.monthsWrapper}>
        {visibleMonths.map((month, mIndex) => (
          <View key={mIndex} style={styles.monthContainer}>
            <Text style={styles.monthLabel}>{month.name}</Text>

            <View style={styles.row}>
              {month.data.map((dayItem, dIndex) => {
                // Check if selectedDay exists AND if the date matches
                const isSelected =
                  selectedDay && selectedDay.fullDate === dayItem.fullDate;

                return (
                  <View
                    key={dayItem.id || dIndex}
                    style={[
                      styles.columnWrapper,
                      { zIndex: isSelected ? 999 : 1 },
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleDayPress(dayItem)}
                      style={[
                        styles.box,
                        // If empty, transparent. If valid, color.
                        dayItem.isEmpty
                          ? { backgroundColor: 'transparent' }
                          : { backgroundColor: getColor(dayItem.level) },
                        isSelected && styles.selectedBox,
                      ]}
                      disabled={dayItem.isEmpty}
                    />

                    {isSelected && (
                      <View style={styles.tooltip}>
                        <Text style={styles.tooltipDate}>
                          {dayItem.fullDate}
                        </Text>
                        <Text style={styles.tooltipCount}>
                          {dayItem.count} Tasks
                        </Text>
                        <View style={styles.tooltipArrow} />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.seeMoreBtn}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setShowAll(!showAll);
        }}
      >
        <Text style={styles.seeMoreText}>
          {showAll ? 'Show Less' : 'See Older Months'}
        </Text>
        <Ionicons
          name={showAll ? 'chevron-up' : 'chevron-down'}
          size={16}
          color="#6B6BFF"
        />
      </TouchableOpacity>

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: { fontSize: 16, fontWeight: '700', color: '#111' },

  // SHARED ROW STYLE
  // This ensures both the Header and the Grid behave exactly the same
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },

  // COLUMN WRAPPER
  // 100% / 7 = ~14.28%. This ensures exactly 7 items per row.
  columnWrapper: {
    width: '14.28%',
    alignItems: 'center',
    marginBottom: 6,
  },

  weekText: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
    marginBottom: 4,
  },

  monthsWrapper: { gap: 20 },
  monthContainer: { width: '100%' },

  monthLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    marginLeft: 2,
  },

  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: 4,
  },
  selectedBox: {
    borderWidth: 2,
    borderColor: '#333',
  },

  // Tooltip
  tooltip: {
    position: 'absolute',
    bottom: BOX_SIZE + 10, // Position above the box based on box height
    backgroundColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  tooltipDate: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  tooltipCount: { color: '#ddd', fontSize: 10 },
  tooltipArrow: {
    position: 'absolute',
    bottom: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#333',
  },

  seeMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  seeMoreText: {
    color: '#6B6BFF',
    fontWeight: '600',
    fontSize: 13,
    marginRight: 4,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 5,
    gap: 4,
  },
  legendBox: { width: 12, height: 12, borderRadius: 3 },
  legendText: { fontSize: 12, color: '#666', marginHorizontal: 4 },
});
