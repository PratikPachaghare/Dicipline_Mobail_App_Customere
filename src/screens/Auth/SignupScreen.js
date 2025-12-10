
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import InputBox from "../../components/InputBox";
import PrimaryButton from "../../components/PrimaryButton";

export default function SignupScreen({ navigation }) {

  const handleSignup = () => {
    console.log("Signup API Called");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account ✨</Text>

      <InputBox placeholder="Full Name" />
      <InputBox placeholder="Email" />
      <InputBox placeholder="Password" secure />

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
