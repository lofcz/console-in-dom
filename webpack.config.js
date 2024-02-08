const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, './src/demo.ts'),
  output: {
    filename: 'demo.bundle.js',
		path: path.join(__dirname, './dist/demo')
  },
  resolve:{
    extensions: [".js", ".ts", ".less"] // why i'm hava to use extensions '.js' ?
  },
  module: {
    rules:[
      {
        test: /\.less$/,
        use: [ MiniCssExtractPlugin.loader, "css-loader", "less-loader" ]
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlwebpackPlugin({
      template: path.join(__dirname, './src/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: "console.css"
    }),
    new OptimizeCssAssetsPlugin()
  ],
  target: 'web',
  devServer: {
    contentBase: false,
    compress: true,
    port: 9000
  }
}