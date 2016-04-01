/**
 * @file gulp配置
 * @author fanghui
 */
var VERSION = require('../package.json').version;
var serve = require('browser-sync');
var path = require('path');
var root = 'www';

function resolveToApp(files) {
    return path.join(root, files);
}
module.exports = {
    banner: '/*!\n'
    + ' * fanghui\n'
    + ' * @license MIT\n'
    + ' * v' + VERSION + '\n'
    + ' */\n',
    output: 'www/build',
    entry: 'www/js/app.js',
    root: root,
    paths: {
        js: resolveToApp('/**/*.js'),
        html: [
            resolveToApp('**/*.html')
        ],
        styl: resolveToApp('**/*.css')
    },
    serve: serve
};
