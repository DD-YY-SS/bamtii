import { Text, TextInput, View } from "react-native";
import { Panel } from "../components/Panel";
import { PipelineItem } from "../components/PipelineItem";
import { SegmentedControl } from "../components/SegmentedControl";
import { ThrottleControl } from "../components/ThrottleControl";
import { ToggleRow } from "../components/ToggleRow";
import { delegateDescription } from "../constants/appData";
import { styles } from "../styles/styles";
import type { Delegate, ThrottleMode } from "../types/app";

export function SettingsScreen({
  delegate,
  setDelegate,
  aiBoost,
  setAiBoost,
  dataSaver,
  setDataSaver,
  autoAbr,
  setAutoAbr,
  apiBaseUrl,
  setApiBaseUrl,
  throttleMode,
  setThrottleMode
}: {
  delegate: Delegate;
  setDelegate: (value: Delegate) => void;
  aiBoost: boolean;
  setAiBoost: (value: boolean) => void;
  dataSaver: boolean;
  setDataSaver: (value: boolean) => void;
  autoAbr: boolean;
  setAutoAbr: (value: boolean) => void;
  apiBaseUrl: string;
  setApiBaseUrl: (value: string) => void;
  throttleMode: ThrottleMode;
  setThrottleMode: (value: ThrottleMode) => void;
}) {
  return (
    <View style={styles.section}>
      <Panel title="백엔드 연결">
        <Text style={styles.panelText}>
          iPhone에서 실측하려면 PC와 같은 Wi-Fi에 연결한 뒤, PC의 LAN IP와 백엔드 포트를 입력합니다. 예: http://192.168.0.202:4000
        </Text>
        <TextInput
          value={apiBaseUrl}
          onChangeText={setApiBaseUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          placeholder="http://192.168.0.202:4000"
          placeholderTextColor="#8A948E"
          style={styles.urlInput}
        />
      </Panel>

      <Panel title="시연용 네트워크 제한">
        <ThrottleControl throttleMode={throttleMode} setThrottleMode={setThrottleMode} />
      </Panel>

      <Panel title="하드웨어 가속">
        <SegmentedControl
          items={[
            { key: "NPU", label: "NPU" },
            { key: "GPU", label: "GPU" },
            { key: "CPU", label: "CPU" }
          ]}
          value={delegate}
          onChange={(value) => setDelegate(value as Delegate)}
        />
        <Text style={styles.panelText}>{delegateDescription(delegate)}</Text>
      </Panel>

      <Panel title="시연 옵션">
        <ToggleRow label="AI 화질 복원" description="360p 입력을 720p+ 출력으로 복원하는 흐름을 표시합니다." value={aiBoost} onValueChange={setAiBoost} />
        <ToggleRow label="데이터 절약" description="저해상도 전송과 트래픽 절감률 표시를 활성화합니다." value={dataSaver} onValueChange={setDataSaver} />
        <ToggleRow label="ABR 자동 판단" description="실측 네트워크 상태를 기반으로 360p 전송 여부를 결정합니다." value={autoAbr} onValueChange={setAutoAbr} />
      </Panel>

      <Panel title="모델 정보">
        <PipelineItem label="모델" value="FSRCNN x2 Super Resolution" />
        <PipelineItem label="입력" value="360p 저해상도 스트림" />
        <PipelineItem label="출력" value="720p+ 고화질 복원 목표" />
        <PipelineItem label="목표" value="25~30ms/frame · 30FPS+" />
      </Panel>
    </View>
  );
}
