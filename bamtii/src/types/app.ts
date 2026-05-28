import type { Animated, ViewStyle } from "react-native";

export type Screen = "youtube" | "convert" | "settings";
export type NetworkMode = "shade" | "crowd" | "normal";
export type BoostLevel = "balanced" | "sharp" | "battery";
export type Delegate = "NPU" | "GPU" | "CPU";
export type ThrottleMode = "off" | "2mbps" | "1mbps" | "0_6mbps";

export type NetworkProfile = {
  label: string;
  bandwidth: number;
  latency: number;
  jitter: number;
  packetDrop: number;
  serverQuality: string;
  renderQuality: string;
  trafficSaved: number;
  inference: number;
  fps: number;
  status: string;
};

export type MeasurementResult = {
  measuredAt: string;
  bandwidthMbps: number;
  latencyMs: number;
  jitterMs: number;
  packetDropPercent: number;
  downloadedBytes: number;
  durationMs: number;
  successfulSamples: number;
  totalSamples: number;
  backendMode?: string;
  backendServerQuality?: string;
  backendTargetQuality?: string;
  backendTrafficSavedPercent?: number;
  backendInferenceMs?: number;
};

export type ContentItem = {
  id: string;
  title: string;
  meta: string;
  length: string;
};

export type NavItem = {
  key: Screen;
  label: string;
  icon: string;
};

export type AnimatedStyle = Animated.WithAnimatedObject<ViewStyle>;
