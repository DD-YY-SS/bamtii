import { Pressable, Text, View } from "react-native";
import { Panel } from "../components/Panel";
import { PipelineItem } from "../components/PipelineItem";
import { SegmentedControl } from "../components/SegmentedControl";
import { StatTile } from "../components/StatTile";
import { ThrottleControl } from "../components/ThrottleControl";
import { styles } from "../styles/styles";
import type { MeasurementResult, NetworkMode, NetworkProfile, ThrottleMode } from "../types/app";

export function NetworkScreen({
  networkMode,
  setNetworkMode,
  profile,
  abrDecision,
  measurement,
  throttleMode,
  setThrottleMode,
  isMeasuring,
  isRealtimeMeasuring,
  setIsRealtimeMeasuring,
  measurementError,
  onMeasure
}: {
  networkMode: NetworkMode;
  setNetworkMode: (value: NetworkMode) => void;
  profile: NetworkProfile;
  abrDecision: string;
  measurement: MeasurementResult | null;
  throttleMode: ThrottleMode;
  setThrottleMode: (value: ThrottleMode) => void;
  isMeasuring: boolean;
  isRealtimeMeasuring: boolean;
  setIsRealtimeMeasuring: (value: boolean) => void;
  measurementError: string;
  onMeasure: () => void;
}) {
  return (
    <View style={styles.section}>
      <Panel title="실제 네트워크 실측">
        <Text style={styles.panelText}>
          백엔드에서 benchmark chunk를 직접 내려받아 대역폭, 지연율, jitter, 실패율을 측정하고 telemetry로 저장합니다.
        </Text>
        <Pressable style={[styles.measureButton, isMeasuring && styles.measureButtonDisabled]} onPress={onMeasure} disabled={isMeasuring}>
          <Text style={styles.measureButtonText}>{isMeasuring ? "측정 중..." : "실측 시작"}</Text>
        </Pressable>
        <Pressable
          style={[styles.realtimeWideButton, isRealtimeMeasuring && styles.realtimeWideButtonActive]}
          onPress={() => setIsRealtimeMeasuring(!isRealtimeMeasuring)}
        >
          <Text style={[styles.realtimeWideButtonText, isRealtimeMeasuring && styles.realtimeWideButtonTextActive]}>
            {isRealtimeMeasuring ? "실시간 수신 중지" : "실시간 수신 시작"}
          </Text>
        </Pressable>
        {measurementError ? <Text style={styles.errorText}>{measurementError}</Text> : null}
        {measurement ? (
          <View style={styles.measurementBox}>
            <Text style={styles.measurementTitle}>마지막 실측: {new Date(measurement.measuredAt).toLocaleTimeString("ko-KR")}</Text>
            <Text style={styles.panelText}>
              {measurement.successfulSamples}/{measurement.totalSamples}개 샘플 성공 · {(measurement.downloadedBytes / 1024).toFixed(0)}KB 다운로드 · {measurement.durationMs}ms 소요
            </Text>
          </View>
        ) : null}
        <ThrottleControl throttleMode={throttleMode} setThrottleMode={setThrottleMode} />
      </Panel>

      <Panel title="네트워크 환경 시뮬레이터">
        <SegmentedControl
          items={[
            { key: "shade", label: "음영" },
            { key: "crowd", label: "혼잡" },
            { key: "normal", label: "고속" }
          ]}
          value={networkMode}
          onChange={(value) => setNetworkMode(value as NetworkMode)}
        />
      </Panel>

      <View style={styles.quickGrid}>
        <StatTile label="대역폭" value={`${profile.bandwidth}Mbps`} tone={profile.bandwidth <= 2 ? "danger" : "mint"} />
        <StatTile label="지연율" value={`${profile.latency}ms`} tone="warm" />
        <StatTile label="Jitter" value={`${profile.jitter}ms`} tone="ink" />
        <StatTile label="Packet Drop" value={`${profile.packetDrop}%`} tone={profile.packetDrop > 3 ? "danger" : "mint"} />
      </View>

      <Panel title="백엔드 동작">
        <PipelineItem label="NestJS" value="비동기 I/O 기반 HLS 청크 송출" />
        <PipelineItem label="Telemetry" value="클라이언트 지연율, 드랍률, 대역폭 수집" />
        <PipelineItem label="Prisma/PostgreSQL" value="ABR 판단용 네트워크 이력 적재" />
        <PipelineItem label="Linux/rsyslog" value="트래픽 로그와 시스템 상태 모니터링" />
        <PipelineItem label="Congestion Gate" value="혼잡 감지 시 고해상도 청크 차단" />
      </Panel>

      <Panel title="현재 서버 결정">
        <Text style={styles.decisionText}>{profile.status}</Text>
        <Text style={styles.panelText}>{abrDecision}</Text>
      </Panel>
    </View>
  );
}
