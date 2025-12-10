import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={["#4A60FF", "#6F87FF"]}
      style={styles.container}
    >
      {/* Background Circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Discipline App</Text>
        <Text style={styles.subtitle}>
          Build better habits, track progress, and become your best self.
        </Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  // Background circles
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 999,
    position: "absolute",
    top: -50,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    position: "absolute",
    bottom: -40,
    left: -50,
  },

  content: {
    paddingHorizontal: 30,
    alignItems: "center",
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },

  btn: {
    marginTop: 35,
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  btnText: {
    color: "#4A60FF",
    fontSize: 16,
    fontWeight: "700",
  },
});
