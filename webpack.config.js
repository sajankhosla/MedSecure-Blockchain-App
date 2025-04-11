const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['expo-router'],
      },
    },
    argv
  );

  // Add support for importing from 'app' directory
  config.resolve.modules = [
    path.resolve(__dirname, 'app'),
    path.resolve(__dirname, 'node_modules'),
  ];

  // Handle client-side routing in production
  config.output.publicPath = '/';

  // Copy index.html to output directory
  const CopyWebpackPlugin = require('copy-webpack-plugin');
  config.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'web-build/index.html'),
          to: path.resolve(__dirname, 'dist/index.html'),
        },
      ],
    })
  );

  return config;
}; 