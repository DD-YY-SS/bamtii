export type SampleVideo = {
  title: string;
  fileName: string;
  restoredFileName: string;
  source: string;
};

export const sample360pVideos: SampleVideo[] = [
  {
    title: "Seawater Drone Demo",
    fileName: "seawater-360p.mp4",
    restoredFileName: "seawater-720p-fsrcnn-epoch1.mp4",
    source: "Sample.Cat 640x360 MP4 · FSRCNN x2 epoch1"
  }
];
