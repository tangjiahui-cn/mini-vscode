/**
 * 生成 window.d.ts 文件
 */
const {root, fs, runTimeDirPath} = require('../utils')
// 源文件路径
const filePath = root('window.ts')
// 目标文件位置
const targetFile = root(runTimeDirPath, "window.d.ts")

module.exports = function () {
  // 将声明源文件复制到指定目录，替换 export 为 declare
  const body = fs.readFileSync(filePath, "utf-8");
  const replaceBody = body.replace(
    "export interface Window {",
    "declare interface Window {"
  );
  fs.writeFileSync(targetFile, replaceBody);
}
