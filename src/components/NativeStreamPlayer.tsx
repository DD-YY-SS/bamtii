import { useMemo } from "react";
import { Text, TextInput, View } from "react-native";
import WebView from "react-native-webview/lib/WebView";
import { contentList } from "../constants/appData";
import { styles } from "../styles/styles";

export function NativeStreamPlayer({
  apiBaseUrl,
  streamUrl,
  setStreamUrl,
  selectedContent
}: {
  apiBaseUrl: string;
  streamUrl: string;
  setStreamUrl: (value: string) => void;
  selectedContent: number;
  paused: boolean;
}) {
  const defaultStreamUrl = useMemo(() => {
    const streamId = contentList[selectedContent].id;
    const base = apiBaseUrl.trim().replace(/\/$/, "");
    return `${base}/api/streams/${streamId}/master.m3u8?bandwidthMbps=1.4&latencyMs=72&packetDropPercent=5&jitterMs=16`;
  }, [apiBaseUrl, selectedContent]);

  const effectiveUrl = streamUrl.trim() || defaultStreamUrl;

  return (
    <View>
      <Text style={styles.panelText}>
        자체 HLS/MP4 360p 영상을 입력해 재생합니다. iOS 발표 빌드 안정성을 위해 네이티브 비디오 모듈 대신 WebView video 플레이어를 사용합니다.
      </Text>
      <TextInput
        value={streamUrl}
        onChangeText={setStreamUrl}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        placeholder={defaultStreamUrl}
        placeholderTextColor="#8A948E"
        style={styles.urlInput}
      />
      <View style={styles.nativeVideoShell}>
        <WebView
          originWhitelist={["*"]}
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          javaScriptEnabled
          mediaPlaybackRequiresUserAction={false}
          source={{ html: createVideoHtml(effectiveUrl) }}
          style={styles.nativeVideo}
        />
      </View>
      <View style={styles.measurementBox}>
        <Text style={styles.measurementTitle}>AI 복원 파이프라인 연결 지점</Text>
        <Text style={styles.panelText}>
          현재 화면은 360p 스트림 수신과 복원 출력 흐름을 시연합니다. 실제 실시간 복원은 iOS Core ML Native Module에서 decoded frame을 받아 처리하는
          단계로 확장합니다.
        </Text>
      </View>
    </View>
  );
}

function createVideoHtml(videoUrl: string) {
  const escapedUrl = videoUrl.replace(/"/g, "&quot;");

  return `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: #0C2422;
        overflow: hidden;
      }
      .wrap {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle at 80% 10%, rgba(185,246,211,0.18), transparent 30%), #0C2422;
      }
      video {
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #0C2422;
      }
      .badge {
        position: absolute;
        top: 12px;
        left: 12px;
        padding: 7px 10px;
        border-radius: 999px;
        background: rgba(185,246,211,0.94);
        color: #08231F;
        font: 800 12px -apple-system, BlinkMacSystemFont, sans-serif;
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <video src="${escapedUrl}" controls playsinline webkit-playsinline preload="metadata"></video>
      <div class="badge">360p 수신 · AI 복원 준비</div>
    </div>
  </body>
</html>`;
}
