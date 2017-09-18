import './scss/index.scss'
import './css/index.css'

import foo from './javascript/foo.js'
// import _ from 'lodash' // Rollup只能对ES模块上进行tree-shaking。CommonJS模块 - 像lodash和jQuery那样写的模块不能进行tree-shaking。
import npminfo from '../package'


console.log(ENV)
console.log(foo)
