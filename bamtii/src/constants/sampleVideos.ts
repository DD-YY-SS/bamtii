export type SampleVideo = {
  title: string;
  fileName: string;
  restoredFileName: string;
  source: string;
};

export const sample360pVideos: SampleVideo[] = [
  {
    title: "Downloaded 360p Seawater",
    fileName: "samplecat-360p.mp4",
    restoredFileName: "samplecat-720p-fsrcnn-smoke.mp4",
    source: "Sample.Cat SD 640x360 MP4"
  }
];
