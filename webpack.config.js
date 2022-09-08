const path = require('path');

module.exports = {
  entry: './src/app.jsx',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /.jsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              babelrc: false,
              plugins: [
                [
                  "@babel/plugin-proposal-class-properties", 
                  { "loose": true }
                ]
              ],
              presets: [
                [
                  "@babel/preset-env", 
                  {
                    "targets": {
                      "chrome": "60"
                    }
                  }
                ],
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
