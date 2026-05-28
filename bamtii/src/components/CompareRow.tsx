import { Text, View } from "react-native";
import { styles } from "../styles/styles";

export function CompareRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.compareRow}>
      <Text style={styles.compareLabel}>{label}</Text>
      <Text style={styles.compareValue}>{value}</Text>
    </View>
  );
}
