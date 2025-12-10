
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home/HomeScreen';
import TaskListScreen from '../screens/Tasks/TaskListScreen';
import AddTaskScreen from '../screens/Tasks/AddTaskScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import StatsScreen from '../screens/Stats/StatsScreen';
import CaptureScreen from "../screens/CreateSteck/CaptureScreen.js"

const Stack = createStackNavigator();

export default function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Capture" component={CaptureScreen} />


      {/* domy */}
      <Stack.Screen name="Tasks" component={TaskListScreen} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Stats" component={StatsScreen} />
    </Stack.Navigator>
  );
}
