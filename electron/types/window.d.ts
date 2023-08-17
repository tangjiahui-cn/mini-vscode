declare interface Window {
  versions: {
    electron: string;
    chrome: string;
  };
  electron: {
    startDrag: (filePath: string) => void;
  },
  file: {
    deleteFilePath: (filePath: string) => Promise<boolean>;
    rename: (srcPath, targetPath) => Promise<boolean>;
    getFileContent: (filePath: string) => Promise<string>;
    chooseLocalDirectory: () => Promise<any>;
    getFiles: (filePath: string) => Promise<any[]>;
    saveFileToLocal: (info: {filePath: string, content: string}) => Promise<boolean>;
  }
}
