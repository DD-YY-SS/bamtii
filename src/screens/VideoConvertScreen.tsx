import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { NativeStreamPlayer } from "../components/NativeStreamPlayer";
import { Panel } from "../components/Panel";
import { PipelineItem } from "../components/PipelineItem";
import { RealtimeUpscalePlayer } from "../components/RealtimeUpscalePlayer";
import { contentList } from "../constants/appData";
import { sample360pVideos } from "../constants/sampleVideos";
import { fetchSavingsReport } from "../services/backendApi";
import { styles } from "../styles/styles";
import type { MeasurementResult, NetworkProfile, SavingsReport } from "../types/app";

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
  const defaultSample = useMemo(() => sample360pVideos[0], []);
  const apiRoot = (apiBaseUrl ?? "http://127.0.0.1:4000").trim().replace(/\/$/, "");
  const customStreamUrl = (nativeStreamUrl ?? "").trim();
  const defaultSampleUrl = `${apiRoot}/media/videos/${defaultSample.fileName}`;
  const defaultRestoredUrl = `${apiRoot}/media/videos/${defaultSample.restoredFileName}`;
  const sourceTitle = customStreamUrl ? "사용자 입력 360p URL" : defaultSample.title;
  const [savingsReport, setSavingsReport] = useState<SavingsReport | null>(null);
  const [reportError, setReportError] = useState("");
  const [isReportLoading, setIsReportLoading] = useState(false);

  useEffect(() => {
    if (customStreamUrl) {
      setSavingsReport(null);
      setReportError("");
      return;
    }

    let cancelled = false;
    setIsReportLoading(true);
    setReportError("");

    fetchSavingsReport({
      apiBaseUrl,
      sourceFileName: defaultSample.fileName,
      restoredFileName: defaultSample.restoredFileName
    })
      .then((report) => {
        if (!cancelled) {
          setSavingsReport(report);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setSavingsReport(null);
          setReportError(error instanceof Error ? error.message : "절감 리포트 계산 중 오류가 발생했습니다.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsReportLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, customStreamUrl, defaultSample.fileName, defaultSample.restoredFileName]);

  return (
    <View style={styles.section}>
      <Panel title="원본 360p 영상">
        <Text style={styles.panelText}>
          공개 샘플 영상에서 받은 360p MP4를 로컬 백엔드로 스트리밍합니다. 상단은 실제 저해상도 입력이고, 아래 화면은 같은 장면을 720p 출력 기준으로 보여줍니다.
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
          Demo 복원 출력은 360p 입력을 고화질 출력으로 바꾸는 목표 화면입니다. 발표 안정성을 위해 같은 샘플의 720p 기준 영상을 재생하고, 실제 Native SR 파이프라인은 이 자리에 연결합니다.
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
        <PipelineItem label="전송" value="로컬 백엔드 360p MP4 Range 스트리밍" />
        <PipelineItem label="복원" value="온디바이스 SR 출력 영역으로 전달" />
        <PipelineItem label="출력" value={`절감률 ${demoProfile.trafficSaved}% · 목표 ${demoProfile.fps}FPS`} />
      </Panel>

      <Panel title="실측 절감 리포트">
        <Text style={styles.panelText}>
          백엔드가 실제 영상 파일 크기를 읽어 계산합니다. 720p 복원 결과 파일을 서버에서 직접 전송하는 경우와, 360p 입력만 전송하는 경우를 비교합니다.
        </Text>
        <SavingsReportView report={savingsReport} isLoading={isReportLoading} error={reportError} />
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

function SavingsReportView({
  report,
  isLoading,
  error
}: {
  report: SavingsReport | null;
  isLoading: boolean;
  error: string;
}) {
  if (isLoading) {
    return <Text style={styles.panelText}>실측 리포트를 계산하는 중입니다...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!report) {
    return <Text style={styles.panelText}>사용자 URL 입력 시에는 원본/복원 파일 크기를 비교할 수 없습니다.</Text>;
  }

  return (
    <View style={styles.measurementBox}>
      <Text style={styles.measurementTitle}>전송량 절감 {report.trafficSavedPercent}%</Text>
      <Text style={styles.panelText}>360p 입력: {formatBytes(report.sourceBytes)} · 추정 {report.sourceMbpsAt30Fps}Mbps</Text>
      <Text style={styles.panelText}>720p 복원 출력: {formatBytes(report.restoredBytes)} · 추정 {report.restoredMbpsAt30Fps}Mbps</Text>
      <Text style={styles.panelText}>절감량: {formatBytes(report.savedBytes)} 만큼 서버 전송을 줄이는 구조입니다.</Text>
    </View>
  );
}

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`;
  }
  return `${bytes}B`;
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
