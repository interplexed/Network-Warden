const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Configure for .env and DefinePlugin
//const env = dotenv.config({ path: path.resolve(__dirname, ".env") }).parsed || {};
//const envKeys = Object.keys(env).reduce((prev, next) => {
//  prev[`process.env.${next}`] = JSON.stringify(env[next]);
//  return prev;
//}, {});

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },

      },
      {
        test: /\.css$/i, // Match any .css file
        use: ['style-loader', 'css-loader'], // Apply style-loader and css-loader
      },
    ],
  },
  devServer: {
    static: path.join(__dirname, 'dist'), // Application bundles
    static: path.join(__dirname, 'public'), // Static assets until build time
    compress: true,
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    // Inject the REACT_APP_API_URL environment variable from the docker-compose
    new webpack.DefinePlugin({'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL)}),
  ],
  devtool: 'source-map', // This will enable source maps
  //devtool: process.env.NODE_ENV === 'production' ? false : 'source-map', // This will disable source maps
};
