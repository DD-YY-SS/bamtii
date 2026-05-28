import { Text, View } from "react-native";
import { styles } from "../styles/styles";
import type { ThrottleMode } from "../types/app";
import { SegmentedControl } from "./SegmentedControl";

export function ThrottleControl({
  throttleMode,
  setThrottleMode
}: {
  throttleMode: ThrottleMode;
  setThrottleMode: (value: ThrottleMode) => void;
}) {
  return (
    <View style={styles.throttleBox}>
      <Text style={styles.throttleTitle}>네트워크 측정 모드</Text>
      <SegmentedControl
        items={[
          { key: "off", label: "실측" },
          { key: "2mbps", label: "2M" },
          { key: "1mbps", label: "1M" },
          { key: "0_6mbps", label: "0.6M" }
        ]}
        value={throttleMode}
        onChange={(value) => setThrottleMode(value as ThrottleMode)}
      />
      <Text style={styles.throttleText}>
        실측은 앱과 백엔드 사이의 benchmark 결과를 그대로 사용합니다. 2M/1M/0.6M은 혼잡망을 재현하기 위한 발표용 보정 모드입니다.
      </Text>
    </View>
  );
}
