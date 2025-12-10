import { View, Text, StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Profile</Text>

      <View style={styles.box}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>John Doe</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>john@example.com</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: "#fff" },
  header: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  box: { padding: 20, backgroundColor: "#F5F6FA", borderRadius: 12 },
  label: { marginTop: 15, fontWeight: "600", color: "#555" },
  value: { fontSize: 16, marginTop: 5 },
});
