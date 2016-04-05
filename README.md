## 前言

本次开发基于之前的 lint 工具调研结果, 已完成 csshint eslint 迁移至 rake-zbj.

## 调试方法

1. 进入需要测试的 fis 项目 例如 fe-lint-test 执行下列任意代码

npm install 安装rake-zbj

// 将这块配置移至 rake-zbj 配置文件 rake.js 中

//配置 eslint
fis.config.set('settings.lint.eslint', {
    target: ['**/*.js', '!node_modules/**'],
    ignored: ['static/lib/**', 'js-conf.js', /jquery\.js$/i],
    rules: {
        "camelcase": [2, {"properties": "always"}],
        "indent": 2,
        "space-after-keywords": 2,
        "space-infix-ops": 2,
        "comma-spacing": [2, {"before": false, "after": true}],
        "brace-style": 2,
        "semi": 2,
        "curly": 2,
        "newline-after-var": 2,
        "comma-dangle": [2, "never"],
        "no-constant-condition": 2,
        "no-debugger": 2,
        "no-console": 2,
        "no-dupe-args": 2,
        "no-dupe-keys": 2,
        "no-duplicate-case": 2,
        "no-ex-assign": 2,
        "no-extra-boolean-cast": 2,
        "no-func-assign": 2,
        "no-inner-declarations": 2,
        "no-irregular-whitespace": 2,
        "no-negated-in-lhs": 2,
        "no-obj-calls": 2,
        "no-unexpected-multiline": 2,
        "no-unreachable": 2,
        "use-isnan": 2,
        "valid-typeof": 2,
        "no-undef": 2,
        "no-use-before-define": 1,
        "no-unused-vars": 1,
        "no-eval": 1
    }
});

//配置 csshint
fis.config.set('settings.lint.csshint', {
    target: ['**/*.css', '**/*.less', '!node_modules/**'],
    ignored: ['static/lib/**.css', 'static/lib/**.less'],
    rules: {
        'max-length': 120,
        'block-indent': ['    ', 0],
        'no-bom': true,
        'always-semicolon': true,
        'disallow-expression': true,
        'universal-selector': true,
        'vendor-prefixes-sort': true,
        'disallow-important': true,
        'unifying-color-case-sensitive': true,
        'shorthand': ['color'],
        'zero-unit': true,
        'disallow-overqualified-elements': true,
        'font-family-space-in-quotes': true,
        'max-selector-nesting-level': 4
    }
});

将 lint 工具放入 rake-zbj 项目 (例如 \fe-lint-test\node_modules\rake-zbj\node_modules)


Node --debug --debug-brk  ./node_modules/rake-zbj/bin/rake lint -j (eslint 检测)

Node --debug --debug-brk  ./node_modules/rake-zbj/bin/rake lint -c (csshint 检测)
 
Node --debug --debug-brk  ./node_modules/rake-zbj/bin/rake lint -h 

2. 控制台执行 node-inspector


## 开发分支 

1. master 主分支 稳定版本

2. dev 开发版本 暂时搁置引入 promise 功能


## 目前需要优化的地方

1. 错误提示信息格式需要统一, 目前 csshint 错误提示信息需要参考 eslint 进行优化

2. 目前不支持同时检测 js css  

3. npm 发布 , 由超哥统一发布维护.
