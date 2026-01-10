import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useContext, useState } from 'react';
import InputBox from '../../components/InputBox';
import PrimaryButton from '../../components/PrimaryButton';
import { AuthContext } from '../../context/AuthContext';
import  { apiCallAuth }  from '../../utils/apiCalls';
import  apiEndpoint  from '../../utils/endpoint';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);

  const [loginType, setLoginType] = useState('email'); // email | phone
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');

const handleLogin = async () => {
  try {
    console.log('Login Called', loginType, email, phone, pass);

    const response = await apiCallAuth(
      'POST',
      apiEndpoint?.auth?.login,
      {
        email: loginType === 'email' ? email : null,
        phone: loginType === 'phone' ? phone : null,
        password: pass,
      }
    );

    // 🔎 Example backend response
    // {
    //   success: true,
    //   token: "jwt_token_here",
    //   user: { _id, name, email }
    // }
    console.log("response ",response);

    if (response?.token) {
      // 🔐 Save token + user in AuthContext (AsyncStorage handled there)
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
};


  return (
    <View style={styles.container}>
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
