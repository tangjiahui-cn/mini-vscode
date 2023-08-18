import { Window } from "../../window";
import { contextBridge, ipcRenderer } from "electron";
const exposeWindow = (o: Window) =>
  Object.entries(o).map(([k, v]) => contextBridge.exposeInMainWorld(k, v));

// 要绑定在window上的变量（提供给renderer使用）
exposeWindow({
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
  },
  electron: {
    startDrag(filePath) {
      ipcRenderer.send("save-local", filePath);
    },
  },
  client: {
    closeWindow: () => ipcRenderer.send("client:closeWindow"),
    maxWindow: () => ipcRenderer.send("client:maxWindow"),
    minWindow: () => ipcRenderer.send("client:minWindow"),
    resetWindow: () => ipcRenderer.send("client:resetWindow"),
  },
  file: {
    getBaseInfo(filePath) {
      return ipcRenderer.invoke("file:baseInfo", filePath);
    },
    createDirectory(parentDir, dirName) {
      return ipcRenderer.invoke("file:createDirectory", { parentDir, dirName });
    },
    createFile(dirname = "", fileName = "") {
      return ipcRenderer.invoke("file:createFile", { dirname, fileName });
    },
    deleteFilePath(filePath) {
      return ipcRenderer.invoke("file:deletePath", filePath);
    },
    rename(srcPath, targetPath) {
      return ipcRenderer.invoke("file:rename", { srcPath, targetPath });
    },
    getFileContent(filePath) {
      return ipcRenderer.invoke("node:getFileContent", filePath);
    },
    chooseLocalDirectory() {
      return ipcRenderer.invoke("file.chooseLocalDirectory");
    },
    getFiles(filePath) {
      return ipcRenderer.invoke("file:getFiles", filePath);
    },
    saveFileToLocal({ filePath, content }) {
      return ipcRenderer.invoke("file:saveFileToLocal", { filePath, content });
    },
  },
});
