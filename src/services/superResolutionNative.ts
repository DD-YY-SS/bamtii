import { NativeModules, Platform } from "react-native";

type SuperResolutionNativeModule = {
  configure: (options: {
    model: "fsrcnn-int8";
    inputResolution: "360p";
    outputResolution: "720p" | "1080p";
    delegate: "NPU" | "GPU" | "CPU";
  }) => Promise<{ ok: boolean; delegate: string; pipeline: string }>;
  setEnabled: (enabled: boolean) => Promise<{ ok: boolean; enabled: boolean }>;
};

const nativeModule = NativeModules.AiSuperResolution as SuperResolutionNativeModule | undefined;

export async function configureSuperResolution(delegate: "NPU" | "GPU" | "CPU") {
  if (!nativeModule) {
    return {
      ok: false,
      nativeReady: false,
      message:
        Platform.OS === "web"
          ? "Web 환경에서는 Native SR 모듈을 사용할 수 없습니다."
          : "AiSuperResolution Native Module이 아직 Development Build에 연결되지 않았습니다."
    };
  }

  const result = await nativeModule.configure({
    model: "fsrcnn-int8",
    inputResolution: "360p",
    outputResolution: "720p",
    delegate
  });

  await nativeModule.setEnabled(true);

  return {
    ok: result.ok,
    nativeReady: true,
    message: `${result.pipeline} 활성화 (${result.delegate})`
  };
}
