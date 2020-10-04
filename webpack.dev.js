const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    watchContentBase: true,
    compress: true,
    port: 32165
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
