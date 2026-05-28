import { Text, View } from "react-native";
import { styles } from "../styles/styles";

export function PipelineItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.pipelineItem}>
      <Text style={styles.pipelineLabel}>{label}</Text>
      <Text style={styles.pipelineValue}>{value}</Text>
    </View>
  );
}
