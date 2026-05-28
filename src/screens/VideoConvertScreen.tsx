import { Text, View } from "react-native";
import { HeroPlayer } from "../components/HeroPlayer";
import { NativeStreamPlayer } from "../components/NativeStreamPlayer";
import { Panel } from "../components/Panel";
import { PipelineItem } from "../components/PipelineItem";
import { contentList } from "../constants/appData";
import { styles } from "../styles/styles";
import type { AnimatedStyle, MeasurementResult, NetworkProfile } from "../types/app";

type VideoConvertScreenProps = {
  profile: NetworkProfile;
  selectedContent: number;
  progress: number;
  shouldUpscale: boolean;
  isPlaying: boolean;
  scanStyle: AnimatedStyle;
  glowStyle: AnimatedStyle;
  onPlayToggle: () => void;
  nativeStreamUrl: string;
  setNativeStreamUrl: (value: string) => void;
  apiBaseUrl: string;
  measurement: MeasurementResult | null;
  isMeasuring: boolean;
  measurementError: string;
  onMeasure: () => void;
};

export function VideoConvertScreen({
  profile,
  selectedContent,
  progress,
  shouldUpscale,
  isPlaying,
  scanStyle,
  glowStyle,
  onPlayToggle,
  nativeStreamUrl,
  setNativeStreamUrl,
  apiBaseUrl,
  measurement,
  isMeasuring,
  measurementError,
  onMeasure
}: VideoConvertScreenProps) {
  const demoProfile = {
    ...profile,
    serverQuality: "360p",
    renderQuality: "720p+",
    trafficSaved: Math.max(profile.trafficSaved, 62),
    inference: profile.inference || 27,
    fps: Math.max(profile.fps, 34)
  };

  return (
    <View style={styles.section}>
      <Panel title="원본 360p 영상">
        <Text style={styles.panelText}>
          사용자가 입력한 자체 HLS/MP4 360p 영상을 원본 화질 그대로 재생합니다. 이 영역은 서버에서 받은 저해상도 스트림을 보여줍니다.
        </Text>
        <NativeStreamPlayer apiBaseUrl={apiBaseUrl} streamUrl={nativeStreamUrl} setStreamUrl={setNativeStreamUrl} selectedContent={selectedContent} paused={!isPlaying} />
        <MeasurementButton isMeasuring={isMeasuring} onMeasure={onMeasure} label="360p 스트림 실측" loadingLabel="스트림 실측 중..." />
        <MeasurementResult measurement={measurement} measurementError={measurementError} />
      </Panel>

      <Panel title="Demo 복원 출력">
        <Text style={styles.panelText}>
          아래 화면은 360p 입력을 온디바이스 AI로 720p+ 출력하는 복원 결과를 시각화한 시연 영역입니다. 실제 제품 단계에서는 iOS Core ML Native
          Module이 프레임 단위로 처리합니다.
        </Text>
        <HeroPlayer
          title={`${contentList[selectedContent].title} · 360p → 720p+`}
          profile={demoProfile}
          progress={progress}
          shouldUpscale={shouldUpscale}
          effectiveQuality="720p+"
          isPlaying={isPlaying}
          scanStyle={scanStyle}
          glowStyle={glowStyle}
          onPlayToggle={onPlayToggle}
        />
      </Panel>

      <Panel title="변환 파이프라인">
        <PipelineItem label="입력" value="360p 자체 HLS/MP4 영상" />
        <PipelineItem label="전송" value="저해상도 패킷만 수신" />
        <PipelineItem label="복원" value="FSRCNN/Core ML 기반 720p+ 변환 구조" />
        <PipelineItem label="출력" value={`절감률 ${demoProfile.trafficSaved}% · 목표 ${demoProfile.fps}FPS`} />
      </Panel>
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
    <Text style={[styles.measureButton, isMeasuring && styles.measureButtonDisabled]} onPress={isMeasuring ? undefined : onMeasure}>
      <Text style={styles.measureButtonText}>{isMeasuring ? loadingLabel : label}</Text>
    </Text>
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
