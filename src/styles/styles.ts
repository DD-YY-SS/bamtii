import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  shell: {
    flex: 1
  },
  safe: {
    flex: 1
  },
  onboarding: {
    flex: 1,
    justifyContent: "center",
    padding: 24
  },
  brandMark: {
    alignItems: "center",
    backgroundColor: "#B9F6D3",
    borderRadius: 24,
    height: 70,
    justifyContent: "center",
    width: 70
  },
  brandMarkText: {
    color: "#08231F",
    fontSize: 24,
    fontWeight: "900"
  },
  launchKicker: {
    color: "#B9F6D3",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1.3,
    marginTop: 28,
    textTransform: "uppercase"
  },
  launchTitle: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: -1.8,
    lineHeight: 48,
    marginTop: 8
  },
  launchBody: {
    color: "#DDEDE4",
    fontSize: 16,
    lineHeight: 25,
    marginTop: 14
  },
  launchStack: {
    gap: 10,
    marginTop: 28
  },
  launchCheck: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14
  },
  checkDot: {
    alignItems: "center",
    backgroundColor: "#F4D46B",
    borderRadius: 14,
    height: 28,
    justifyContent: "center",
    width: 28
  },
  checkDotText: {
    color: "#13211E",
    fontSize: 14,
    fontWeight: "900"
  },
  checkCopy: {
    flex: 1
  },
  checkTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  },
  checkText: {
    color: "#D9E9E1",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#B9F6D3",
    borderRadius: 22,
    marginTop: 30,
    paddingVertical: 17
  },
  primaryButtonText: {
    color: "#06231F",
    fontSize: 16,
    fontWeight: "900"
  },
  appHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14
  },
  headerEyebrow: {
    color: "#B9F6D3",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.2
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -1,
    marginTop: 2
  },
  liveBadge: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 999,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  liveDot: {
    backgroundColor: "#F4D46B",
    borderRadius: 4,
    height: 8,
    width: 8
  },
  liveBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900"
  },
  content: {
    padding: 20,
    paddingBottom: 112
  },
  section: {
    gap: 14
  },
  playerCard: {
    backgroundColor: "#F8F6EA",
    borderRadius: 32,
    padding: 12
  },
  playerSurface: {
    aspectRatio: 16 / 10.5,
    backgroundColor: "#0C2422",
    borderRadius: 25,
    overflow: "hidden"
  },
  glowOrb: {
    backgroundColor: "#B9F6D3",
    borderRadius: 140,
    height: 220,
    position: "absolute",
    right: -70,
    top: -80,
    width: 220
  },
  videoMosaic: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  videoPixel: {
    height: "16.66%",
    width: "12.5%"
  },
  aiScan: {
    backgroundColor: "rgba(185,246,211,0.55)",
    height: "130%",
    position: "absolute",
    top: -24,
    width: 46
  },
  playerOverlay: {
    bottom: 18,
    left: 18,
    position: "absolute",
    right: 18
  },
  streamBadges: {
    flexDirection: "row",
    gap: 8
  },
  streamBadge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 999,
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  videoTitle: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: -0.8,
    marginTop: 10
  },
  videoSubTitle: {
    color: "#DCEDE5",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4
  },
  progressTrack: {
    backgroundColor: "#DCE2D8",
    borderRadius: 999,
    height: 7,
    marginHorizontal: 4,
    marginTop: 12,
    overflow: "hidden"
  },
  progressFill: {
    backgroundColor: "#0B342D",
    borderRadius: 999,
    height: "100%"
  },
  playerControls: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    padding: 6,
    paddingTop: 12
  },
  playButton: {
    backgroundColor: "#0B342D",
    borderRadius: 17,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  playButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900"
  },
  playerMeta: {
    flex: 1
  },
  playerMetaTop: {
    color: "#10231F",
    fontSize: 14,
    fontWeight: "900"
  },
  playerMetaBottom: {
    color: "#65716B",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2
  },
  secondaryButton: {
    backgroundColor: "#E9E5D3",
    borderRadius: 17,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  secondaryButtonText: {
    color: "#10231F",
    fontSize: 13,
    fontWeight: "900"
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  statTile: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 22,
    padding: 15,
    width: "48%"
  },
  statLabel: {
    color: "#65716B",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  statValue: {
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginTop: 6
  },
  stat_mint: {
    color: "#0B7C55"
  },
  stat_warm: {
    color: "#A56C00"
  },
  stat_danger: {
    color: "#B3312B"
  },
  stat_ink: {
    color: "#10231F"
  },
  panel: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 26,
    padding: 18
  },
  panelTitle: {
    color: "#10231F",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.3,
    marginBottom: 12
  },
  panelText: {
    color: "#4D5A54",
    fontSize: 14,
    lineHeight: 22
  },
  measureButton: {
    alignItems: "center",
    backgroundColor: "#0B342D",
    borderRadius: 18,
    marginTop: 14,
    paddingVertical: 14
  },
  measureButtonDisabled: {
    opacity: 0.55
  },
  measureButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  },
  realtimeRow: {
    alignItems: "center",
    backgroundColor: "#EEF4EA",
    borderRadius: 18,
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    padding: 13
  },
  realtimeCopy: {
    flex: 1
  },
  realtimeTitle: {
    color: "#10231F",
    fontSize: 14,
    fontWeight: "900"
  },
  realtimeText: {
    color: "#68756F",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3
  },
  realtimeButton: {
    backgroundColor: "#DDE7D8",
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  realtimeButtonActive: {
    backgroundColor: "#F4D46B"
  },
  realtimeButtonText: {
    color: "#52605A",
    fontSize: 12,
    fontWeight: "900"
  },
  realtimeButtonTextActive: {
    color: "#10231F"
  },
  realtimeWideButton: {
    alignItems: "center",
    backgroundColor: "#EEF4EA",
    borderColor: "#D8E1D5",
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 10,
    paddingVertical: 14
  },
  realtimeWideButtonActive: {
    backgroundColor: "#F4D46B",
    borderColor: "#F4D46B"
  },
  realtimeWideButtonText: {
    color: "#52605A",
    fontSize: 14,
    fontWeight: "900"
  },
  realtimeWideButtonTextActive: {
    color: "#10231F"
  },
  throttleBox: {
    backgroundColor: "#F7F1D6",
    borderRadius: 18,
    marginTop: 14,
    padding: 13
  },
  throttleTitle: {
    color: "#10231F",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 10
  },
  throttleText: {
    color: "#665E3B",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 9
  },
  errorText: {
    color: "#B3312B",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 19,
    marginTop: 10
  },
  measurementBox: {
    backgroundColor: "#EEF4EA",
    borderRadius: 18,
    marginTop: 12,
    padding: 13
  },
  measurementTitle: {
    color: "#10231F",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 5
  },
  youtubeShell: {
    backgroundColor: "#0C2422",
    borderRadius: 22,
    height: 210,
    marginTop: 14,
    overflow: "hidden"
  },
  youtubeWebView: {
    backgroundColor: "#0C2422",
    flex: 1
  },
  youtubeOpenButton: {
    alignItems: "center",
    backgroundColor: "#F4D46B",
    borderRadius: 16,
    marginTop: 10,
    paddingVertical: 12
  },
  youtubeOpenButtonText: {
    color: "#10231F",
    fontSize: 13,
    fontWeight: "900"
  },
  compareStack: {
    gap: 12,
    marginTop: 14
  },
  compareVideoCard: {
    backgroundColor: "#EEF4EA",
    borderRadius: 20,
    overflow: "hidden",
    padding: 10
  },
  compareHeader: {
    color: "#10231F",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8
  },
  compareVideoFrame: {
    backgroundColor: "#0C2422",
    borderRadius: 16,
    height: 165,
    overflow: "hidden"
  },
  compareWebView: {
    backgroundColor: "#0C2422",
    flex: 1
  },
  compareWebViewDimmed: {
    backgroundColor: "#0C2422",
    flex: 1,
    opacity: 0.52
  },
  enhancedOverlay: {
    bottom: 10,
    left: 10,
    position: "absolute",
    right: 10,
    top: 10
  },
  enhancedBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(185,246,211,0.92)",
    borderRadius: 999,
    color: "#08231F",
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  sharpScan: {
    backgroundColor: "rgba(185,246,211,0.28)",
    borderRadius: 999,
    bottom: 0,
    position: "absolute",
    right: 20,
    top: 0,
    width: 26
  },
  degradedOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  degradedPixel: {
    backgroundColor: "#081716",
    height: "16.66%",
    width: "16.66%"
  },
  bufferCard: {
    alignItems: "center",
    backgroundColor: "rgba(8,23,22,0.82)",
    borderRadius: 18,
    left: 24,
    padding: 14,
    position: "absolute",
    right: 24
  },
  bufferTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900"
  },
  bufferText: {
    color: "#D8E7E0",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 5,
    textAlign: "center"
  },
  youtubeFallback: {
    alignItems: "center",
    backgroundColor: "#EEF4EA",
    borderRadius: 22,
    justifyContent: "center",
    marginTop: 14,
    minHeight: 180,
    padding: 18
  },
  youtubeFallbackTitle: {
    color: "#10231F",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8
  },
  nativeVideoShell: {
    backgroundColor: "#0C2422",
    borderRadius: 22,
    height: 220,
    marginTop: 14,
    overflow: "hidden"
  },
  nativeVideo: {
    height: "100%",
    width: "100%"
  },
  urlInput: {
    backgroundColor: "#EEF4EA",
    borderColor: "#D8E1D5",
    borderRadius: 18,
    borderWidth: 1,
    color: "#10231F",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 13
  },
  contentRow: {
    alignItems: "center",
    borderRadius: 20,
    flexDirection: "row",
    gap: 12,
    padding: 10
  },
  contentRowActive: {
    backgroundColor: "#EEF4EA"
  },
  thumbnail: {
    alignItems: "center",
    backgroundColor: "#0B342D",
    borderRadius: 17,
    height: 50,
    justifyContent: "center",
    width: 56
  },
  thumbnailText: {
    color: "#B9F6D3",
    fontSize: 18,
    fontWeight: "900"
  },
  contentCopy: {
    flex: 1
  },
  contentTitle: {
    color: "#10231F",
    fontSize: 15,
    fontWeight: "900"
  },
  contentMeta: {
    color: "#68756F",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3
  },
  contentLength: {
    color: "#10231F",
    fontSize: 12,
    fontWeight: "900"
  },
  toggleRow: {
    alignItems: "center",
    borderBottomColor: "#E4E8DF",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 14,
    paddingVertical: 12
  },
  toggleCopy: {
    flex: 1
  },
  toggleLabel: {
    color: "#10231F",
    fontSize: 15,
    fontWeight: "900"
  },
  toggleDescription: {
    color: "#68756F",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3
  },
  segment: {
    backgroundColor: "#E8ECDF",
    borderRadius: 18,
    flexDirection: "row",
    gap: 5,
    padding: 5
  },
  segmentItem: {
    alignItems: "center",
    borderRadius: 14,
    flex: 1,
    paddingVertical: 11
  },
  segmentItemActive: {
    backgroundColor: "#0B342D"
  },
  segmentText: {
    color: "#56635D",
    fontSize: 13,
    fontWeight: "900"
  },
  segmentTextActive: {
    color: "#FFFFFF"
  },
  pipelineItem: {
    borderBottomColor: "#E4E8DF",
    borderBottomWidth: 1,
    paddingVertical: 11
  },
  pipelineLabel: {
    color: "#65716B",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.4,
    textTransform: "uppercase"
  },
  pipelineValue: {
    color: "#10231F",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
    marginTop: 4
  },
  decisionText: {
    color: "#0B7C55",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.7,
    marginBottom: 8
  },
  savingsHero: {
    backgroundColor: "#F4D46B",
    borderRadius: 32,
    padding: 26
  },
  savingsNumber: {
    color: "#10231F",
    fontSize: 64,
    fontWeight: "900",
    letterSpacing: -2
  },
  savingsLabel: {
    color: "#10231F",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 2
  },
  savingsBody: {
    color: "#4F4622",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 9
  },
  compareRow: {
    borderBottomColor: "#E4E8DF",
    borderBottomWidth: 1,
    paddingVertical: 12
  },
  compareLabel: {
    color: "#10231F",
    fontSize: 14,
    fontWeight: "900"
  },
  compareValue: {
    color: "#596660",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4
  },
  nav: {
    alignItems: "center",
    backgroundColor: "rgba(248,246,234,0.96)",
    borderRadius: 30,
    bottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    left: 16,
    paddingHorizontal: 8,
    paddingVertical: 9,
    position: "absolute",
    right: 16
  },
  navItem: {
    alignItems: "center",
    flex: 1,
    gap: 3
  },
  navIcon: {
    color: "#7D8781",
    fontSize: 19,
    fontWeight: "900"
  },
  navIconActive: {
    color: "#0B342D"
  },
  navLabel: {
    color: "#7D8781",
    fontSize: 10,
    fontWeight: "900"
  },
  navLabelActive: {
    color: "#0B342D"
  }
});
