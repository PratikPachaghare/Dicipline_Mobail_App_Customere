import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons';

// REDUX IMPORTS
import { useDispatch } from 'react-redux';
import { markStreakCompleted } from '../../Store/steackSlice.js'; // Adjust path as needed

export default function CaptureScreen({ navigation, route }) {
  const { streakType } = route.params || {}; // e.g., "gym"
  const cameraRef = useRef(null);

  // REDUX DISPATCH
  const dispatch = useDispatch();

  const [streakStarted, setStreakStarted] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  const device = useCameraDevice('back');

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    const status = await Camera.requestCameraPermission();
    return status === 'granted';
  };

  const startStreak = async () => {
    const granted = await requestCameraPermission();
    if (granted) {
      setStreakStarted(true);
      setCameraOpen(true);
    } else {
      Alert.alert('Permission Denied', 'Camera access is needed.');
    }
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePhoto({ flash: 'off' });
        const localPath = `${RNFS.CachesDirectoryPath}/streak_${Date.now()}.jpg`;
        await RNFS.copyFile(photoData.path, localPath);

        setPhoto({ ...photoData, localPath });
        setCameraOpen(false);
        handleValidate(); 
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'Failed to take photo');
      }
    }
  };

  const handleValidate = async () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate validation (Replace this with real logic later)
      const isValid = Math.random() > 0.5; 
      
      setResult(isValid ? 'success' : 'failed');
      setLoading(false);
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

      // --- REDUX LOGIC HERE ---
      if (isValid && streakType) {
        // Dispatch action to store: "gym" is completed
        dispatch(markStreakCompleted(streakType.toLowerCase()));
      }
      
    }, 2000);
  };

  const showCamera = cameraOpen && device != null;
  const showSimulatorWarning = cameraOpen && device == null;

  return (
    <View style={styles.container}>
      {/* SECTION A: Start Button */}
      {!streakStarted && !loading && !result && (
        <View style={styles.centered}>
          <Text style={styles.title}>Start Your Streak</Text>
          <Text style={styles.subtitle}>Type: {streakType}</Text>
          <TouchableOpacity style={styles.button} onPress={startStreak}>
            <Text style={styles.buttonText}>▶ Start Streak</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* SECTION B: The Camera */}
      {showCamera && (
        <View style={StyleSheet.absoluteFill}>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
          />
          <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture}>
            <Text style={{ position: 'absolute', top: 28, color: 'red', fontWeight: 'bold' }}>SNAP</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.closeBtn} 
            onPress={() => { setCameraOpen(false); setStreakStarted(false); }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}> cancel </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* SECTION C: Simulator Warning */}
      {showSimulatorWarning && (
        <View style={styles.centered}>
          <Text style={{ color: 'red', fontSize: 18 }}>No Camera Device Found</Text>
          <TouchableOpacity style={styles.button} onPress={() => setCameraOpen(false)}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* SECTION D: Loading */}
      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.subtitle}>Validating...</Text>
        </View>
      )}

      {/* SECTION E: Result */}
      {!loading && result && (
        <Animated.View style={[styles.centered, { transform: [{ scale: scaleAnim }] }]}>
          <Icon name={result === 'success' ? 'checkmark-circle' : 'close-circle'} size={90} color={result === 'success' ? 'green' : 'red'} />
          <Text style={[styles.title, { color: result === 'success' ? 'green' : 'red' }]}>
            {result === 'success' ? 'Congratulations!' : 'Try Again!'}
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: result === 'success' ? 'green' : 'red' }]}
            onPress={result === 'success' ? () => navigation.goBack() : () => { setResult(null); startStreak(); }}
          >
            <Text style={styles.buttonText}>{result === 'success' ? 'Continue' : 'Retry'}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
  centered: { alignItems: 'center', gap: 12, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 16 },
  button: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#007bff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  captureButton: { position: 'absolute', bottom: 50, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', width: 80, height: 80, borderRadius: 40 },
  closeBtn: { position: 'absolute', top: 50, right: 20, backgroundColor: '#ae4141ff', padding: 10, borderRadius: 50 },
});