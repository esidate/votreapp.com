const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const path = require("path");

module.exports = merge(common, {
  mode: "production",
  performance: {
    maxAssetSize: 300000,
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MinifyPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "src/img", to: "img" },
        {
          from: path.resolve(__dirname, "robots.txt"),
        },
        {
          from: path.resolve(__dirname, "CNAME"),
        },
        {
          from: path.resolve(__dirname, "sitemap.xml"),
        },
        {
          from: path.resolve(__dirname, "a49add6e9098e932cf92ac3966a6c71f.txt"),
        },
      ],
    }),
  ],
});
