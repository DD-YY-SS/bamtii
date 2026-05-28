export const streams = [
  {
    id: "urban-night-drive",
    title: "Urban Night Drive",
    description: "8K 원본 기반 도심 야간 주행 데모",
    durationSeconds: 760,
    qualities: ["360p", "720p", "1080p"],
    defaultQuality: "1080p",
    posterColor: "#88E0C0"
  },
  {
    id: "mountain-relay-live",
    title: "Mountain Relay Live",
    description: "5G 음영 지역 네트워크 복원 테스트",
    durationSeconds: 492,
    qualities: ["360p", "720p", "1080p"],
    defaultQuality: "1080p",
    posterColor: "#F2D77C"
  },
  {
    id: "crowd-concert-cam",
    title: "Crowd Concert Cam",
    description: "인파 밀집 지역 ABR 전환 시나리오",
    durationSeconds: 1083,
    qualities: ["360p", "720p", "1080p"],
    defaultQuality: "1080p",
    posterColor: "#285F5C"
  }
];

export function findStream(streamId) {
  return streams.find((stream) => stream.id === streamId);
}
