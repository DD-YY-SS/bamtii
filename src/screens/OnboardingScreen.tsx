import { Pressable, Text, View } from "react-native";
import { LaunchCheck } from "../components/LaunchCheck";
import { styles } from "../styles/styles";

export function OnboardingScreen({ onStart }: { onStart: () => void }) {
  return (
    <View style={styles.onboarding}>
      <View style={styles.brandMark}>
        <Text style={styles.brandMarkText}>AI</Text>
      </View>
      <Text style={styles.launchKicker}>깍두기 절단기</Text>
      <Text style={styles.launchTitle}>데이터는 가볍게, 화질은 선명하게.</Text>
      <Text style={styles.launchBody}>
        360p 패킷만 받아도 스마트폰 안의 경량 AI가 실시간으로 720p 이상 화질을 복원합니다.
        혼잡 지역, 5G 음영, 데이터 절약이 필요한 순간을 위해 설계된 스트리밍 앱입니다.
      </Text>

      <View style={styles.launchStack}>
        <LaunchCheck title="네트워크 적응" text="지연율, 패킷 드랍률, 대역폭을 감지해 ABR 정책 자동 전환" />
        <LaunchCheck title="온디바이스 AI" text="FSRCNN + INT8 양자화 + NPU/GPU Delegate 기반 실시간 복원" />
        <LaunchCheck title="Green Streaming" text="평균 60~65% 트래픽 절감과 egress 비용 절감 리포트 제공" />
      </View>

      <Pressable style={styles.primaryButton} onPress={onStart}>
        <Text style={styles.primaryButtonText}>스트리밍 시작하기</Text>
      </Pressable>
    </View>
  );
}
