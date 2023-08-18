/**
 * 打包 preload.js、main.js
 */
const {merge, root, runTimeDirPath, webpack} = require('../utils');
const WebpackBar = require('webpackbar');
const __DEV__ = process.env.mode === 'development'

const commonConfig = {
  mode: __DEV__ ? 'development' : "production",
  output: {
    path: runTimeDirPath
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__
    }),
    new WebpackBar({
      color: '#85d',
      basic: true,
      profile: true,
    }),
  ]
}

const preload = webpack(merge(commonConfig, {
  entry: root("src/preload/index.ts"),
  target: "electron-preload",
  output: {
    filename: 'preload.js'
  }
}));

const main = webpack(merge(commonConfig, {
  entry: root("src/main/index.ts"),
  target: "electron-main",
  output: {
    filename: 'main.js'
  }
}));

module.exports = function () {
  preload.run();
  main.run();
}