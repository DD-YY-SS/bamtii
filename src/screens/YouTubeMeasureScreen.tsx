import { Pressable, Text, View } from "react-native";
import { Panel } from "../components/Panel";
import { PipelineItem } from "../components/PipelineItem";
import { YouTubePlayer } from "../components/YouTubePlayer";
import { styles } from "../styles/styles";
import type { MeasurementResult } from "../types/app";

type YouTubeMeasureScreenProps = {
  youtubeUrl: string;
  measurement: MeasurementResult | null;
  isMeasuring: boolean;
  isRealtimeMeasuring: boolean;
  setIsRealtimeMeasuring: (value: boolean) => void;
  measurementError: string;
  onMeasure: () => void;
};

export function YouTubeMeasureScreen({
  youtubeUrl,
  measurement,
  isMeasuring,
  isRealtimeMeasuring,
  setIsRealtimeMeasuring,
  measurementError,
  onMeasure
}: YouTubeMeasureScreenProps) {
  return (
    <View style={styles.section}>
      <Panel title="YouTube 네트워크 실측">
        <Text style={styles.panelText}>
          YouTube 영상을 재생하면서 앱이 백엔드 benchmark 요청으로 현재 네트워크 상태를 측정합니다. YouTube 프레임은 직접 처리하지 않고,
          실제 스트리밍 상황을 재현하는 용도로 사용합니다.
        </Text>
        <YouTubePlayer youtubeUrl={youtubeUrl} />
        <RealtimeControl isRealtimeMeasuring={isRealtimeMeasuring} setIsRealtimeMeasuring={setIsRealtimeMeasuring} />
        <MeasurementButton isMeasuring={isMeasuring} onMeasure={onMeasure} label="실측 시작" loadingLabel="실측 중..." />
        <MeasurementResult measurement={measurement} measurementError={measurementError} />
      </Panel>

      <Panel title="실측 기준">
        <PipelineItem label="대역폭" value="백엔드 chunk 다운로드 속도 측정" />
        <PipelineItem label="지연" value="요청-응답 왕복 시간 측정" />
        <PipelineItem label="ABR" value="2Mbps 이하 또는 지연 증가 시 360p 전송 판단" />
        <PipelineItem label="주의" value="YouTube 내부 bitrate/프레임 직접 분석은 수행하지 않음" />
      </Panel>
    </View>
  );
}

function RealtimeControl({
  isRealtimeMeasuring,
  setIsRealtimeMeasuring
}: {
  isRealtimeMeasuring: boolean;
  setIsRealtimeMeasuring: (value: boolean) => void;
}) {
  return (
    <View style={styles.realtimeRow}>
      <View style={styles.realtimeCopy}>
        <Text style={styles.realtimeTitle}>실시간 측정</Text>
        <Text style={styles.realtimeText}>{isRealtimeMeasuring ? "5초마다 실측값을 갱신합니다." : "시연 중 계속 측정하려면 켜주세요."}</Text>
      </View>
      <Pressable style={[styles.realtimeButton, isRealtimeMeasuring && styles.realtimeButtonActive]} onPress={() => setIsRealtimeMeasuring(!isRealtimeMeasuring)}>
        <Text style={[styles.realtimeButtonText, isRealtimeMeasuring && styles.realtimeButtonTextActive]}>{isRealtimeMeasuring ? "중지" : "실시간"}</Text>
      </Pressable>
    </View>
  );
}

function MeasurementButton({
  isMeasuring,
  onMeasure,
  label,
  loadingLabel
}: {
  isMeasuring: boolean;
  onMeasure: () => void;
  label: string;
  loadingLabel: string;
}) {
  return (
    <Pressable style={[styles.measureButton, isMeasuring && styles.measureButtonDisabled]} onPress={onMeasure} disabled={isMeasuring}>
      <Text style={styles.measureButtonText}>{isMeasuring ? loadingLabel : label}</Text>
    </Pressable>
  );
}

function MeasurementResult({ measurement, measurementError }: { measurement: MeasurementResult | null; measurementError: string }) {
  if (measurementError) {
    return <Text style={styles.errorText}>{measurementError}</Text>;
  }

  if (!measurement) {
    return null;
  }

  return (
    <View style={styles.measurementBox}>
      <Text style={styles.measurementTitle}>
        실측 결과: {measurement.bandwidthMbps}Mbps · {measurement.latencyMs}ms · jitter {measurement.jitterMs}ms
      </Text>
    </View>
  );
}
