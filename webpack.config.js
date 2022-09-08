const path = require('path');

module.exports = {
  entry: './src/app.jsx',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /.jsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                "@babel/react"
              ],
            }
          }
        ]
      },
      {
        test: /.css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ],
  }
};
