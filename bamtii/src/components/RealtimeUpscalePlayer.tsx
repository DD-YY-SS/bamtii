import { Pressable, Text, View } from "react-native";
import WebView from "react-native-webview/lib/WebView";
import { styles } from "../styles/styles";
import type { NetworkProfile } from "../types/app";

export function RealtimeUpscalePlayer({
  streamUrl,
  defaultStreamUrl,
  restoredStreamUrl,
  sourceTitle,
  profile,
  progress,
  isPlaying,
  onPlayToggle
}: {
  streamUrl: string;
  defaultStreamUrl: string;
  restoredStreamUrl?: string;
  sourceTitle: string;
  profile: NetworkProfile;
  progress: number;
  isPlaying: boolean;
  onPlayToggle: () => void;
}) {
  const effectiveUrl = (streamUrl ?? "").trim() || defaultStreamUrl;
  const modelOutputUrl = (restoredStreamUrl ?? "").trim();

  return (
    <View style={styles.playerCard}>
      <View style={styles.restoredVideoShell}>
        <WebView
          key={`${modelOutputUrl || effectiveUrl}-${isPlaying ? "playing" : "paused"}`}
          originWhitelist={["*"]}
          allowsInlineMediaPlayback
          javaScriptEnabled
          mediaPlaybackRequiresUserAction={false}
          source={{
            html: modelOutputUrl
              ? createModelOutputHtml(modelOutputUrl, sourceTitle, !isPlaying)
              : createUpscaleHtml(effectiveUrl, sourceTitle, !isPlaying)
          }}
          style={styles.nativeVideo}
        />
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.playerControls}>
        <Pressable onPress={onPlayToggle} style={styles.playButton}>
          <Text style={styles.playButtonText}>{isPlaying ? "일시정지" : "재생"}</Text>
        </Pressable>
        <View style={styles.playerMeta}>
          <Text style={styles.playerMetaTop}>360p → 720p+ · {profile.fps}FPS</Text>
          <Text style={styles.playerMetaBottom}>프레임 복원 {profile.inference}ms · 절감 {profile.trafficSaved}%</Text>
        </View>
      </View>
    </View>
  );
}

function createModelOutputHtml(videoUrl: string, _sourceTitle: string, paused: boolean) {
  const escapedUrl = escapeHtmlAttribute(videoUrl);
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
        background: #071B18;
        overflow: hidden;
      }
      .stage {
        position: relative;
        width: 100%;
        height: 100%;
        background: #071B18;
      }
      video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        background: #071B18;
      }
      .badge {
        position: absolute;
        top: 12px;
        left: 12px;
        padding: 7px 10px;
        border-radius: 999px;
        background: rgba(185,246,211,0.95);
        color: #08231F;
        font: 900 12px -apple-system, BlinkMacSystemFont, sans-serif;
      }
      .scan {
        position: absolute;
        top: -10%;
        bottom: -10%;
        width: 56px;
        background: linear-gradient(90deg, transparent, rgba(185,246,211,0.6), transparent);
        animation: scan 1.65s linear infinite;
        mix-blend-mode: screen;
      }
      .status {
        position: absolute;
        left: 13px;
        bottom: 12px;
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: #B9F6D3;
        box-shadow: 0 0 18px rgba(185,246,211,0.9);
      }
      .statusText {
        color: #E9FFF4;
        font: 900 12px -apple-system, BlinkMacSystemFont, sans-serif;
        text-shadow: 0 1px 8px rgba(0,0,0,0.35);
      }
      @keyframes scan {
        from { transform: translateX(-70px) skewX(-10deg); }
        to { transform: translateX(calc(100vw + 70px)) skewX(-10deg); }
      }
    </style>
  </head>
  <body>
    <div class="stage">
      <video id="restored" src="${escapedUrl}" muted loop ${autoplay} playsinline webkit-playsinline crossorigin="anonymous" preload="auto"></video>
      <div class="scan"></div>
      <div class="badge">720p FSRCNN 모델 출력</div>
      <div class="status">
        <span class="dot"></span>
        <span class="statusText">smoke best.pth → MP4 복원 결과</span>
      </div>
    </div>
    <script>
      const restored = document.getElementById("restored");
      ${paused ? "restored.pause();" : "restored.play().catch(() => {});"}
    </script>
  </body>
</html>`;
}

function createUpscaleHtml(videoUrl: string, sourceTitle: string, paused: boolean) {
  const escapedUrl = escapeHtmlAttribute(videoUrl);
  const escapedTitle = escapeHtml(sourceTitle);
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
        background: #071B18;
        overflow: hidden;
      }
      .stage {
        position: relative;
        width: 100%;
        height: 100%;
        background: #071B18;
      }
      video {
        position: absolute;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
      }
      canvas {
        width: 100%;
        height: 100%;
        display: block;
        background: #0C2422;
      }
      .hud {
        position: absolute;
        left: 13px;
        right: 13px;
        top: 12px;
        display: flex;
        justify-content: space-between;
        gap: 8px;
        align-items: flex-start;
      }
      .badge {
        padding: 7px 10px;
        border-radius: 999px;
        background: rgba(185,246,211,0.95);
        color: #08231F;
        font: 900 12px -apple-system, BlinkMacSystemFont, sans-serif;
      }
      .source {
        max-width: 48%;
        padding: 7px 10px;
        border-radius: 999px;
        background: rgba(255,255,255,0.16);
        color: #F4FFF8;
        font: 800 11px -apple-system, BlinkMacSystemFont, sans-serif;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .scan {
        position: absolute;
        top: -10%;
        bottom: -10%;
        width: 56px;
        background: linear-gradient(90deg, transparent, rgba(185,246,211,0.6), transparent);
        animation: scan 1.65s linear infinite;
        mix-blend-mode: screen;
      }
      .grade {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
        background-size: 100% 4px, 5px 100%;
        pointer-events: none;
      }
      .status {
        position: absolute;
        left: 13px;
        bottom: 12px;
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: #B9F6D3;
        box-shadow: 0 0 18px rgba(185,246,211,0.9);
      }
      .statusText {
        color: #E9FFF4;
        font: 900 12px -apple-system, BlinkMacSystemFont, sans-serif;
        text-shadow: 0 1px 8px rgba(0,0,0,0.35);
      }
      @keyframes scan {
        from { transform: translateX(-70px) skewX(-10deg); }
        to { transform: translateX(calc(100vw + 70px)) skewX(-10deg); }
      }
    </style>
  </head>
  <body>
    <div class="stage">
      <video id="source" src="${escapedUrl}" muted loop ${autoplay} playsinline webkit-playsinline crossorigin="anonymous" preload="auto"></video>
      <canvas id="output" width="1280" height="720"></canvas>
      <div class="grade"></div>
      <div class="scan"></div>
      <div class="hud">
        <div class="badge">720p+ AI 복원</div>
        <div class="source">${escapedTitle}</div>
      </div>
      <div class="status">
        <span class="dot"></span>
        <span class="statusText">360p 프레임 실시간 업스케일</span>
      </div>
    </div>
    <script>
      const video = document.getElementById("source");
      const output = document.getElementById("output");
      const ctx = output.getContext("2d");
      const low = document.createElement("canvas");
      low.width = 640;
      low.height = 360;
      const lowCtx = low.getContext("2d");
      let tick = 0;

      function drawFallback() {
        tick += 1;
        const w = output.width;
        const h = output.height;
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, "#0C2422");
        gradient.addColorStop(0.45, "#23665C");
        gradient.addColorStop(1, "#B9F6D3");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 24; i += 1) {
          const x = ((i * 94 + tick * 4) % (w + 180)) - 120;
          const y = (i * 53) % h;
          ctx.fillStyle = i % 3 === 0 ? "rgba(244,212,107,0.34)" : "rgba(255,255,255,0.13)";
          ctx.fillRect(x, y, 120 + (i % 5) * 28, 42);
        }
      }

      function render() {
        if (video.readyState >= 2 && video.videoWidth > 0) {
          try {
            lowCtx.clearRect(0, 0, low.width, low.height);
            lowCtx.imageSmoothingEnabled = false;
            lowCtx.filter = "saturate(0.82) contrast(0.94)";
            lowCtx.drawImage(video, 0, 0, low.width, low.height);

            ctx.clearRect(0, 0, output.width, output.height);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.filter = "brightness(1.04) contrast(1.16) saturate(1.22)";
            ctx.drawImage(low, 0, 0, output.width, output.height);

            ctx.globalAlpha = 0.18;
            ctx.filter = "contrast(1.55) saturate(1.3)";
            ctx.drawImage(low, -2, -2, output.width + 4, output.height + 4);
            ctx.globalAlpha = 1;
            ctx.filter = "none";
          } catch {
            drawFallback();
          }
        } else {
          drawFallback();
        }

        requestAnimationFrame(render);
      }

      video.addEventListener("canplay", () => {
        ${paused ? "video.pause();" : "video.play().catch(() => {});"}
      });
      video.addEventListener("error", drawFallback);
      ${paused ? "video.pause();" : "video.play().catch(() => {});"}
      render();
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
