import { useMemo } from "react";
import { Text, View } from "react-native";
import { NativeStreamPlayer } from "../components/NativeStreamPlayer";
import { Panel } from "../components/Panel";
import { PipelineItem } from "../components/PipelineItem";
import { RealtimeUpscalePlayer } from "../components/RealtimeUpscalePlayer";
import { contentList } from "../constants/appData";
import { sample360pVideos } from "../constants/sampleVideos";
import { styles } from "../styles/styles";
import type { MeasurementResult, NetworkProfile } from "../types/app";

type VideoConvertScreenProps = {
  profile: NetworkProfile;
  selectedContent: number;
  progress: number;
  isPlaying: boolean;
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
  isPlaying,
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
    inference: 42,
    fps: 24
  };
  const defaultSample = useMemo(() => sample360pVideos[Math.floor(Math.random() * sample360pVideos.length)] ?? sample360pVideos[0], []);
  const apiRoot = (apiBaseUrl ?? "http://127.0.0.1:4000").trim().replace(/\/$/, "");
  const customStreamUrl = (nativeStreamUrl ?? "").trim();
  const defaultSampleUrl = `${apiRoot}/media/videos/${defaultSample.fileName}`;
  const defaultRestoredUrl = `${apiRoot}/media/videos/${defaultSample.restoredFileName}`;
  const sourceTitle = customStreamUrl ? "사용자 입력 360p URL" : defaultSample.title;

  return (
    <View style={styles.section}>
      <Panel title="원본 360p 영상">
        <Text style={styles.panelText}>
          구글 검색으로 찾은 공개 테스트용 360p MP4를 로컬 백엔드에 다운로드해 재생합니다. 이 상단 화면은 복원 전 저품질 입력입니다.
        </Text>
        <NativeStreamPlayer
          streamUrl={nativeStreamUrl}
          setStreamUrl={setNativeStreamUrl}
          defaultStreamUrl={defaultSampleUrl}
          sourceLabel={customStreamUrl ? sourceTitle : defaultSample.source}
          paused={!isPlaying}
        />
        <MeasurementButton isMeasuring={isMeasuring} onMeasure={onMeasure} label="360p 스트림 실측" loadingLabel="스트림 실측 중..." />
        <MeasurementResult measurement={measurement} measurementError={measurementError} />
      </Panel>

      <Panel title={`${contentList[selectedContent].title} 360p → 720p+`}>
        <Text style={styles.panelText}>
          아래 출력은 상단 360p 파일을 FSRCNN-x smoke 모델로 프레임 처리해 생성한 720p 복원 영상입니다.
        </Text>
        <RealtimeUpscalePlayer
          streamUrl={nativeStreamUrl}
          defaultStreamUrl={defaultSampleUrl}
          restoredStreamUrl={customStreamUrl ? "" : defaultRestoredUrl}
          sourceTitle={sourceTitle}
          profile={demoProfile}
          progress={progress}
          isPlaying={isPlaying}
          onPlayToggle={onPlayToggle}
        />
      </Panel>

      <Panel title="변환 파이프라인">
        <PipelineItem label="입력" value={`${sourceTitle} · 640x360`} />
        <PipelineItem label="전송" value="로컬 백엔드에서 360p MP4 Range 스트리밍" />
        <PipelineItem label="복원" value="FSRCNN-x smoke 모델 360p→720p 프레임 처리" />
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
