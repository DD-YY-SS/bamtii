import { Pressable, Text, View } from "react-native";
import { navItems } from "../constants/appData";
import { styles } from "../styles/styles";
import type { Screen } from "../types/app";

export function BottomNav({ screen, setScreen }: { screen: Screen; setScreen: (screen: Screen) => void }) {
  return (
    <View style={styles.nav}>
      {navItems.map((item) => (
        <Pressable key={item.key} onPress={() => setScreen(item.key)} style={styles.navItem}>
          <Text style={[styles.navIcon, screen === item.key && styles.navIconActive]}>{item.icon}</Text>
          <Text style={[styles.navLabel, screen === item.key && styles.navLabelActive]}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
