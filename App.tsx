import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, SafeAreaView, ScrollView, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppHeader } from "./src/components/AppHeader";
import { BottomNav } from "./src/components/BottomNav";
import { contentList, networkProfiles } from "./src/constants/appData";
import { measureNetworkAndSendTelemetry } from "./src/services/backendApi";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { VideoConvertScreen } from "./src/screens/VideoConvertScreen";
import { YouTubeMeasureScreen } from "./src/screens/YouTubeMeasureScreen";
import { styles } from "./src/styles/styles";
import type { Delegate, MeasurementResult, NetworkMode, NetworkProfile, Screen, ThrottleMode } from "./src/types/app";

export default function App() {
  const [screen, setScreen] = useState<Screen>("youtube");
  const [networkMode, setNetworkMode] = useState<NetworkMode>("crowd");
  const [aiBoost, setAiBoost] = useState(true);
  const [dataSaver, setDataSaver] = useState(true);
  const [autoAbr, setAutoAbr] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [delegate, setDelegate] = useState<Delegate>("NPU");
  const [selectedContent] = useState(0);
  const [progress, setProgress] = useState(34);
  const [apiBaseUrl, setApiBaseUrl] = useState("http://127.0.0.1:4000");
  const [youtubeUrl, setYoutubeUrl] = useState("https://www.youtube.com/watch?v=aqz-KE-bpKQ");
  const [nativeStreamUrl, setNativeStreamUrl] = useState("");
  const [throttleMode, setThrottleMode] = useState<ThrottleMode>("off");
  const [measurement, setMeasurement] = useState<MeasurementResult | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [isRealtimeMeasuring, setIsRealtimeMeasuring] = useState(false);
  const [measurementError, setMeasurementError] = useState("");

  const scan = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const measurementInFlight = useRef(false);

  const profile = useMemo(() => createRuntimeProfile(networkProfiles[networkMode], measurement), [measurement, networkMode]);
  const shouldUpscale = aiBoost && (profile.bandwidth <= 2 || profile.serverQuality === "360p");

  useEffect(() => {
    Animated.loop(
      Animated.timing(scan, {
        toValue: 1,
        duration: shouldUpscale ? 1800 : 2800,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        })
      ])
    ).start();
  }, [glow, scan, shouldUpscale]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = setInterval(() => {
      setProgress((value) => (value >= 96 ? 7 : value + 1));
    }, 900);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const scanStyle = {
    transform: [{ translateX: scan.interpolate({ inputRange: [0, 1], outputRange: [-120, 340] }) }],
    opacity: scan.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.1, 0.75, 0.1] })
  };

  const glowStyle = {
    transform: [{ scale: glow.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.05] }) }],
    opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.6] })
  };

  const runMeasurement = useCallback(async () => {
    if (measurementInFlight.current) {
      return;
    }

    measurementInFlight.current = true;
    setIsMeasuring(true);
    setMeasurementError("");

    try {
      const result = await measureNetworkAndSendTelemetry({
        apiBaseUrl,
        streamId: contentList[selectedContent].id,
        delegate,
        throttleMode
      });
      setMeasurement(result);
      setNetworkMode(result.bandwidthMbps <= 2 ? "crowd" : "normal");
    } catch (error) {
      setMeasurementError(error instanceof Error ? error.message : "네트워크 실측 중 오류가 발생했습니다.");
    } finally {
      measurementInFlight.current = false;
      setIsMeasuring(false);
    }
  }, [apiBaseUrl, delegate, selectedContent, throttleMode]);

  useEffect(() => {
    if (!isRealtimeMeasuring) {
      return;
    }

    runMeasurement();
    const timer = setInterval(() => {
      runMeasurement();
    }, 5000);

    return () => clearInterval(timer);
  }, [isRealtimeMeasuring, runMeasurement]);

  return (
    <LinearGradient colors={["#061212", "#10312C", "#F4F2E6"]} style={styles.shell}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>
        <AppHeader screen={screen} profile={profile} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {screen === "youtube" && (
            <YouTubeMeasureScreen
              youtubeUrl={youtubeUrl}
              measurement={measurement}
              isMeasuring={isMeasuring}
              isRealtimeMeasuring={isRealtimeMeasuring}
              setIsRealtimeMeasuring={setIsRealtimeMeasuring}
              measurementError={measurementError}
              onMeasure={runMeasurement}
            />
          )}

          {screen === "convert" && (
            <VideoConvertScreen
              profile={profile}
              selectedContent={selectedContent}
              progress={progress}
              shouldUpscale={shouldUpscale}
              isPlaying={isPlaying}
              scanStyle={scanStyle}
              glowStyle={glowStyle}
              onPlayToggle={() => setIsPlaying((value) => !value)}
              nativeStreamUrl={nativeStreamUrl}
              setNativeStreamUrl={setNativeStreamUrl}
              apiBaseUrl={apiBaseUrl}
              measurement={measurement}
              isMeasuring={isMeasuring}
              measurementError={measurementError}
              onMeasure={runMeasurement}
            />
          )}

          {screen === "settings" && (
            <SettingsScreen
              delegate={delegate}
              setDelegate={setDelegate}
              aiBoost={aiBoost}
              setAiBoost={setAiBoost}
              dataSaver={dataSaver}
              setDataSaver={setDataSaver}
              autoAbr={autoAbr}
              setAutoAbr={setAutoAbr}
              apiBaseUrl={apiBaseUrl}
              setApiBaseUrl={setApiBaseUrl}
              throttleMode={throttleMode}
              setThrottleMode={setThrottleMode}
            />
          )}
        </ScrollView>

        <BottomNav screen={screen} setScreen={setScreen} />
      </SafeAreaView>
    </LinearGradient>
  );
}

function createRuntimeProfile(baseProfile: NetworkProfile, measurement: MeasurementResult | null): NetworkProfile {
  if (!measurement) {
    return baseProfile;
  }

  const congested = measurement.bandwidthMbps <= 2 || measurement.latencyMs >= 60 || measurement.packetDropPercent >= 3 || measurement.jitterMs >= 15;

  return {
    ...baseProfile,
    label: "실측망",
    bandwidth: measurement.bandwidthMbps,
    latency: measurement.latencyMs,
    jitter: measurement.jitterMs,
    packetDrop: measurement.packetDropPercent,
    serverQuality: measurement.backendServerQuality ?? (congested ? "360p" : "1080p"),
    renderQuality: measurement.backendTargetQuality ?? (congested ? "720p+" : "Native"),
    trafficSaved: measurement.backendTrafficSavedPercent ?? (congested ? 62 : 0),
    inference: measurement.backendInferenceMs ?? (congested ? 27 : 0),
    fps: congested ? 34 : 60,
    status: measurement.backendMode === "EDGE_AI_RESTORE" ? "실측 기반 AI 복원" : "실측 기반 원본 유지"
  };
}
