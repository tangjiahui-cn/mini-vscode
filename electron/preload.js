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
    startDrag (filePath) {
      ipcRenderer.send('save-local', filePath)
    },
  },
  file: {
    // 创建新文件
    createFile (dirname = '', fileName = '') {
      return ipcRenderer.invoke('file:createFile', {dirname, fileName})
    },
    // 删除文件/目录
    deleteFilePath (filePath) {
      return ipcRenderer.invoke('file:deletePath', filePath)
    },
    // 文件重命名
    rename (srcPath, targetPath) {
      return ipcRenderer.invoke('file:rename', {srcPath, targetPath})
    },
    // 获取根目录文件内容
    getFileContent (filePath) {
      return ipcRenderer.invoke('node:getFileContent', filePath)
    },
    // 选择本地目录打开
    chooseLocalDirectory () {
      return ipcRenderer.invoke('file.chooseLocalDirectory')
    },
    // 获取目录下的所有文件
    getFiles (filePath) {
      return ipcRenderer.invoke('file:getFiles', filePath)
    },
    // 保存文件到本地
    saveFileToLocal ({filePath, content}) {
      return ipcRenderer.invoke('file:saveFileToLocal', {filePath, content})
    }
  }
});
