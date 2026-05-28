import { Pressable, Text, View } from "react-native";
import { styles } from "../styles/styles";

export function SegmentedControl({
  items,
  value,
  onChange
}: {
  items: { key: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.segment}>
      {items.map((item) => (
        <Pressable
          key={item.key}
          onPress={() => onChange(item.key)}
          style={[styles.segmentItem, value === item.key && styles.segmentItemActive]}
        >
          <Text style={[styles.segmentText, value === item.key && styles.segmentTextActive]}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
