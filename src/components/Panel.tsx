import type React from "react";
import { Text, View } from "react-native";
import { styles } from "../styles/styles";

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>{title}</Text>
      {children}
    </View>
  );
}
