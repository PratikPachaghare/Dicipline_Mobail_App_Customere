import React, { useContext, useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import WelcomeScreen from '../screens/Welcome/WelcomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import HomeNavigator from './HomeNavigator';
import SetupRoutineScreen from '../screens/Onboarding/SetupRoutineScreen'; // Removed .js
import SplashScreen from '../screens/Welcome/SplashScreen'; // Removed .js

import { AuthContext } from '../context/AuthContext';
import apiCall from '../utils/apiCalls'; // Removed .jsx
import apiEndpoint from '../utils/endpoint';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);
  
  // We only need loading state for the "User is logged in" check
  const [isCheckingTasks, setIsCheckingTasks] = useState(true);
  
  // Default to HomeStack, change only if logic dictates otherwise
  const [userInitialRoute, setUserInitialRoute] = useState('HomeStack');

  useEffect(() => {
    const decideUserRoute = async () => {
      // If no user, we don't need to check tasks. Stop loading immediately.
      if (!user) {
        setIsCheckingTasks(false);
        return;
      }

      // User exists, start checking
      setIsCheckingTasks(true);
      try {
        const response = await apiCall('GET', apiEndpoint?.task?.getExistTask);
        console.log("existing task response :",response);
        // If tasks exist, go to Home, otherwise Setup
        if (response && response?.tasks) {
          setUserInitialRoute('HomeStack');
        } else {
          setUserInitialRoute('SetupRoutine');
        }
      } catch (error) {
        console.error('Error checking tasks:', error);
        // decide safely: usually default to Home so they can pull-to-refresh
        setUserInitialRoute('HomeStack'); 
      } finally {
        setTimeout(() => setIsCheckingTasks(false), 500);
      }
    };

    decideUserRoute();
  }, [user]);

  // 1. If Loading (checking tasks), show Splash
  if (user && isCheckingTasks) {
    return <SplashScreen />;
  }

  // 2. Separate Stacks Logic
  // This prevents the "Screen does not exist" crash because we
  // isolate the Stack Navigator configurations.
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // --- AUTH STACK ---
        <Stack.Group>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Group>
      ) : (
        // --- APP STACK ---
        // logic: We dynamically swap the order to make the 'first' one the default
        <Stack.Group>
          {userInitialRoute === 'SetupRoutine' ? (
            <>
              <Stack.Screen name="SetupRoutine" component={SetupRoutineScreen} />
              <Stack.Screen name="HomeStack" component={HomeNavigator} />
            </>
          ) : (
            <>
              <Stack.Screen name="HomeStack" component={HomeNavigator} />
              <Stack.Screen name="SetupRoutine" component={SetupRoutineScreen} />
            </>
          )}
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}