import { Switch, Text, View } from "react-native";
import { styles } from "../styles/styles";

export function ToggleRow({
  label,
  description,
  value,
  onValueChange
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleCopy}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#CDD3CC", true: "#89E6BE" }}
        thumbColor={value ? "#063126" : "#F8F6EA"}
      />
    </View>
  );
}
