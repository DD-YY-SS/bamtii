import { Text, View } from "react-native";
import { CompareRow } from "../components/CompareRow";
import { Panel } from "../components/Panel";
import { StatTile } from "../components/StatTile";
import { styles } from "../styles/styles";

export function SavingsScreen({
  effectiveSavings,
  monthlyGbSaved,
  monthlyCostSaved,
  monthlyCarbonKg
}: {
  effectiveSavings: number;
  monthlyGbSaved: number;
  monthlyCostSaved: number;
  monthlyCarbonKg: number;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.savingsHero}>
        <Text style={styles.savingsNumber}>{effectiveSavings}%</Text>
        <Text style={styles.savingsLabel}>현재 스트림 트래픽 절감</Text>
        <Text style={styles.savingsBody}>
          1080p 원본 청크 송출 대비 360p 수신 + 온디바이스 복원으로 네트워크 부담을 낮춥니다.
        </Text>
      </View>

      <View style={styles.quickGrid}>
        <StatTile label="월 절감 데이터" value={`${monthlyGbSaved}GB`} tone="mint" />
        <StatTile label="예상 비용 절감" value={`₩${monthlyCostSaved.toLocaleString("ko-KR")}`} tone="mint" />
        <StatTile label="탄소 저감" value={`${monthlyCarbonKg}kg`} tone="warm" />
        <StatTile label="PSNR 손실" value="≤0.2dB" tone="ink" />
      </View>

      <Panel title="비교">
        <CompareRow label="기존 OTT" value="고속망과 대규모 서버/egress 비용에 의존" />
        <CompareRow label="학술 AI 처리" value="PC/GPU 중심, 실시간 모바일 스트리밍 적용 어려움" />
        <CompareRow label="깍두기 절단기" value="360p 전송 후 스마트폰 내부에서 720p/1080p급 복원" />
      </Panel>

      <Panel title="ESG 리포트">
        <Text style={styles.panelText}>
          통신량을 줄이면 데이터센터의 네트워크 처리 부하와 전력 사용량을 낮출 수 있습니다.
          사용자는 데이터 요금 부담을 줄이고, 통신 취약 지역에서도 고화질 미디어 접근성을 유지합니다.
        </Text>
      </Panel>
    </View>
  );
}
