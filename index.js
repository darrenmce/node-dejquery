var fs = require('fs');
var jsp = require('uglify-js').parser;
var pro = require('uglify-js').uglify;

var patt = require('./patterns.js');
var def = require('./funcs.js');


var testFile = String(fs.readFileSync('testJs/content.js'));

var ast = jsp.parse(testFile);


//console.log(JSON.stringify(ast));


function traverse(node, visit, after) {
    if (!after) {
        visit(node);
    }
    if (node instanceof Array) {
        for (var i = 0, len = node.length; i < len; i++) {
            traverse(node[i], visit, after || false);
        }
    }
    if (after) {
        visit(node);
    }
}

function chainTraverse(node,base,root) {

    if (node instanceof Array) {
        var baseNode = base;
        var rootNode = root;
        if (node[0] === 'stat') {
            baseNode=false;
            rootNode = false;
        }
        if (!base && node[0]==='jQcallDot') {
            rootNode = node;
            baseNode = getBase(node);
        }

        for (var i = 0, len = node.length; i < len; i++) {
            chainTraverse(node[i], baseNode, rootNode);
        }
    }
    if (node[0]==='dot' && baseNode && rootNode) {
        //TODO utilize root and base to create new lines when chaining is false
    }

}

function getBase(node, base) {
    if (node[0] !== 'jQcallDot') {
        var func = def.funcDefs.jquery[base[1][2]] || def.funcDefs.jquery.default;
        return func.chainable ? base : base[1][1];
    } else if (node instanceof Array) {
        var cr = node[0] === 'jQcallDot' ? node : base;
        if ((base[0] === 'jQcallDot' || base[0] === 'dot') && node[0] === 'dot') {
            var func = def.funcDefs.jquery[node[2]] || def.funcDefs.jquery.default;
            cr = func.chainable ? cr : node[1];
        }
        return getBase(node[1][1], cr);
    }
}


function patternMatch(node, test) {
    try {
        return test(node);
    } catch (e) {
        return false;
    }
}


traverse(ast, function (node) {
    for (var library in patt.pattern1) {
        patt.pattern1[library].forEach(function (pattern) {
            if (patternMatch(node, pattern[0])) {
                pattern[1](node);
            }
        });
    }
}, true);

console.log(JSON.stringify(ast));

//de-chain
var jQcallRoot = ast[1][0][1];
console.log(jQcallRoot);
console.log(getBase(jQcallRoot,jQcallRoot));


//chainTraverse(ast, ast);
//console.log(JSON.stringify(ast));

traverse(ast, function (node) {
    for (var library in patt.pattern2) {
        patt.pattern2[library].forEach(function (pattern) {
            if (patternMatch(node, pattern[0])) {
                pattern[1](node);
            }
        });
    }
}, false);

//console.log(JSON.stringify(ast));

//console.log(pro.gen_code(ast, {beautify: true}));
