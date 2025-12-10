
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useContext, useState } from "react";
import InputBox from "../../components/InputBox";
import PrimaryButton from "../../components/PrimaryButton";
import { AuthContext } from "../../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    console.log("Login Called", email, pass);
    login({ name: "Test User", email });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login 🔐</Text>

      <InputBox placeholder="Email" onChangeText={setEmail} />
      <InputBox placeholder="Password" secure onChangeText={setPass} />

      <PrimaryButton title="Login" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.link}>Don't have an account? Signup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  link: { color: "#4A60FF", marginTop: 15, textAlign: "center" },
});
