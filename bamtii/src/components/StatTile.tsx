import { Text, View } from "react-native";
import { styles } from "../styles/styles";

export function StatTile({ label, value, tone }: { label: string; value: string; tone: "mint" | "warm" | "danger" | "ink" }) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, styles[`stat_${tone}`]]}>{value}</Text>
    </View>
  );
}
