import { useMemo } from "react";
import { Text, TextInput, View } from "react-native";
import WebView from "react-native-webview/lib/WebView";
import { styles } from "../styles/styles";

export function NativeStreamPlayer({
  streamUrl,
  setStreamUrl,
  defaultStreamUrl,
  sourceLabel,
  paused
}: {
  streamUrl: string;
  setStreamUrl: (value: string) => void;
  defaultStreamUrl: string;
  sourceLabel: string;
  paused: boolean;
}) {
  const effectiveUrl = useMemo(() => (streamUrl ?? "").trim() || defaultStreamUrl, [defaultStreamUrl, streamUrl]);

  return (
    <View>
      <Text style={styles.panelText}>
        상단 입력은 실제 360p 샘플 스트림입니다. URL을 바꾸면 아래 복원 출력도 같은 영상을 즉시 사용합니다.
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
          key={`${effectiveUrl}-${paused ? "paused" : "playing"}`}
          originWhitelist={["*"]}
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          javaScriptEnabled
          mediaPlaybackRequiresUserAction={false}
          source={{ html: createVideoHtml(effectiveUrl, sourceLabel, paused) }}
          style={styles.nativeVideo}
        />
      </View>
      <View style={styles.measurementBox}>
        <Text style={styles.measurementTitle}>입력 소스: {sourceLabel}</Text>
        <Text style={styles.panelText}>
          현재 URL의 프레임을 아래 720p+ 캔버스 복원 파이프라인으로 전달합니다.
        </Text>
      </View>
    </View>
  );
}

function createVideoHtml(videoUrl: string, sourceLabel: string, paused: boolean) {
  const escapedUrl = escapeHtmlAttribute(videoUrl);
  const escapedLabel = escapeHtml(sourceLabel);
  const autoplay = paused ? "" : "autoplay";

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
      .source {
        position: absolute;
        right: 12px;
        bottom: 12px;
        max-width: calc(100% - 24px);
        padding: 7px 10px;
        border-radius: 999px;
        background: rgba(8,35,31,0.74);
        color: #E9FFF4;
        font: 800 12px -apple-system, BlinkMacSystemFont, sans-serif;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <video id="source" src="${escapedUrl}" controls muted loop ${autoplay} playsinline webkit-playsinline crossorigin="anonymous" preload="auto"></video>
      <div class="badge">360p 입력</div>
      <div class="source">${escapedLabel}</div>
    </div>
    <script>
      const source = document.getElementById("source");
      ${paused ? "source.pause();" : "source.play().catch(() => {});"}
    </script>
  </body>
</html>`;
}

function escapeHtmlAttribute(value: string) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtml(value: string) {
  return escapeHtmlAttribute(value).replace(/'/g, "&#39;");
}
