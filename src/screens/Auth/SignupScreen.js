import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useContext, useState } from 'react';
import InputBox from '../../components/InputBox';
import PrimaryButton from '../../components/PrimaryButton';
import { AuthContext } from '../../context/AuthContext';
import {
  apiCallAuth,
  savePrivateKey,
} from '../../utils/apiCalls';
import apiEndpoint from '../../utils/endpoint';
import { decryptPrivateKeyWithPassword} from '../../utils/cryptoHelper';
import ProductiveLoader from '../../components/ProductiveLoader';

export default function SignupScreen({ navigation }) {
  const { login } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');
  const [gender, setgenders] = useState('');

  // Loading statea
  const [isLoading, setIsLoading] = useState(false);
  // Custom message state (Optional: taaki hum process ke hisaab se text badal sakein)
  const [loaderMessage, setLoaderMessage] = useState('Initializing...');

  const handleSignup = async () => {
    // 1️⃣ Validation Pehle (Loader se pehle)
    if (!name || !email || !phone || !pass || !gender) {
      return Alert.alert('Missing Info', 'Please fill all fields');
    }

    // 2️⃣ Ab Loader Start Karein
    setIsLoading(true);

    try {
      // 1️ START LOADING MSG
      setLoaderMessage('Creating account...');
      const response = await apiCallAuth('POST', apiEndpoint?.auth?.register, {
        name,
        email,
        phone,
        password: pass,
        gender
      });


      if (response?.token) {
        setLoaderMessage('Finalizing setup...');
        const privateKey = decryptPrivateKeyWithPassword(response.user.encryptedPrivateKey,pass);

        const newUserId = response.user.id;
        setLoaderMessage('Finel setup...');
        // Private key save karein
        await savePrivateKey(newUserId, privateKey);

        login({
          token: response.token,
          user: response.user,
        });
        setLoaderMessage('setup done...');

        // Note: Yahan setIsLoading(false) nahi karenge kyunki screen change ho jayegi.
      } else {
        setIsLoading(false); 
        Alert.alert('Registration Failed', 'Invalid response from server');
      }
    } catch (error) {
      //  Error aya to loader band karo
      setIsLoading(false);
      console.log('Signup Error:', error?.message || error);
      Alert.alert('Error', 'Signup failed. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Custom Productive Loader Add kiya */}
      <ProductiveLoader visible={isLoading} message={loaderMessage} />

      <Text style={styles.title}>Create Account ✨</Text>

      <InputBox placeholder="Full Name" onChangeText={setName} />
      <InputBox
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <InputBox
        placeholder="Phone"
        keyboardType="phone-pad"
        onChangeText={setPhone}
      />
      <View style={{ flexDirection: 'row', gap: 15,marginBottom:13 }}>
        {['Male', 'Female', 'Other'].map(item => (
          <TouchableOpacity key={item} onPress={() => setgenders(item)}>
            <Text
              style={{
                padding: 10,
                borderWidth: 1,
                borderColor: gender === item ? '#3A3AFF' : '#ccc',
                borderRadius: 8,
                color: gender === item ? '#3A3AFF' : '#000',
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <InputBox placeholder="Password" secure onChangeText={setPass} />

      {/* Button hamesha dikhega, kyunki loader ab 'Modal' hai jo screen cover kar lega */}
      <PrimaryButton title="Sign Up" onPress={handleSignup} />

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        disabled={isLoading}
      >
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  link: { color: '#4A60FF', marginTop: 15, textAlign: 'center' },
});
