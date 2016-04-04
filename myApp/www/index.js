/**
 * Created by fanghui on 2016/3/30.
 */
require('./css/style.css');
let funcs = require('./assets/funcs.js');
let sprintf = require('sprintf');
let config = require('./js/config.cli.js');
let my = require('./js/my_ionic.js');
_.extendOwn(window, funcs, sprintf, my, {config:config}, {pre:''});
require('./js/app.js');
require('./assets/rest-service.js');
require('./js/my-util.js');
require('./js/controllers.js');
require('./js/ctrl-sass.js');
require('./js/ctrl-lens.js');
require('./js/my-svr-share.js');
require('./js/my-ionic.js');
require('./js/services.js');
