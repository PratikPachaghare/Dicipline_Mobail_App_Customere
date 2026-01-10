import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useContext, useState } from "react";
import InputBox from "../../components/InputBox";
import PrimaryButton from "../../components/PrimaryButton";
import { AuthContext } from "../../context/AuthContext";
import  {apiCallAuth}  from "../../utils/apiCalls";
import  apiEndpoint  from "../../utils/endpoint";

export default function SignupScreen({ navigation }) {
  const { login } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");

  const handleSignup = async () => {
    try {
      if (!name || !email || !phone || !pass) {
        return console.log("All fields required");
      }

      const response = await apiCallAuth(
        "POST",
        apiEndpoint?.auth?.register,
        {
          name,
          email,
          phone,
          password: pass,
        }
      );

      // Expected response:
      // { token, user }

      if (response?.token) {
        // 🔐 Auto login after register
        login({
          token: response.token,
          user: response.user,
        });
      } else {
        console.log("Invalid register response");
      }

    } catch (error) {
      console.log("Signup Error:", error?.message || error);
    }
  };

  return (
    <View style={styles.container}>
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
      <InputBox
        placeholder="Password"
        secure
        onChangeText={setPass}
      />

      <PrimaryButton title="Sign Up" onPress={handleSignup} />

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  link: { color: "#4A60FF", marginTop: 15, textAlign: "center" },
});
