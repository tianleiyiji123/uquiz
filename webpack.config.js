var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: "./js/common.js",
    output: {
        path:"./dist",
        filename: "./main.js"
    },
    module: {
        rules: [{
            test: /\.js$/,

            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            options: {
                presets: ['es2015']
            }
        }]
    }
};
