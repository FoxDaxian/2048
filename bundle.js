(function () {
'use strict';

var foo = 'foo.js文件';

// import _ from 'lodash'
// console.log(_.defaults({ 'a': 1 }, { 'a': 3, 'b': 2 }));
// import npminfo from '../package.json'

console.log(foo);

var fn = function fn() {
	var _console;

	(_console = console).log.apply(_console, [1, 2, 3]);
};
fn();

}());
//# sourceMappingURL=bundle.js.map
