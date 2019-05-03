const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const env = process.env.NODE_ENV || 'development';
// 'produdction' or 'development' in env

const finalCSSLoader = (env === 'production') ? MiniCssExtractPlugin.loader : { loader: 'style-loader' };
// final style loader for production

module.exports = {
  mode: env,
  output: { publicPath: '/' },
  devServer: {
    hot: true,
    historyApiFallback: true,
  },
  entry: ['babel-polyfill', './src'], // this is where our app lives
  devtool: 'source-map', // this enables debugging with source in chrome devtools
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'eslint-loader',
          },
        ],
      },
      {
        test: /\.s?css/, // for all files of '.s?css'
        use: [
          finalCSSLoader,
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()],
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|json)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              useReltativePath: true,
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './200.html',
    }),
    new MiniCssExtractPlugin(),
  ],
};
