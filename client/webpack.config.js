const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const path = require('path')
const { InjectManifest } = require('workbox-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// The `webpack.config.js` is exporting a function that returns the configuration object.
module.exports = () => {
  return {
    // The mode 'development' provides a configuration with built-in optimisations for speed and debugging.
    mode: 'development',

    // Entry points indicating which module webpack should use to begin building out its internal dependency graph.
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js',
    },

    // The output property tells webpack where to emit the bundles it creates and how to name these files.
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },

    // Array of plugins used by webpack to perform a variety of tasks.
    plugins: [
      // HtmlWebpackPlugin simplifies creation of HTML files to serve the webpack bundles.
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'Ink Flow',
      }),

      // MiniCssExtractPlugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS.
      new MiniCssExtractPlugin(),

      // InjectManifest plugin allows generating a service worker file with precaching.
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'src-sw.js',
      }),

      // WebpackPwaManifest generates a 'manifest.json' for the Progressive Web Application.
      new WebpackPwaManifest({
        fingerprints: false,
        inject: true,
        name: 'Ink Flow - Another Text Editor',
        short_name: 'Ink Flow',
        description: "This application installs 'Ink Flow', a Text Editor.",
        background_color: '#272822',
        theme_color: '#31A9E1',
        start_url: '/',
        publicPath: '/',
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
            destination: path.join('assets', 'icons'),
          },
        ],
      }),
    ],

    // Module property describes how webpack should treat different types of modules.
    module: {
      rules: [
        // Rule for CSS files.
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },

        // Rule for JavaScript files.
        {
          test: /\.m?js$/,
          exclude: /node_modules|bower_components/, // Do not transpile code in these directories.
          use: {
            loader: 'babel-loader', // This package allows transpiling JavaScript files using Babel and webpack.
            options: {
              presets: ['@babel/preset-env'], // A smart preset that allows the app to use the latest JavaScript without needing to micromanage syntax transforms.
            },
          },
        },
      ],
    },
  }
}
