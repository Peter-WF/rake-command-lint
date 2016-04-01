'use strict';

require('colors');
var fs = require('fs');
var cssHint = require('csshint');
var CLIEngine = require("eslint").CLIEngine;


var conf;
var lintFunction;

var ignored = [];
function ifInclude(root, fileName) {
    if (conf.ignored) {
        if (typeof conf.ignored === 'string' || fis.util.is(conf.ignored, 'RegExp')) {
            ignored = [conf.ignored];
        } else if (fis.util.is(conf.ignored, 'Array')) {
            ignored = conf.ignored;
        }
        delete conf.ignored;
    }
    if (ignored) {
        for (var i = 0, len = ignored.length; i < len; i++) {
            if (fis.util.filter(root + fileName, ignored[i])) {
                return false;
            }
        }
    }
    return true;
}
function getAllFiles(root, callback) {
    var files = fs.readdirSync(root);
    files.forEach(function (file) {
        // 文件路径
        var pathname = root + '/' + file;
        var stat = fs.lstatSync(pathname);

        if (!stat.isDirectory()) {
            //是否是我们需要验证的
            if (ifInclude(root, file)) {
                fs.readFile(pathname, function (err, data) {
                    if (err) {
                        return console.error(err);
                    }
                    callback(pathname, data.toString());
                });
            }

        } else {
            getAllFiles(pathname, callback);
        }
    });
}


/**
 * make array value unique
 * @param  {Array} arr A array which would be checked
 * @return {Array}     A array which value is unique
 */
function arrUniq(arr) {
    var tmpArr = [],
        tmpObj = {},
        tmp;
    for(var i=0; i< arr.length; i++) {
        tmp = arr[i];
        if (!tmpObj[tmp]) {
            tmpArr.push(tmp);
            tmpObj[tmp] = true;
        }
    }
    return tmpArr;
}
/**
 * formatter
 * @param  {Array} results The result of linter
 * @example
 * resultes = [ {
 *  filePath: '<text>',
    messages: [ {
    	ruleId: 'no-undef',
    	severity: 2,
    	message: '\'b\' is not defined.',
    	line: 7,
    	column: 8,
    	nodeType: 'Identifier',
    	source: '\ta = a+b;'
    } ],
    errorCount: 1,
    warningCount: 0
    } ]
 * @return {String}         The result message
 * @example
 *    7:8  error  'b' is not defined.  no-undef
 8:2  error  'wlskd' is not defined.  no-undef
 2 problem  (2 errors, 0 warnings)
 */
function formatter(results) {
    if (!results) {
        throw new Error('Type Error: is an invalid results!');
    }
    var msg = '';
    results = results[0];

    var err = results.errorCount,
        warn = results.warningCount;

    var total = err + warn;
    var messages = results.messages;

    messages.forEach(function(msgItem) {
        var ruleId = msgItem.ruleId,
            line = msgItem.line,
            col = msgItem.column,
            desc = msgItem.message,
            severity = msgItem.severity;
        var type = severity == 1 ? 'warning'.yellow : 'error'.red; // error type

        // 7:8  error  'b' is not defined  no-undef
        msg += '\n  ' + line + ':' + col + '  ' + type + '  ' + desc + '  ' + ruleId + '\n';
    });

    // 1 problem (1 error, 0 warnings)
    var count = '\n  ' + total + ' problem  (' + err + ' errors, ' + warn +' warnings)';
    msg += count.bold.yellow;
    return msg;
}
// js lint
function jsCheck(pathname, fileContent) {
    var CLIEngine = require("eslint").CLIEngine;
    var cli = new CLIEngine(conf);
    var report = cli.executeOnText(fileContent);

    if (report.errorCount || report.warningCount) {
        var msg = formatter(report.results);
        console.log('%s  %s \n%s', pathname, 'fail!'.red, msg);
        return;
    }
}

// css lint
function cssCheck(pathname, fileContent) {
    cssHint.checkString(fileContent, conf.rules).then(function (invalidList) {

        var resultArr = []; // 结果信息数组

        if (!invalidList.length) {
            return;
        }

        invalidList[0].messages.forEach(function (message) {
                var ruleName = message.ruleName || '';
                var msg = '→ ' + ruleName + ' ';

                // 全局性的错误可能没有位置信息
                if (typeof message.line === 'number') {
                    msg += ('line ' + message.line);
                    if (typeof message.col === 'number') {
                        msg += (', col ' + message.col);
                    }
                    msg += ': ';
                }

                msg += message.colorMessage || message.message;
                resultArr.push(msg);
            }
        );

        var reports = {
            path: invalidList[0].path,
            result: resultArr,
            success: false
        };
        var output = 'path ' + pathname + '\n';

        reports.result.forEach(function (item) {
            output += (item + '\n');
        });
        console.log(output);
    });
}

function run() {
    getAllFiles("/Users/Peter/Documents/Work/fis-project/fis-lint-test/static", function (pathname, fileContent) {
        //console.log(fileContent);
        lintFunction(pathname, fileContent);
    });
}
exports.name = 'lint';
exports.desc = 'scaffold tools. Initialize a rake-zbj project';
exports.register = function (commander) {

    commander
        .command('project')
        .description('a PC-Lint tool with rake-zbj project');


    commander.action(function () {
        var currentOption = "html";
        if (currentOption == "js") {
            // eslint 插件 config
            conf = fis.config.data.settings.lint.eslint;
            lintFunction = jsCheck;
        } else if (currentOption == "css") {
            // csshint 插件 config
            conf = fis.config.data.settings.lint.csshint;
            lintFunction = cssCheck;
        } else if (currentOption == "html") {
            // htmlhint 插件 config
            conf = fis.config.data.settings.lint.htmlhint;
        }
        run();
    });

};



