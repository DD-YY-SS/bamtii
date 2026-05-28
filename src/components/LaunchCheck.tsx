import { Text, View } from "react-native";
import { styles } from "../styles/styles";

export function LaunchCheck({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.launchCheck}>
      <View style={styles.checkDot}>
        <Text style={styles.checkDotText}>✓</Text>
      </View>
      <View style={styles.checkCopy}>
        <Text style={styles.checkTitle}>{title}</Text>
        <Text style={styles.checkText}>{text}</Text>
      </View>
    </View>
  );
}
