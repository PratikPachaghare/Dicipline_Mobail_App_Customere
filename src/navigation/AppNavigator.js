import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/Welcome/WelcomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import HomeNavigator from './HomeNavigator';
import { AuthContext } from '../context/AuthContext';
import SetupRoutineScreen from "../screens/Onboarding/SetupRoutineScreen.js"


const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* If user is NOT logged in → show Auth screens */}
      {!true ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        /* If user is logged in → go to Home */
        <>
          <Stack.Screen name="SetupRoutine" component={SetupRoutineScreen} />
          <Stack.Screen name="HomeStack" component={HomeNavigator} />
        </>
      )}
    </Stack.Navigator>
  );
}
