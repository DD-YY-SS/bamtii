# AiSuperResolution Native Module Spec

이 문서는 `src/services/superResolutionNative.ts`가 호출하는 네이티브 모듈의 구현 계약입니다.

## 목적

Development Build에서 자체 HLS/MP4 스트림을 네이티브 플레이어가 디코딩한 뒤, 360p 프레임 또는 GPU texture를 Super Resolution 파이프라인으로 넘겨 720p/1080p 렌더 타깃에 출력합니다.

## JavaScript Interface

```ts
NativeModules.AiSuperResolution.configure({
  model: "fsrcnn-int8",
  inputResolution: "360p",
  outputResolution: "720p",
  delegate: "NPU" | "GPU" | "CPU"
});

NativeModules.AiSuperResolution.setEnabled(true);
```

## Android 권장 구조

- Decoder: ExoPlayer 또는 MediaCodec 기반 decoded frame 획득
- Compute: Vulkan compute shader, OpenGL ES fragment shader, NNAPI delegate 또는 TFLite GPU delegate
- Model: FSRCNN INT8 TFLite
- Render: SurfaceTexture 또는 TextureView에 업스케일된 frame 출력

## iOS 권장 구조

- Decoder: AVPlayerItemVideoOutput 또는 custom AVSampleBufferDisplayLayer
- Compute: Metal Performance Shaders, Metal compute kernel, Core ML 또는 TFLite Metal delegate
- Model: FSRCNN INT8 또는 Core ML 변환 모델
- Render: MTKView에 업스케일된 texture 출력

## 현재 MVP 상태

현재 앱에는 Native Module 호출부와 WebView 기반 HLS/MP4 플레이어가 연결되어 있습니다.
실제 C++/Metal/Vulkan SR 커널은 Development Build 네이티브 프로젝트 생성 후 구현해야 합니다.
