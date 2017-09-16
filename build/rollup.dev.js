const path = require('path')
const json = require('rollup-plugin-json')
// commonjs 和 resolve 用来处理导入模块的, rollup 自身不具备导入外部模块的功能
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')

export default {
    input: path.resolve(__dirname, '../src/index.js'),
    output: {
        file: 'bundle.js',
        format: 'iife'
    },
    name: 'foxfox',
    plugins: [
        json(),
        resolve({
        	extensions: [ '.js', '.json' ]
        }),
        commonjs(),
        babel({
            exclude: 'node_modules/**'
        })
    ],
    sourcemap: true
}