import { Pressable, Text, View } from "react-native";
import { HeroPlayer } from "../components/HeroPlayer";
import { Panel } from "../components/Panel";
import { StatTile } from "../components/StatTile";
import { contentList } from "../constants/appData";
import { styles } from "../styles/styles";
import type { AnimatedStyle, NetworkProfile, Screen } from "../types/app";

export function HomeScreen({
  profile,
  selectedContent,
  setSelectedContent,
  setProgress,
  setScreen,
  progress,
  shouldUpscale,
  effectiveQuality,
  effectiveSavings,
  isPlaying,
  scanStyle,
  glowStyle,
  onPlayToggle,
  abrDecision
}: {
  profile: NetworkProfile;
  selectedContent: number;
  setSelectedContent: (index: number) => void;
  setProgress: (value: number) => void;
  setScreen: (screen: Screen) => void;
  progress: number;
  shouldUpscale: boolean;
  effectiveQuality: string;
  effectiveSavings: number;
  isPlaying: boolean;
  scanStyle: AnimatedStyle;
  glowStyle: AnimatedStyle;
  onPlayToggle: () => void;
  abrDecision: string;
}) {
  return (
    <View style={styles.section}>
      <HeroPlayer
        title={contentList[selectedContent].title}
        profile={profile}
        progress={progress}
        shouldUpscale={shouldUpscale}
        effectiveQuality={effectiveQuality}
        isPlaying={isPlaying}
        scanStyle={scanStyle}
        glowStyle={glowStyle}
        onPlayToggle={onPlayToggle}
        onOpenWatch={() => setScreen("convert")}
      />

      <View style={styles.quickGrid}>
        <StatTile label="현재 수신" value={profile.serverQuality} tone="warm" />
        <StatTile label="화면 출력" value={effectiveQuality} tone="mint" />
        <StatTile label="절감률" value={`${effectiveSavings}%`} tone="mint" />
        <StatTile label="추론" value={shouldUpscale ? `${profile.inference}ms` : "off"} tone="ink" />
      </View>

      <Panel title="오늘의 추천 스트림">
        {contentList.map((item, index) => (
          <Pressable
            key={item.title}
            onPress={() => {
              setSelectedContent(index);
              setProgress(7);
              setScreen("convert");
            }}
            style={[styles.contentRow, selectedContent === index && styles.contentRowActive]}
          >
            <View style={styles.thumbnail}>
              <Text style={styles.thumbnailText}>{index + 1}</Text>
            </View>
            <View style={styles.contentCopy}>
              <Text style={styles.contentTitle}>{item.title}</Text>
              <Text style={styles.contentMeta}>{item.meta}</Text>
            </View>
            <Text style={styles.contentLength}>{item.length}</Text>
          </Pressable>
        ))}
      </Panel>

      <Panel title="실시간 ABR 판단">
        <Text style={styles.panelText}>{abrDecision}</Text>
      </Panel>
    </View>
  );
}
