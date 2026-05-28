import { Animated, Pressable, Text, View } from "react-native";
import { styles } from "../styles/styles";
import type { AnimatedStyle, NetworkProfile } from "../types/app";

export function HeroPlayer({
  title,
  profile,
  progress,
  shouldUpscale,
  effectiveQuality,
  isPlaying,
  scanStyle,
  glowStyle,
  onPlayToggle,
  onOpenWatch
}: {
  title: string;
  profile: NetworkProfile;
  progress: number;
  shouldUpscale: boolean;
  effectiveQuality: string;
  isPlaying: boolean;
  scanStyle: AnimatedStyle;
  glowStyle: AnimatedStyle;
  onPlayToggle: () => void;
  onOpenWatch?: () => void;
}) {
  return (
    <View style={styles.playerCard}>
      <View style={styles.playerSurface}>
        <Animated.View style={[styles.glowOrb, glowStyle]} />
        <View style={styles.videoMosaic}>
          {Array.from({ length: 48 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.videoPixel,
                {
                  backgroundColor: index % 4 === 0 ? "#88E0C0" : index % 4 === 1 ? "#285F5C" : index % 4 === 2 ? "#F2D77C" : "#143331",
                  opacity: shouldUpscale ? 0.42 + (index % 5) * 0.08 : 0.32
                }
              ]}
            />
          ))}
        </View>
        {shouldUpscale && <Animated.View style={[styles.aiScan, scanStyle]} />}
        <View style={styles.playerOverlay}>
          <View style={styles.streamBadges}>
            <Text style={styles.streamBadge}>{profile.serverQuality} 수신</Text>
            <Text style={styles.streamBadge}>{effectiveQuality} 출력</Text>
          </View>
          <Text style={styles.videoTitle}>{title}</Text>
          <Text style={styles.videoSubTitle}>
            {shouldUpscale ? "온디바이스 AI가 실시간 화질을 복원 중입니다." : "원본 스트림을 안정적으로 재생 중입니다."}
          </Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.playerControls}>
        <Pressable onPress={onPlayToggle} style={styles.playButton}>
          <Text style={styles.playButtonText}>{isPlaying ? "일시정지" : "재생"}</Text>
        </Pressable>
        <View style={styles.playerMeta}>
          <Text style={styles.playerMetaTop}>
            {profile.bandwidth}Mbps · {profile.fps}FPS+
          </Text>
          <Text style={styles.playerMetaBottom}>추론 {shouldUpscale ? `${profile.inference}ms` : "off"}</Text>
        </View>
        {onOpenWatch && (
          <Pressable onPress={onOpenWatch} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>전체 제어</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
