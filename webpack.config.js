const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: path.resolve(__dirname, "./src/main.js"),
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "bundle.js",
    clean: true,
  },
  devtool: "source-map",

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("./public/**/*"),
          to: "./build",
          noErrorOnMissing: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      title: "My App",
      template: path.join(__dirname, "public", "index.html"),
      filename: "index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
