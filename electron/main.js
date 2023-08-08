const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const root = (_path) => path.join(__dirname, "..", _path);

// 是否本地开发模式
const __DEV__ = process.env.mode === "development";
const LOCAL_URL = "http://localhost:5173/";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: root("electron/preload.js"),
    },
  });

  // load renderer.
  if (__DEV__) {
    win.loadURL(LOCAL_URL);
  } else {
    win.loadFile(root("dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// 拖拽到桌面（取程序文件保存到拖拽位置）
ipcMain.on("save-local", (event) => {
  event.sender.startDrag({
    icon: path.join(__dirname, "iconForDragAndDrop.png"),
    file: path.resolve(__dirname, "../README.md"),
  });
  return true;
});

ipcMain.handle("node:getFilesInRoot", (event, fileName) => {
  const filePath = root(fileName);
  const content = fs.readFileSync(filePath);
  return `${content}`;
});
