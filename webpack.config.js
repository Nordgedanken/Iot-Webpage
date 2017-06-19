const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        'bundle': './src/index.js',
        'theme': './src/index.scss'
    },
    module: {
        rules: [
            { test: /\.js$/, loader: 'source-map-loader', enforce: 'pre', exclude: /node_modules/, },
            { test: /\.js$/, loader: 'babel-loader', include: path.resolve('./src'), options: {sourceMap: true}, exclude: /node_modules/, },
            {
                test: /\.s?css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {loader: 'css-loader', options: {modules: true, minimize: true, importLoaders: 1, sourceMap: true}},
                        {loader: 'postcss-loader', options: {path: './postcss.config.js', sourceMap: true}}
                    ]
                })
            },
        ]
    },
    output: {
        path: path.join(__dirname, 'webapp'),

        // the generated js (and CSS, from the ExtractTextPlugin) are put in a
        // unique subdirectory for the build. There will only be one such
        // 'bundle' directory in the generated tarball; however, hosting
        // servers can collect 'bundles' from multiple versions into one
        // directory and symlink it into place - this allows users who loaded
        // an older version of the application to continue to access webpack
        // chunks even after the app is redeployed.
        //
        filename: 'bundles/[hash]/[name].js',
        chunkFilename: 'bundles/[hash]/[name].js',
        devtoolModuleFilenameTemplate: function(info) {
            // Reading input source maps gives only relative paths here for
            // everything. Until I figure out how to fix this, this is a
            // workaround.
            // We use the relative resource path with any '../'s on the front
            // removed which gives a tree with matrix-react-sdk and vector
            // trees smashed together, but this fixes everything being under
            // various levels of '.' and '..'
            // Also, sometimes the resource path is absolute.
            return path.relative(process.cwd(), info.resourcePath).replace(/^[\/\.]*/, '');
        },
    },
    plugins: [
        new CopyWebpackPlugin([{ from: './res', to: './' }]),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),

        new HtmlWebpackPlugin({
            template: './src/index.html',

            // we inject the links ourselves via the template, because
            // HtmlWebpackPlugin wants to put the script tags either at the
            // bottom of <head> or the bottom of <body>, and I'm a bit scared
            // about moving them.
            inject: true,
        }),
        new ExtractTextPlugin({
            filename: 'bundles/[hash]/[name].css',
            allChunks: true,
        }),
    ],
    resolve: {
        extensions: ['.css', '.scss', '.js', '.json'],
        alias: {
            // alias any requires to the react module to the one in our path, otherwise
            // we tend to get the react source included twice when using npm link.
            'react': path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
        },
    },
    devServer: {
        // serve unwebpacked assets from webapp.
        contentBase: './webapp',

        stats: {
            // don't fill the console up with a mahoosive list of modules
            chunks: false,
        },
    },
    devtool: 'source-map',
};