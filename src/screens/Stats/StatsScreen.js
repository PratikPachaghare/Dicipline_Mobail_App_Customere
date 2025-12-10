import { View, Text, StyleSheet } from "react-native";

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Stats</Text>

      <View style={styles.box}>
        <Text style={styles.stat}>Tasks Completed: 4</Text>
        <Text style={styles.stat}>Focus Hours: 3</Text>
        <Text style={styles.stat}>Water Intake: 2.5L</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: "#fff" },
  header: { fontSize: 28, fontWeight: "700" },
  box: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#F5F6FA",
    borderRadius: 12,
  },
  stat: { fontSize: 16, marginTop: 10, fontWeight: "600" },
});
