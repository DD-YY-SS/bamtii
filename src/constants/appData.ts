import type { BoostLevel, Delegate, NavItem, NetworkMode, NetworkProfile, Screen } from "../types/app";

export const networkProfiles: Record<NetworkMode, NetworkProfile> = {
  shade: {
    label: "5G 음영",
    bandwidth: 1.2,
    latency: 78,
    jitter: 18,
    packetDrop: 7.4,
    serverQuality: "360p",
    renderQuality: "720p",
    trafficSaved: 65,
    inference: 30,
    fps: 31,
    status: "AI 복원 권장"
  },
  crowd: {
    label: "혼잡 지역",
    bandwidth: 1.8,
    latency: 48,
    jitter: 11,
    packetDrop: 3.8,
    serverQuality: "360p",
    renderQuality: "720p+",
    trafficSaved: 62,
    inference: 27,
    fps: 34,
    status: "360p 전송 전환"
  },
  normal: {
    label: "고속망",
    bandwidth: 8.6,
    latency: 17,
    jitter: 3,
    packetDrop: 0.5,
    serverQuality: "1080p",
    renderQuality: "Native",
    trafficSaved: 0,
    inference: 0,
    fps: 60,
    status: "원본 스트림 유지"
  }
};

export const contentList = [
  { id: "urban-night-drive", title: "Demo 360p Stream", meta: "자체 HLS 기반 시연", length: "00:30" },
  { id: "mountain-relay-live", title: "Low Bandwidth Sample", meta: "2Mbps 이하 테스트", length: "00:30" },
  { id: "crowd-concert-cam", title: "Crowd Network Sample", meta: "혼잡 지역 ABR 테스트", length: "00:30" }
];

export const navItems: NavItem[] = [
  { key: "youtube", label: "실측", icon: "YT" },
  { key: "convert", label: "변환", icon: "AI" },
  { key: "settings", label: "설정", icon: "SET" }
];

export function screenTitle(screen: Screen) {
  switch (screen) {
    case "youtube":
      return "YouTube 실측";
    case "convert":
      return "영상 고화질 변환";
    case "settings":
      return "환경 설정";
  }
}

export function boostDescription(level: BoostLevel) {
  if (level === "sharp") {
    return "선명 모드: 경계와 질감을 더 강하게 복원합니다.";
  }
  if (level === "battery") {
    return "저전력 모드: 발열과 배터리 소모를 줄이는 설정입니다.";
  }
  return "균형 모드: 화질, 추론 속도, 발열 사이의 균형을 우선합니다.";
}

export function delegateDescription(delegate: Delegate) {
  if (delegate === "GPU") {
    return "GPU Delegate: 넓은 호환성과 안정적인 실시간 렌더링에 유리합니다.";
  }
  if (delegate === "CPU") {
    return "CPU Fallback: 가속기 사용이 어려운 환경에서만 사용합니다.";
  }
  return "NPU Delegate: 스마트폰 AI 가속기를 우선 사용해 CPU 부담과 발열을 줄입니다.";
}
