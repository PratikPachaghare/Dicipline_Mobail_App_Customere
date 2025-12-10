import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function AddTaskScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Task</Text>

      <TextInput placeholder="Title" style={styles.input} />
      <TextInput
        placeholder="Description"
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.btnText}>Save Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: "#fff" },
  header: { fontSize: 28, fontWeight: "700" },
  input: {
    backgroundColor: "#F5F6FA",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  btn: {
    backgroundColor: "#4A60FF",
    padding: 14,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
