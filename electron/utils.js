const webpack = require("webpack");
const { merge } = require('webpack-merge');
const path = require("path");
const fs = require("fs");
const pkg = require('./config.json');
const root = (...target) => path.resolve(__dirname, ...target);
const pjRoot = (...target) => root('..', ...target);
const runTimeDir = (...target) => pjRoot(pkg.outDir, ...target);
const rootPath = root();
const pjRootPath = pjRoot();
const runTimeDirPath = runTimeDir();

function checkConfig () {
  const absPathReg = /^[a-zA-Z]+.*/;
  if (!absPathReg.test(pkg.outDir)) {
    throw new Error(`'outDir' prop in config.json, must be like 'node_modules/xxx'.``（which finally become: /Users/.../YourProject/node_modules/xxx）`)
  }
}

// 清空并创建运行时目录
function resetRuntimeDir () {
  rmFilePathSync(runTimeDirPath);
  mkdirSync(runTimeDirPath);
}

// 递归创建目录（同步）
function mkdirSync (dirPath) {
  const paths = dirPath.slice(pjRootPath.length + 1).split(path.sep);
  paths.forEach((_, index) => {
    const targetPath = path.resolve(
      pjRootPath,
      paths.slice(0, index + 1).join(path.sep)
    );
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath);
    }
  });
}

// 递归删除文件/目录（同步）
function rmFilePathSync (filePath) {
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
      rmFilePathSync(path.resolve(filePath, name));
    });

    fs.rmdirSync(filePath); // 删除空的文件夹
  }
}

module.exports = {
  checkConfig, // 校验config数据正确性
  webpack,
  merge,
  path,
  fs,
  root, // electron 文件夹目录定位函数
  pjRoot, // 项目根目录定位函数
  rootPath, // electron 文件夹目录地址
  pjRootPath, // 项目根目录地址
  runTimeDirPath, // 运行时地址
  runTimeDir, // 运行时目录
  rmFilePathSync, // 同步删除指定地址 文件/目录
  mkdirSync, // 递归创建目录（同步）
  resetRuntimeDir // 清空运行时目录
}
