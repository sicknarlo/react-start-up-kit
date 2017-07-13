/* eslint-env node */
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');

const outputPath = path.resolve(__dirname, 'server', 'public');

const extractTextPlugin = new ExtractTextPlugin({
    filename: '[name].css'
});

const appCommonsPlugin = new CommonsChunkPlugin({
    name: 'app',
    async: 'commons.js',
    chunks: ['app']
});

const reactCommonsPlugin = new CommonsChunkPlugin({
    name: 'react',
    filename: 'reactStack.js',
    minChunks: Infinity
});

// Injects module automatically
// Used to avoid importing React explicitly when using JSX
const provide = new ProvidePlugin({
    React: 'react'
});

const copyFiles = new CopyWebpackPlugin([
    {
        // Copy DLS SVG sprite to images folder so it gets served
        from: './node_modules/@uship/dls/lib/svg/*.svg',
        to: outputPath,
        toType: 'dir',
        flatten: true
    },
    {
        // Copy fake uship and bootsrap files to mimic production environment
        from: './fake-*.js',
        to: outputPath,
        toType: 'dir'
    }
]);

const webpackNotifier = new WebpackNotifierPlugin({ title: 'Frontend Scaffold' });

// production settings
const forceProduction = new webpack.DefinePlugin({
    // A common mistake is not stringifying the "production" string.
    'process.env.NODE_ENV': JSON.stringify('production')
});

const uglifyJs = new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
});

const plugins = [
    provide,
    copyFiles,
    appCommonsPlugin,
    reactCommonsPlugin,
    extractTextPlugin,
    webpackNotifier
];

if (process.env.NODE_ENV === 'production') {
    plugins.push(forceProduction, uglifyJs);
}

const devtool = process.env.NODE_ENV === 'production' ? undefined : 'source-map';
// end of production settings

module.exports = {
    entry: {
        app: './src/mount.js',
        react: [
            'react',
            'react-dom',
            'immutable',
            'omniscient',
            'immstruct',
            // 'react-router-dom',
            'core-js/es6/promise',
            'core-js/es6/string',
            'core-js/es6/symbol',
            'core-js/modules/es6.array.find',
            'core-js/modules/es7.array.includes'
        ]
    },

    output: {
        path: outputPath,
        filename: '[name].js',
        chunkFilename: '[chunkhash].js'
    },

    externals: {
        uship: 'uship'
    },

    devtool,

    stats: {
        children: false
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader',
                ],
                exclude: [
                    path.resolve(__dirname, './node_modules/@uship/dls/node_modules')
                ],
                include: [
                    path.resolve(__dirname, './src'),
                    path.resolve(__dirname, './node_modules/@uship/dls/')
                ]
            },
            {
                test: /.(png|woff(2)?|eot|ttf|svg|jpg)(\?[a-z0-9=.]+)?$/,
                use: [
                    { loader: 'url-loader', options: { limit: 10000 }}
                ]
            },
            {
                test: /\.(scss|css)?$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 2 }},
                        'postcss-loader',
                        'sass-loader'
                    ]
                })
            }
        ]
    },

    plugins
};
