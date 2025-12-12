import React from 'react';
import { StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Navigation Imports
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screen Imports
import HomeScreen from '../screens/Home/HomeScreen';
import TaskListScreen from '../screens/Tasks/TaskListScreen';
import AddTaskScreen from '../screens/Tasks/AddTaskScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import StatsScreen from '../screens/Stats/StatsOverview';
import CaptureScreen from '../screens/CreateSteck/CaptureScreen';
import ShareStreakScreen from '../screens/SocialMedia/ShareStreakScreen';
import FriendsScreen from "../screens/Firend/FirendScreen";
import ChatScreen from "../screens/Firend/ChatScreen";
import LeaderboardScreen from "../screens/Leaderboard/LeaderboardScreen"
import CommitmentScreen from "../screens/HardComiiteSection/CommitmentScreen"

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 1. Create the Bottom Tabs (Home, Tasks, Profile)
// 1. Create the Bottom Tabs
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#333',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: styles.bottomNav,
        // FIX IS HERE:
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = 'home';
          } 
          // Add this block for your new Chat tab
          else if (route.name === 'Chat') {
            iconName = 'chatbubble-ellipses'; // Or 'chatbubbles', 'people'
          } 
          else if (route.name === 'ProfileTab') {
            iconName = 'person';
          }

          // Return the icon component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Home' }} 
      />
      
      {/* This is your new tab */}
      <Tab.Screen 
        name="Chat" 
        component={FriendsScreen} 
        options={{ tabBarLabel: 'Friend' }} 
      />
      
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Profile' }} 
      />
    </Tab.Navigator>
  );
}

// 2. Wrap everything in the Main Stack
export default function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      {/* The first screen is the Tabs (which contains Home, Tasks, Profile) */}
      <Stack.Screen name="MainTabs" component={BottomTabs} />

      {/* Other screens that sit ON TOP of the tabs (Full Screen) */}
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="Commitment" component={CommitmentScreen} />
      <Stack.Screen name="Friends" component={FriendsScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="Capture" component={CaptureScreen} />
      <Stack.Screen name="ShareStreak" component={ShareStreakScreen} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} />
      <Stack.Screen name="Stats" component={StatsScreen} />

    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    height: 68,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    paddingBottom: 10, // Added padding for better look on modern phones
    paddingTop: 5,
  },
});