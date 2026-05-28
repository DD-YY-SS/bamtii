import { Linking, Pressable, Text, View } from "react-native";
import WebView from "react-native-webview/lib/WebView";
import { styles } from "../styles/styles";

export function YouTubeComparison({ youtubeUrl }: { youtubeUrl: string }) {
  const embedUrl = toYouTubeEmbedUrl(youtubeUrl);

  if (!embedUrl) {
    return (
      <View style={styles.youtubeFallback}>
        <Text style={styles.youtubeFallbackTitle}>YouTube URL을 확인해주세요.</Text>
        <Text style={styles.panelText}>예: https://www.youtube.com/watch?v=aqz-KE-bpKQ</Text>
      </View>
    );
  }

  return (
    <View style={styles.compareStack}>
      <View style={styles.compareVideoCard}>
        <Text style={styles.compareHeader}>깍두기 절단기 적용: 360p 수신 → 720p+ 복원</Text>
        <View style={styles.compareVideoFrame}>
          <WebView source={{ uri: embedUrl }} allowsFullscreenVideo javaScriptEnabled domStorageEnabled allowsInlineMediaPlayback style={styles.compareWebView} />
          <View pointerEvents="none" style={styles.enhancedOverlay}>
            <Text style={styles.enhancedBadge}>FSRCNN INT8 · NPU · 30FPS+</Text>
            <View style={styles.sharpScan} />
          </View>
        </View>
      </View>

      <View style={styles.compareVideoCard}>
        <Text style={styles.compareHeader}>미적용: 제한망에서 360p 저화질/버퍼링</Text>
        <View style={styles.compareVideoFrame}>
          <WebView source={{ uri: embedUrl }} allowsFullscreenVideo javaScriptEnabled domStorageEnabled allowsInlineMediaPlayback style={styles.compareWebViewDimmed} />
          <View pointerEvents="none" style={styles.degradedOverlay}>
            {Array.from({ length: 36 }).map((_, index) => (
              <View key={index} style={[styles.degradedPixel, { opacity: 0.12 + (index % 4) * 0.04 }]} />
            ))}
            <View style={styles.bufferCard}>
              <Text style={styles.bufferTitle}>버퍼링...</Text>
              <Text style={styles.bufferText}>1Mbps 제한 · 패킷 드랍 증가 · 화질 저하</Text>
            </View>
          </View>
        </View>
      </View>

      <Pressable style={styles.youtubeOpenButton} onPress={() => Linking.openURL(youtubeUrl)}>
        <Text style={styles.youtubeOpenButtonText}>원본 YouTube 열기</Text>
      </Pressable>
    </View>
  );
}

function toYouTubeEmbedUrl(url: string) {
  const videoId = extractVideoId(url);
  if (!videoId) {
    return "";
  }
  return `https://www.youtube.com/embed/${videoId}?playsinline=1&autoplay=0&mute=1&modestbranding=1&rel=0&enablejsapi=1&origin=https://www.youtube.com`;
}

function extractVideoId(rawUrl: string) {
  const value = rawUrl.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "").slice(0, 11);
    }
    if (url.searchParams.get("v")) {
      return url.searchParams.get("v")?.slice(0, 11) ?? "";
    }
    const shortsMatch = url.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) {
      return shortsMatch[1];
    }
    const embedMatch = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) {
      return embedMatch[1];
    }
  } catch {
    return "";
  }

  return "";
}
