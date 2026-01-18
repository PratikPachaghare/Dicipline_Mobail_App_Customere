import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Modal } from 'react-native';

const ProductiveLoader = ({ visible, message = "Loading..." }) => {
  return (
    <Modal
      transparent={true} // 🔥 Screen ke upar dikhne ke liye jaruri hai
      animationType="fade"
      visible={visible}
      statusBarTranslucent={true} // Android status bar ke upar bhi dikhega
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          
          <ActivityIndicator size="large" color="#4A60FF" />
          
          <Text style={styles.loadingText}>
            {message}
          </Text>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // ⚫ Black transparent overlay (Dim Effect)
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%', // Thoda chauda box
    
    // Shadow (Elevation) taaki box ubhra hua dikhe
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center'
  }
});

export default ProductiveLoader;