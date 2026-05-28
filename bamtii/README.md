# 깍두기 절단기 MVP

Expo Go에서 확인할 수 있는 온디바이스 AI 스트리밍 출시형 MVP입니다.

## 실행

```bash
npm install
npm start
```

터미널에 표시되는 QR 코드를 Expo Go 앱으로 스캔하면 됩니다.

백엔드를 함께 시연하려면 별도 터미널에서 실행합니다.

```bash
npm run backend
```

기본 주소는 `http://localhost:4000`입니다.

## 실제 실측 방법

1. PC에서 백엔드를 실행합니다.
2. Expo Go 앱을 실행합니다.
3. 앱의 `설정 > 백엔드 연결`에 백엔드 주소를 입력합니다.
4. 에뮬레이터에서는 보통 `http://127.0.0.1:4000`을 사용할 수 있습니다.
5. 실제 휴대폰 Expo Go에서는 `localhost`가 휴대폰 자기 자신이므로 PC의 LAN IP를 써야 합니다. 예: `http://192.168.0.10:4000`
6. 앱의 `망 진단 > 실측 시작`을 누릅니다.

실측 시 앱은 `/api/benchmark/chunk`에서 여러 크기의 데이터를 직접 다운로드하고, 다음 값을 계산합니다.

- `bandwidthMbps`: 실제 다운로드 처리량 기반 대역폭
- `latencyMs`: 첫 benchmark 요청 왕복/다운로드 시간
- `jitterMs`: 여러 샘플 응답 시간의 표준편차
- `packetDropPercent`: benchmark 요청 실패율 기반 추정값
- `downloadedBytes`: 실제 다운로드한 바이트 수
- `durationMs`: 전체 측정 소요 시간

측정이 끝나면 앱이 `/api/telemetry`로 실측값을 전송하고, 백엔드는 그 값으로 ABR 결정을 다시 계산합니다. 이후 앱의 수신 화질, 출력 화질, 절감률, 추론 예상치가 실측 기반으로 바뀝니다.

`시청` 탭과 `망 진단` 탭의 `실시간 수신`을 켜면 앱이 5초마다 benchmark chunk를 다시 내려받고 `/api/telemetry`로 전송합니다. 이전 측정이 끝나기 전에는 다음 측정을 건너뛰므로 중복 요청으로 인한 버퍼링이나 측정 왜곡을 줄입니다.

시연 중 네트워크가 너무 좋아서 계속 `1080p / 절감 0%`로 판단되면 `시청` 또는 `망 진단`의 `시연용 네트워크 제한`을 `1M` 또는 `0.6M`으로 설정하세요. 실제 OS 네트워크를 차단하는 기능은 아니지만, 앱이 백엔드로 보내는 실측값을 제한 환경처럼 보정해 ABR이 360p + AI 복원으로 안정적으로 전환됩니다.

## YouTube 영상 시연

`시청` 탭에서 YouTube URL 또는 영상 ID를 입력하면 앱 안의 WebView 플레이어로 실제 YouTube 영상을 재생할 수 있습니다.

시청 탭에는 두 가지 모드가 있습니다.

- `YouTube 실측`: 실제 YouTube 영상을 재생하면서 같은 네트워크에서 benchmark 실측을 수행합니다.
- `상하 비교`: 같은 YouTube 영상을 위/아래 WebView로 배치하고, 위에는 깍두기 절단기 적용 결과, 아래에는 제한망 미적용 상태를 시각적으로 비교합니다.
- `AI 복원 검증`: YouTube가 아니라 자체 HLS/프레임 파이프라인을 전제로 360p 수신 후 720p+ 출력 흐름을 검증합니다.

발표 시연 순서:

1. `npm run backend`로 백엔드를 실행합니다.
2. Expo Go 앱에서 `설정 > 백엔드 연결`을 확인합니다.
3. 실제 휴대폰으로 셀룰러 데이터 시연을 할 경우, PC 로컬 서버는 휴대폰에서 접근할 수 없으므로 백엔드를 공인 주소나 터널 주소로 노출해야 합니다.
4. `시청` 탭에서 YouTube 링크를 입력하고 재생합니다.
5. 영상이 재생되는 동안 `영상 보면서 실측 시작`을 누릅니다.
6. 앱이 benchmark chunk를 다운로드해 현재 네트워크의 대역폭, 지연율, jitter, 실패율을 계산하고 백엔드 ABR 결과를 표시합니다.

주의: YouTube 플레이어 내부의 실제 영상 segment 바이트는 앱에서 직접 읽을 수 없습니다. 따라서 실측값은 “YouTube 재생 중 같은 네트워크에서 수행한 benchmark 측정값”입니다. 셀룰러 환경에서 완전히 실제에 가깝게 보여주려면 백엔드를 외부 접속 가능한 주소로 띄운 뒤 휴대폰 셀룰러로 접속해야 합니다.

YouTube 영상을 360p로 강제하고 그 프레임을 앱 내부 AI로 720p 업스케일하는 것은 WebView/Expo Go 구조에서는 불가능합니다. 실제 제품 단계에서는 권한이 있는 자체 HLS 스트림, Expo Dev Client 또는 순수 React Native 네이티브 모듈, TFLite Delegate, 네이티브 렌더러가 필요합니다.

`상하 비교` 모드는 발표용 시각화입니다. 위쪽 영상은 “360p 수신 후 AI 복원 적용 결과”를 표현하고, 아래쪽 영상은 “제한망에서 미적용 시 발생하는 저화질/버퍼링”을 오버레이로 보여줍니다. 실제 YouTube 프레임 자체를 앱이 후처리하는 것은 아닙니다.

## Development Build / Native Player

전용 플레이어 방식은 Expo Go가 아니라 Development Build가 필요합니다.

```bash
npm run backend
npm run dev:android
```

`영상 고화질 변환` 메뉴는 WebView 기반 `<video>` 플레이어로 자체 HLS/MP4 스트림을 재생합니다. 기본 URL은 백엔드의 혼잡 조건 master manifest이며, 발표용 iOS 빌드 안정성을 위해 별도 네이티브 비디오 모듈에 의존하지 않습니다.

Native SR 연결 지점은 `src/services/superResolutionNative.ts`입니다. 실제 네이티브 구현 계약은 `native/SUPER_RESOLUTION_MODULE_SPEC.md`에 정리했습니다.

주의: 현재 구현은 Development Build용 네이티브 플레이어와 SR 모듈 호출 인터페이스까지입니다. 실제 C++/Metal/Vulkan 커널과 디코더 texture 후처리는 Android/iOS 네이티브 프로젝트 생성 후 구현해야 합니다.

## FSRCNN-x 모델 작업

사용자가 제안한 FSRCNN-x 저장소를 `FSRCNN_x` 기준으로 연결했고, 우리 프로젝트용 도구를 `tools/fsrcnn`에 추가했습니다. 보조로 내려받은 저장소는 `models/Super_Resolution`에 있습니다.

현재 확인된 상태:

- `FSRCNN_x/models.py`에 PyTorch `FSRCNN_x` 구조가 있습니다.
- `x2` 모델은 `360p -> 720p` 목적에 맞습니다.
- 저장소에는 예시 결과 이미지는 있지만 pretrained `.pth` 가중치는 포함되어 있지 않습니다.

환경 준비:

```bash
python -m venv .venv-fsrcnn
.venv-fsrcnn\Scripts\activate
pip install -r tools/fsrcnn/requirements.txt
```

모델 구조 확인:

```bash
python tools/fsrcnn/inspect_model.py
```

가중치가 준비된 뒤 이미지 1장 테스트:

```bash
python tools/fsrcnn/run_image_demo.py ^
  --weights FSRCNN_x/outputs/x2/best.pth ^
  --image FSRCNN_x/data/butterfly_GT.bmp ^
  --out artifacts/fsrcnn/butterfly_sr.png
```

ONNX export:

```bash
python tools/fsrcnn/export_onnx.py ^
  --weights FSRCNN_x/outputs/x2/best.pth ^
  --out artifacts/fsrcnn/fsrcnn_x2.onnx
```

## 백엔드 API

- `GET /health`: 서버 상태 확인
- `GET /api/streams`: 데모 스트림 목록
- `GET /api/benchmark/chunk?sizeKb=256`: 앱 실측용 다운로드 청크
- `GET /api/streams/:id`: 스트림 상세
- `GET /api/streams/:id/master.m3u8`: ABR 판단이 반영된 HLS master manifest
- `GET /api/streams/:id/hls/:quality/index.m3u8`: 품질별 HLS variant manifest
- `GET /api/streams/:id/hls/:quality/seg-000.ts`: 데모 HLS segment placeholder
- `POST /api/telemetry`: 클라이언트 네트워크 상태 저장 및 ABR 결정 반환
- `GET /api/telemetry/recent`: 최근 텔레메트리 조회
- `GET /api/abr/decision`: 쿼리 파라미터 기반 ABR 판단
- `GET /api/report`: 트래픽/탄소 절감 리포트
- `GET /api/logs`: 로그 파일 경로 확인

예시:

```bash
curl "http://localhost:4000/api/abr/decision?bandwidthMbps=1.5&latencyMs=70&packetDropPercent=5&jitterMs=16"
```

## 구현된 앱 기능

- 실제 런칭 앱처럼 보이는 온보딩, 홈, AI 플레이어, 망 진단, 절감 리포트, 설정 탭
- 재생/일시정지, 영상 선택, 진행률 자동 업데이트, 전체 제어 진입
- AI 화질 복원, 데이터 세이버, ABR 자동 제어 토글
- 5G 음영, 혼잡 지역, 고속망 네트워크 모드 전환
- 서버 수신 화질, 화면 출력 화질, 트래픽 절감률, 추론 시간, FPS 실시간 표시
- FSRCNN 복원 모드: 균형, 선명, 저전력
- NPU, GPU, CPU Delegate 선택과 하드웨어 가속 설명
- NestJS, Prisma, PostgreSQL, rsyslog, Linux, Congestion Gate 기반 백엔드 파이프라인 표시
- 월 데이터 절감량, 예상 비용 절감, 탄소 저감량, PSNR 손실 리포트
- 기존 OTT, 기존 AI 영상 처리 연구, 깍두기 절단기 비교
- B2B SDK/API 기술이전 모델, ESG 효과, 특허 출원 로드맵
- 의존성 없는 실행형 백엔드 MVP: HLS manifest, ABR 엔진, 텔레메트리 저장, 리포트, 로그

## 참고

현재 모바일 버전은 Expo Go 시연용 MVP이므로 실제 TFLite 네이티브 추론 대신, 모바일 앱 안에서 전체 스트리밍/AI 복원 사이클을 인터랙티브하게 시각화합니다. 백엔드는 실제 HTTP API로 동작합니다. 실제 모델 연동은 Expo Dev Client 또는 네이티브 모듈 환경에서 TFLite Delegate를 붙이고, 백엔드는 NestJS + Prisma + PostgreSQL로 교체하는 단계로 확장하면 됩니다.
