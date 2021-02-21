var path = require('path');
module.exports = (args) => {
  return {
    type: 'react-component',
    npm: {
      esModules: true,
      umd: {
        global: 'ReactLeafletCluster',
        externals: {
          react: 'React',
        },
      },
    },
    webpack: {
      config: (config) => {
        if (config.mode === 'development') {
          config.entry = './demo/src/index';
        } else {
          config.entry = './src/index';
        }
        return config;
      },
      extra: {
        resolve: {
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
        },
        module: {
          rules: [
            {test: /\.tsx$/, loader: 'ts-loader'},
            {
              test: /\.(ts|tsx)$/,
              enforce: 'pre',
              loader: 'eslint-loader',
              exclude: /node_modules/,
            },
            
          ],
        },
      },
    },
  };
};
