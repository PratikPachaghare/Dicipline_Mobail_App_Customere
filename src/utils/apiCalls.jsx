import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export default apiCall = async (method, endpoint, data = {}, params = {}) => {
  try {
    const response = await api({
      method,
      url: endpoint,
      data,
      params,
    });
    return response.data;
  } catch (error) {
    console.log('API Error:', endpoint, error?.response?.data || error.message);
    return null;
  }
};

import axios from "axios";

const BASE_URL = "http://10.0.2.2:5000/api";


export const apiCallImage = async (
  method,
  endpoint,
  formData,
  params = {}
) => {
  try {
    const token = await AsyncStorage.getItem('token');

    // Build query params
    const query = new URLSearchParams(params).toString();
    const url = `${BASE_URL}${endpoint}${query ? `?${query}` : ''}`;

    console.log(`📸 Image API → ${method} ${url}`);

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type' :'multipart/form-data',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      console.log('❌ Image API Error:', result);
      return null;
    }

    return result;
  } catch (error) {
    console.log('❌ Image API Error:', error.message);
    return null;
  }
};

export const apiCallImageChat = async (
  method,
  endpoint,
  formData,
  params = {}
) => {
  try {

    const token = await AsyncStorage.getItem('token');

    // Build query params
    const query = new URLSearchParams(params).toString();
    const url = `${BASE_URL}${endpoint}${query ? `?${query}` : ''}`;

    console.log(`📸 Image API → ${method} ${url}`);

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'multipart/form-data', 
        // 'Content-Type': 'application/json', 
        // 'Accept': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    console.log("api respon image send in chat : ", response);
    const result = await response.json();

    if (!response.ok) {
      console.log('❌ Image API Error:', result);
      return null;
    }

    return result;
  } catch (error) {
    console.log('❌ Image API Error:', error.message);
    return null;
  }
};



export const apiCallAuth = async (method, endpoint, data = {}, params = {}) => {
  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`📡 Sending ${method} to ${url}`);
    
    let response;

    // Use specific methods to ensure Axios handles the body correctly
    if (method.toUpperCase() === 'POST') {
      response = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' },
        params: params
      });
    } else if (method.toUpperCase() === 'GET') {
      response = await axios.get(url, {
        headers: { 'Content-Type': 'application/json' },
        params: params
      });
    }

    return response.data;
  } catch (error) {
    console.log('❌ Auth API Error:', error.response?.data || error.message);
    return error.response?.data || null;
  }
};

export const verifyToken = async (method, endpoint, token, params = {}) => {
  try {
   
    const response = await axios({
      method,
      url: BASE_URL + endpoint,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.log(
      'veryToken API Error:',
      endpoint,
      error?.response?.data || error.message,
    );
    return null;
  }
};

import RSAKey from 'react-native-rsa';

export const savePrivateKey = async (userId, privateKey) => {
    try {
        await AsyncStorage.setItem(`PRIVATE_KEY_${userId}`, privateKey);
        console.log(`Private Key saved for user: ${userId}`);
    } catch (error) {
        console.error('Save privatKey Error:', error);
    }
};

export const encryptMessage = async (message, friendPublicKey) => {
    try {
        if (!friendPublicKey) return null;
        
        const rsa = new RSAKey();
        rsa.setPublicString(friendPublicKey); // Friend ki key set karein
        
        const encrypted = rsa.encrypt(message);
        return encrypted;
    } catch (error) {
        console.error('Encrypt Error:', error);
        return null; 
    }
};

export const decryptMessage = async (encryptedContent, myUserId) => {
    try {
        const myPrivateKey = await AsyncStorage.getItem(`PRIVATE_KEY_${myUserId}`);
        
        if (!myPrivateKey) {
            return "🔒 Encrypted (Key Missing)";
        }

        const rsa = new RSAKey();
        rsa.setPrivateString(myPrivateKey); // Apni key set karein
        
        const decrypted = rsa.decrypt(encryptedContent);
        return decrypted;
    } catch (error) {
        // Agar decrypt fail hua (mtlb plain text tha ya key galat thi)
        return encryptedContent; 
    }
};

// apiCalls.js me function add karein agar nahi hai
// (Generic apiCallAuth use kar sakte hain)

// --- Frontend Usage Example ---

// const handleKeyReset = async ({emailOrPhone,pass}) => {
//     try {
//         console.log("Generating fresh keys...");
//         const newKeys = await generateKeyPairs();
        
//         // Naye password se encrypt karein (Assuming 'pass' available hai state me)
//         const encryptedKey = encryptPrivateKeyWithPassword(newKeys.private, pass);
        
//         // Backend hit karein
//         const res = await apiCallAuth('PUT', apiEndpoint.auth.updateKeys, {
//             publicKey: newKeys.public,
//             encryptedPrivateKey: encryptedKey
//         });

//         if (res?.success) {
//             // Local Storage update karein
//             await savePrivateKey(res.user.id, newKeys.private);
            
//             Alert.alert("Success", "Account reset complete. Old chats cleared.");
            
//             // App ko reload ya home pe navigate karein
//             navigation.replace("Auth"); 
//         }

//     } catch (error) {
//         console.log("Reset failed:", error);
//     }
// };