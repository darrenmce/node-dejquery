var fs = require('fs');
var jsp = require('uglify-js').parser;
var pro = require('uglify-js').uglify;

var patt = require('./patterns.js');
var djq = require('./dejquery.js');


//read the input JS
var testFile = String(fs.readFileSync('testJs/content.js'));

//parse into AST
var ast = jsp.parse(testFile);


djq.traverse(ast, function (node) {
    for (var library in patt.pattern1) {
        patt.pattern1[library].forEach(function (pattern) {
            if (djq.patternMatch(node, pattern[0])) {
                pattern[1](node);
            }
        });
    }
}, true);

console.log(JSON.stringify(ast));

//de-chain
djq.chainTraverse(ast, false, []);

console.log(JSON.stringify(ast));

djq.traverse(ast, function (node) {
    for (var library in patt.pattern2) {
        patt.pattern2[library].forEach(function (pattern) {
            if (djq.patternMatch(node, pattern[0])) {
                pattern[1](node);
            }
        });
    }
}, false);

console.log(JSON.stringify(ast));

console.log(pro.gen_code(ast, {beautify: true}));
