// 定义全局变量
export interface Window {
  versions: {
    electron: string;
    chrome: string;
  };
  electron: {
    startDrag: (filePath: string) => void;
  };
  client: {
    // 关闭窗口
    closeWindow: () => void;
    // 最大化窗口
    maxWindow: () => void;
    // 最小化窗口
    minWindow: () => void;
    // 重置窗口
    resetWindow: () => void;
  };
  file: {
    // 获取文件/目录基本信息
    getBaseInfo: (filePath: string) => Promise<any>;
    // 创建新的文件夹
    createDirectory: (parentDir: string, dirName?: string) => Promise<any>;
    // 创建新文件
    createFile: (dirname: string, fileName?: string) => Promise<any>;
    // 删除文件/目录
    deleteFilePath: (filePath: string) => Promise<boolean>;
    // 文件重命名
    rename: (srcPath, targetPath) => Promise<boolean>;
    // 获取根目录文件内容
    getFileContent: (filePath: string) => Promise<string>;
    // 选择本地目录打开
    chooseLocalDirectory: () => Promise<any>;
    // 获取目录下所有文件
    getFiles: (filePath: string) => Promise<any[]>;
    // 保存文件到本地
    saveFileToLocal: (info: {
      filePath: string;
      content: string;
    }) => Promise<boolean>;
  };
}
