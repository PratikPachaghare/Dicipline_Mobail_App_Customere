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
import Icon from 'react-native-vector-icons/Ionicons';
// import ImageResizer from 'react-native-image-resizer';

import apiCall, { apiCallImage } from '../../utils/apiCalls';
import apiEndpoint from '../../utils/endpoint';

export default function CaptureScreen({ navigation, route }) {
  const { streakType, taskId } = route.params || {};

  const cameraRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  const [streakStarted, setStreakStarted] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const device = useCameraDevice('back');

  /* ================= CAMERA PERMISSION ================= */
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

  /* ================= IMAGE COMPRESSION ================= */
  // const compressImage = async (imagePath) => {
  //   try {
  //     const cleanPath =
  //       Platform.OS === 'android'
  //         ? imagePath.replace('file://', '')
  //         : imagePath;

  //     const compressed = await ImageResizer.createResizedImage(
  //       cleanPath,
  //       1024,
  //       1024,
  //       'JPEG',
  //       70,
  //       0
  //     );

  //     return Platform.OS === 'android'
  //       ? `file://${compressed.path}`
  //       : compressed.uri;
  //   } catch (error) {
  //     console.error('Image compression error:', error);
  //     return imagePath;
  //   }
  // };

  /* ================= START STREAK ================= */
  const startStreak = async () => {
    const granted = await requestCameraPermission();
    if (!granted) {
      Alert.alert('Permission Denied', 'Camera access is needed.');
      return;
    }

    setStreakStarted(true);
    setCameraOpen(true);
    setResult(null);
  };

  /* ================= TAKE PICTURE ================= */
  const handleTakePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePhoto({ flash: 'off' });
      const originalPath = `file://${photo.path}`;

      const compressedPath = originalPath;

      setCameraOpen(false);
      handleValidate(compressedPath);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  /* ================= UPLOAD IMAGE ================= */
  const handleValidate = async imagePath => {
    setLoading(true);

    try {
      if (!taskId) {
        Alert.alert('Error', 'Task ID is missing.');
        return;
      }

      const formData = new FormData();
      formData.append('image', {
        uri: imagePath,
        type: 'image/jpeg',
        name: 'task_evidence.jpg',
      });

      const response = await apiCallImage(
        'POST',
        apiEndpoint.task.completeTask(taskId),
        formData,
      );

      if (response?.success) {
        setResult('success');
        navigation.goBack();
      } else {
        setResult('failed');
        Alert.alert(
          'Validation Failed',
          response?.message || 'AI could not verify this task.',
        );
      }
    } catch (error) {
      console.error('Validation Error:', error);
      setResult('failed');
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setLoading(false);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const showCamera = cameraOpen && device;

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      {!streakStarted && !loading && !result && (
        <View style={styles.centered}>
          <Text style={styles.title}>Start Your Streak</Text>
          <Text style={styles.subtitle}>
            Type: {streakType || 'General Task'}
          </Text>

          <TouchableOpacity style={styles.button} onPress={startStreak}>
            <Text style={styles.buttonText}>▶ Start Streak</Text>
          </TouchableOpacity>
        </View>
      )}

      {showCamera && (
        <View style={StyleSheet.absoluteFill}>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive
            photo
          />

          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleTakePicture}
          >
            <View style={styles.shutterBtn} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              setCameraOpen(false);
              setStreakStarted(false);
            }}
          >
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.subtitle}>AI is analyzing your evidence...</Text>
        </View>
      )}

      {!loading && result && (
        <Animated.View
          style={[styles.centered, { transform: [{ scale: scaleAnim }] }]}
        >
          <Icon
            name={result === 'success' ? 'checkmark-circle' : 'close-circle'}
            size={90}
            color={result === 'success' ? 'green' : 'red'}
          />

          <Text
            style={[
              styles.title,
              { color: result === 'success' ? 'green' : 'red' },
            ]}
          >
            {result === 'success' ? 'Streak Verified!' : 'Not Verified'}
          </Text>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: result === 'success' ? 'green' : 'red' },
            ]}
            onPress={() =>
              result === 'success' ? navigation.goBack() : startStreak()
            }
          >
            <Text style={styles.buttonText}>
              {result === 'success' ? 'Continue' : 'Retry'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    alignItems: 'center',
    gap: 12,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  captureButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  shutterBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 50,
  },
});
