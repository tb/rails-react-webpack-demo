const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const StatsPlugin = require('stats-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// must match config.webpack.dev_server.port
const devServerPort = 3808;

const nodeEnv = process.env.NODE_ENV || process.env.RAILS_ENV || 'development';
const devBuild = nodeEnv == 'development';
const prodBuild = nodeEnv == 'production' || nodeEnv == 'staging';

const config = {
  context: __dirname,

  entry: {
    // Sources are expected to live in $app_root/webpack
    application: './src/index.js'
  },

  output: {
    filename: '[name]-bundle.js',
    path: '../public/webpack',
    publicPath: '/webpack/',
  },

  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.js', '.jsx', '.json', '.scss', '.css']
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!sass')
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
      },
    ],
  },

  postcss: [
    autoprefixer({
      browsers: ['last 2 version', 'IE >= 10']
    })
  ],

  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(nodeEnv)
      }
    }),
    // must match config.webpack.manifest_filename
    new StatsPlugin('manifest.json', {
      // We only need assetsByChunkName
      chunkModules: false,
      source: false,
      chunks: false,
      modules: false,
      assets: true
  })]
};

if (devBuild) {
  console.log('Webpack devBuild');

  config.devtool = 'eval-source-map';

  config.plugins = config.plugins.concat([
    new ExtractTextPlugin('[name]-bundle.css')
  ]);

  config.devServer = {
    host: '0.0.0.0',
    port: devServerPort,
    headers: { 'Access-Control-Allow-Origin': '*' },
    stats: 'minimal' // none (or false), errors-only, minimal, normal (or true) and verbose
  };
  config.output.publicPath = `//localhost:${devServerPort}/webpack/`;
}

if (prodBuild) {
  console.log('Webpack prodBuild');

  config.output.filename = '[name]-bundle-[hash].js';

  config.plugins = config.plugins.concat([
    // https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        drop_console: true
      },
      mangle: {
        except: ['$'],
        screw_ie8: true
      },
      sourceMap: false,
    }),
    new ExtractTextPlugin('[name]-bundle-[hash].css')
  ]);
}

module.exports = config;
