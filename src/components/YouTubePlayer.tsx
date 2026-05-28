import { Text, View } from "react-native";
import WebView from "react-native-webview/lib/WebView";
import { styles } from "../styles/styles";

export function YouTubePlayer({ youtubeUrl }: { youtubeUrl: string }) {
  const embedUrl = toYouTubeEmbedUrl(youtubeUrl);

  if (!embedUrl) {
    return (
      <View style={styles.youtubeFallback}>
        <Text style={styles.youtubeFallbackTitle}>YouTube URL을 확인해주세요.</Text>
        <Text style={styles.panelText}>기본 공개 테스트 영상 링크를 사용합니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.youtubeShell}>
      <WebView
        source={{ uri: embedUrl }}
        allowsFullscreenVideo
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        originWhitelist={["*"]}
        style={styles.youtubeWebView}
        renderError={() => <YouTubeFallback />}
      />
    </View>
  );
}

function toYouTubeEmbedUrl(url: string) {
  const videoId = extractVideoId(url);
  if (!videoId) {
    return "";
  }
  return `https://www.youtube.com/embed/${videoId}?playsinline=1&autoplay=0&modestbranding=1&rel=0&enablejsapi=1&origin=https://www.youtube.com`;
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

function YouTubeFallback() {
  return (
    <View style={styles.youtubeFallback}>
      <Text style={styles.youtubeFallbackTitle}>YouTube 임베드 재생이 차단됐습니다.</Text>
      <Text style={styles.panelText}>WebView 임베드 제한이 발생해도 네트워크 실측은 계속 진행할 수 있습니다.</Text>
    </View>
  );
}
