declare interface Window {
  versions: {
    electron: string;
    chrome: string;
  };
  electron: {
    startDrag: (fileName: string) => void;
  },
  node: {
    getFileContent: (fileName: string) => Promise<any>;
  }
}
