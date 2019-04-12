const HtmlWebpackPlugin = require('html-webpack-plugin');
const env = process.env.NODE_ENV || 'development';
// 'produdction' or 'development' in env
module.exports = {
    mode: env,
    entry: ['babel-polyfill', './src'], // this is where our app lives
    devtool: 'source-map', // this enables debugging with source in chrome devtools
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
              {
                  loader: 'babel-loader'
              }
          ]
        },
      ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html',
        }),
    ],
  };