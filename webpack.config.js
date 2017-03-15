const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')

const pkg = require('./package.json')

const TARGET = process.env.npm_lifecycle_event || ''
const ROOT_PATH = __dirname
const config = {
  paths: {
    dist: path.join(ROOT_PATH, 'dist'),
    src: path.join(ROOT_PATH, 'src'),
    docs: path.join(ROOT_PATH, 'docs')
  },
  filename: pkg.name,
  library: pkg.name
}

process.env.BABEL_ENV = TARGET

const common = {
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.png', '.jpg']
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: ['catalog/lib/loader', 'raw-loader']
      },
      {
        test: /\.jpg$/,
        use: ['file-loader'],
        include: config.paths.docs
      }
    ]
  }
}

const siteCommon = {
  plugins: [
    new HtmlWebpackPlugin({
      template: require('html-webpack-template'),
      inject: false,
      mobile: true,
      title: pkg.name,
      appMountId: 'app'
    }),
    new webpack.DefinePlugin({
      NAME: JSON.stringify(pkg.name),
      VERSION: JSON.stringify(pkg.version),
      USER: JSON.stringify(pkg.user)
    })
  ]
}

if (TARGET === 'start') {
  module.exports = merge(common, siteCommon, {
    devtool: 'eval-source-map',
    entry: {
      docs: [config.paths.docs]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"development"'
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.jsx?$/,
          use: ['babel-loader?cacheDirectory'],
          include: [
            config.paths.docs,
            config.paths.src
          ]
        }
      ]
    },
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      host: process.env.HOST,
      port: process.env.PORT,
      stats: 'errors-only'
    }
  })
}

const distCommon = {
  devtool: 'source-map',
  output: {
    path: config.paths.dist,
    libraryTarget: 'umd',
    library: config.library
  },
  entry: config.paths.src,
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React'
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        include: config.paths.src
      }
    ]
  }
}

if (TARGET === 'dist') {
  module.exports = merge(distCommon, {
    output: {
      filename: `${config.filename}.js`
    }
  })
}

if (TARGET === 'dist:min') {
  module.exports = merge(distCommon, {
    output: {
      filename: `${config.filename}.min.js`
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true
      })
    ]
  })
}

if (!TARGET) {
  module.exports = common
}
