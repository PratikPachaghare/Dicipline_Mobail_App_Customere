import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useContext, useState } from 'react';
import InputBox from '../../components/InputBox';
import PrimaryButton from '../../components/PrimaryButton';
import { AuthContext } from '../../context/AuthContext';
import { apiCallAuth, savePrivateKey } from '../../utils/apiCalls';
import apiEndpoint from '../../utils/endpoint';
import { decryptPrivateKeyWithPassword, encryptPrivateKeyWithPassword } from '../../utils/cryptoHelper';
import ProductiveLoader from '../../components/ProductiveLoader';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("Initializing...");
  const [loginType, setLoginType] = useState('email'); // email | phone
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = async () => {
    setIsLoading(true);
    try {

      console.log('Login Called', loginType, email, phone, pass);
      setLoaderMessage("Securing your identity..."); 
      const response = await apiCallAuth('POST', apiEndpoint?.auth?.login, {
        email: loginType === 'email' ? email : null,
        phone: loginType === 'phone' ? phone : null,
        password: pass,
      });


      console.log('response ', response);
      setLoaderMessage("verfy validate account..."); 
      if (response?.token) {
        if (response.user.encryptedPrivateKey) {
          setLoaderMessage("create uniw key"); 
          console.log('Found backup key on server...');

          // Unlock using the password user just entered
          const originalPrivateKey = decryptPrivateKeyWithPassword(
            response.user.encryptedPrivateKey,
            password=pass,
          );

          if (originalPrivateKey) {
            await savePrivateKey(response.user.id, originalPrivateKey);
            console.log('Old keys restored successfully! ✅');
          } else {
            console.log(
              'Password changed or key corrupted. Old chats unreadable.',
            );
          }
        } else {
          // Agar user purana hai aur uske paas backup key nahi thi
          console.log(
            'No backup key found. Generating new keys (Old chats lost).',
          );
          // const newKeys = await generateKeyPairs();
          // await savePrivateKey(response.user.id, newKeys.private);

          // await apiCallAuth('PUT', apiEndpoint?.auth?.updateKeys, {
          //   publicKey: newKeys.public,
          //   encryptedPrivateKey: encryptPrivateKeyWithPassword(
          //     newKeys.private,
          //     pass
          //   ),
          // });

          // console.log('Server updated with NEW keys successfully.');
        }
        setLoaderMessage("login user..."); 
        login({
          token: response.token,
          user: response.user,
        });
      } else {
        console.log('Invalid login response');
      }
    } catch (error) {
      console.log('Login Error:', error?.message || error);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>

      <ProductiveLoader visible={isLoading} message={loaderMessage} />
      <Text style={styles.title}>Login 🔐</Text>

      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            loginType === 'email' && styles.activeToggle,
          ]}
          onPress={() => setLoginType('email')}
        >
          <Text>Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleBtn,
            loginType === 'phone' && styles.activeToggle,
          ]}
          onPress={() => setLoginType('phone')}
        >
          <Text>Phone</Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Input */}
      {loginType === 'email' ? (
        <InputBox
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
      ) : (
        <InputBox
          placeholder="Phone Number"
          keyboardType="phone-pad"
          onChangeText={setPhone}
        />
      )}

      <InputBox placeholder="Password" secure onChangeText={setPass} />

      <PrimaryButton title="Login" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don't have an account? Signup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20 },

  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },

  toggleBtn: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#eee',
  },

  activeToggle: {
    backgroundColor: '#4A60FF',
  },

  link: {
    color: '#4A60FF',
    marginTop: 15,
    textAlign: 'center',
  },
});
