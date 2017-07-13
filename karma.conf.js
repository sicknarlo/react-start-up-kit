// Karma configuration
/*eslint-env node*/
const path = require('path');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');

const providePlugin = new ProvidePlugin({ React: 'react' });
const replacePlugin = new NormalModuleReplacementPlugin(/\.(css|scss)$/, 'node-noop');

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha'],


        // list of files / patterns to load in the browser
        files: [
            'fake-uship.js',
            'tests/index.js',
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'tests/index.js': ['webpack', 'sourcemap']
        },

        webpack: {
            devtool: 'inline-source-map',
            externals: [{
                uship: 'uship',
                'react/addons': true,
                'react/lib/ExecutionEnvironment': true,
                'react/lib/ReactContext': true
            }],
            resolve: {
                alias: {
                    src: path.resolve(__dirname, 'src')
                }
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        include: [
                            path.resolve('./src'),
                            path.resolve('./tests'),
                            path.resolve(__dirname, './node_modules/@uship/dls/')
                        ],
                        exclude: [
                            path.resolve(__dirname, './node_modules/@uship/dls/node_modules')
                        ],
                        use: [
                            { loader: 'babel-loader', options: { cacheDirectory: true }}
                        ]
                    }
                ]
            },
            plugins: [replacePlugin, providePlugin]
        },

        webpackServer: {
            noInfo: true
        },


        coverageReporter: {
            reporters: [
                { type: 'html', subdir: 'html' }
            ]
        },

        mochaReporter: {
            colors: {
                error: 'bgRed'
            }
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'coverage'],

        browserNoActivityTimeout : 20000,

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        customLaunchers: {
        },


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
}
