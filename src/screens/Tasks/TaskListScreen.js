import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TaskListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Tasks</Text>

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("AddTask")}
      >
        <Text style={styles.addText}>+ Add Task</Text>
      </TouchableOpacity>

      <View style={styles.taskBox}>
        <Text style={styles.taskTitle}>Morning Workout</Text>
        <Text style={styles.taskDesc}>Pushups, 30 reps</Text>
      </View>

      <View style={styles.taskBox}>
        <Text style={styles.taskTitle}>Read a Book</Text>
        <Text style={styles.taskDesc}>30 minutes</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: "#fff" },
  header: { fontSize: 28, fontWeight: "700" },
  addBtn: {
    backgroundColor: "#4A60FF",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "flex-start",
  },
  addText: { color: "#fff", fontWeight: "700" },
  taskBox: {
    backgroundColor: "#F5F6FA",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  taskTitle: { fontSize: 16, fontWeight: "700" },
  taskDesc: { color: "#777", marginTop: 5 },
});
