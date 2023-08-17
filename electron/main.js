const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const path = require("path");
const fs = require("fs");
const root = (_path) => path.join(__dirname, "..", _path);

// Menu.setApplicationMenu(null);

// 是否本地开发模式
const __DEV__ = process.env.mode === "development";
const LOCAL_URL = "http://localhost:5173/";

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    frame: false,
    webPreferences: {
      preload: root("electron/preload.js"),
    },
  });

  if (__DEV__) {
    win.loadURL(LOCAL_URL);
  } else {
    win.loadFile(root("dist/index.html"));
  }
  return win;
}

let win;
app.whenReady().then(() => {
  win = createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 关闭客户端
ipcMain.on("client:closeWindow", () => {
  win && win.close();
  win = null;
  app.quit();
});

// 客户端最大化
ipcMain.on("client:maxWindow", () => {
  win && win.maximize();
});

// 客户端最小化
ipcMain.on("client:minWindow", () => {
  win && win.minimize();
});

// 回复客户端大小
ipcMain.on("client:resetWindow", () => {
  win && win.restore();
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// 拖拽到桌面（取程序文件保存到拖拽位置）
ipcMain.on("save-local", (event, filePath) => {
  event.sender.startDrag({
    icon: path.join(__dirname, "iconForDragAndDrop.png"),
    file: filePath,
  });
  return true;
});

// 获取文件内容
ipcMain.handle("node:getFileContent", (event, filePath) => {
  return new Promise((resolve) => {
    fs.readFile(filePath, (_, content) => {
      return resolve(`${content}`);
    });
  });
});

// 打开文件选择对话框
ipcMain.handle("file.chooseLocalDirectory", () => {
  return dialog
    .showOpenDialog({
      properties: ["openDirectory"],
    })
    .then((result) => {
      return result?.filePaths?.[0];
    });
});

// 读取目录下所有文件
ipcMain.handle("file:getFiles", (_, dirPath) => {
  return new Promise((resolve) => {
    fs.readdir(dirPath, (_, fileNameList) => {
      const files = fileNameList.map((fileName) => {
        const filePath = path.resolve(dirPath, fileName);
        const isDirectory = fs.statSync(filePath).isDirectory();
        return {
          fileName,
          filePath,
          isDirectory,
          isFile: !isDirectory,
        };
      });
      return resolve(files);
    });
  });
});

// 保存文件到本地
ipcMain.handle("file:saveFileToLocal", (_, { filePath, content }) => {
  return new Promise((resolve) => {
    fs.writeFile(filePath, content, (err) => {
      resolve(!err);
    });
  });
});

// 文件重命名
ipcMain.handle("file:rename", (_, { srcPath, targetPath }) => {
  return new Promise((resolve) => {
    fs.rename(srcPath, targetPath, (error) => {
      resolve(!error);
    });
  });
});

// 删除指定路径文件
ipcMain.handle("file:deletePath", (_, filePath) => {
  function deleteFilePathSync(filePath) {
    if (fs.existsSync(filePath)) {
      const isFile = fs.statSync(filePath).isFile();

      // 删除文件
      if (isFile) {
        fs.unlinkSync(filePath);
        return;
      }

      // 删除目录
      const names = fs.readdirSync(filePath);
      names.forEach((name) => {
        deleteFilePathSync(path.resolve(filePath, name));
      });

      fs.rmdirSync(filePath); // 删除空的文件夹
    }
  }

  deleteFilePathSync(filePath);
  return Promise.resolve(true);
});

// 新增文件
ipcMain.handle("file:createFile", (_, { dirname, fileName }) => {
  function createFile(dirname, fileName) {
    fileName ||= "未命名文件.txt";
    return new Promise((resolve) => {
      let index = 1;
      let filePath = path.resolve(dirname, fileName);
      let currentName = fileName;
      const [name, ext] = fileName.split(".");
      // 如果文件存在
      while (fs.existsSync(filePath)) {
        filePath = path.resolve(
          dirname,
          (currentName = `${name}${index++}.${ext}`)
        );
      }

      fs.writeFile(filePath, "", (err) => {
        if (!err) {
          return resolve({
            fileName: currentName,
            filePath,
            isDirectory: false,
            isFile: true,
          });
        }
      });
    });
  }
  return createFile(dirname, fileName);
});

// 新增文件夹
ipcMain.handle("file:createDirectory", (_, { parentDir, dirName }) => {
  function createDir(parentDir, dirName = "未命名文件夹") {
    return new Promise((resolve) => {
      let index = 1;
      let dirPath = path.resolve(parentDir, dirName);
      let currentName = dirName;
      // 如果文件存在
      while (fs.existsSync(dirPath)) {
        dirPath = path.resolve(
          parentDir,
          (currentName = `${dirName}${index++}`)
        );
      }

      fs.mkdir(dirPath, (err) => {
        if (!err) {
          resolve({
            fileName: currentName,
            filePath: dirPath,
            isDirectory: true,
            isFile: false,
          });
        }
      });
    });
  }
  return createDir(parentDir, dirName);
});

// 获取基本文件信息
ipcMain.handle("file:baseInfo", (_, filePath) => {
  return new Promise((resolve) => {
    if (!fs.existsSync(filePath)) {
      return resolve({
        fileName: "",
        filePath: "",
        isDirectory: false,
        isFile: false,
      });
    }
    const isDirectory = fs.statSync(filePath).isDirectory();
    const info = path.parse(filePath);
    return resolve({
      fileName: info.base,
      filePath: filePath,
      isDirectory,
      isFile: !isDirectory,
    });
  });
});
