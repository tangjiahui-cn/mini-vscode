const { contextBridge, ipcRenderer } = require("electron");
const exposeWindow = (o) =>
  Object.entries(o).map(([k, v]) => contextBridge.exposeInMainWorld(k, v));

// 要绑定在window上的变量（提供给renderer使用）
exposeWindow({
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
  },
  electron: {
    startDrag () {
      ipcRenderer.send('save-local')
    },
  },
  node: {
    // 获取根目录文件内容
    getFileContent (fileName) {
      return ipcRenderer.invoke('node:getFilesInRoot', fileName)
    }
  }
});
