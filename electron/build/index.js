// 校验配置文件正确性
require('../utils').checkConfig();

// 清空运行时目录
require('../utils').resetRuntimeDir();

// 打包 main.js 和 preload.js
require('./build')();

// 生成 window 声明文件
require('./declare')();