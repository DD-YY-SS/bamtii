import { Text, View } from "react-native";
import { screenTitle } from "../constants/appData";
import { styles } from "../styles/styles";
import type { NetworkProfile, Screen } from "../types/app";

export function AppHeader({ screen, profile }: { screen: Screen; profile: NetworkProfile }) {
  return (
    <View style={styles.appHeader}>
      <View>
        <Text style={styles.headerEyebrow}>깍두기 절단기</Text>
        <Text style={styles.headerTitle}>{screenTitle(screen)}</Text>
      </View>
      <View style={styles.liveBadge}>
        <View style={styles.liveDot} />
        <Text style={styles.liveBadgeText}>{profile.label}</Text>
      </View>
    </View>
  );
}
