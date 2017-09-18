const path = require('path')
// 解析json
const json = require('rollup-plugin-json')
// commonjs 和 resolve 用来处理导入模块的, rollup 自身不具备导入外部模块的功能
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
// babel
const babel = require('rollup-plugin-babel')
// env 环境变量
const replace = require('rollup-plugin-replace')
// 压缩js
const uglify = require('rollup-plugin-uglify')

// css 还差如何把css插入html？？？
const sass = require('node-sass')
const postcss = require('rollup-plugin-postcss')
const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')

// liveReload 和 服务器
const livereload = require('rollup-plugin-livereload')
const serve = require('rollup-plugin-serve')

// 显示当前打包进度
const progress = require('rollup-plugin-progress')

// sass预处理函数
const sassPreprocessor = (content, id) => new Promise((resolve) => {
    const result = sass.renderSync({ file: id })
    resolve({ code: result.css.toString() })
})

// 当前开发模式
const mode = process.env.NODE_ENV

const rollup = {
    name: 'fox',
    input: path.resolve(__dirname, '../src/index.js'),
    output: {
        file: path.resolve(__dirname, '../dist/bundle.js'),
        format: 'umd'
    },
    plugins: [
        json(),
        // 处理scss
        postcss({
            // 这个属性，如果提取css，就不会插入到head里
            extract: mode === 'development' ? false : false,
            sourceMap: true,
            extensions: ['.scss'],
            preprocessor: sassPreprocessor, // 预处理import的sass
            plugins: [
                autoprefixer(),
                cssnano()
            ]
        }),
        // 处理css
        postcss({
            extract: mode === 'development' ? false : false,
            extensions: ['.css'],
            plugins: [
                autoprefixer(),
                cssnano()
            ]
        }),
        resolve({
            jsnext: true,
            main: true,
            browser: true,
            extensions: ['.js', '.json']
        }),
        commonjs({

        }),
        babel({
            exclude: 'node_modules/**'
        }),
        replace({
            exclude: 'node_modules/**',
            ENV: JSON.stringify(mode)
        }),
        (process.env.NODE_ENV === 'production' && uglify()),
        (process.env.NODE_ENV === 'production' && progress({
            clearLine: false
        }))
    ],
    sourcemap: true
}

if (mode === 'development') {
    const SERVE = serve({
        open: true,
        contentBase: path.resolve(__dirname, '../')
    })
    const LIVERELOAD = livereload({
        watch: path.resolve(__dirname, '../')
    })
    rollup.plugins.push(SERVE)
    rollup.plugins.push(LIVERELOAD)
}

export default rollup