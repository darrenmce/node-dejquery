var def = require('./funcs.js');

var jQuery = '$';
var allJQ = ['jQselect', 'jQDotcall', 'jQcallDot', 'jQwrapper', 'jQvar', 'jQhtml'];


var parse1Patterns = {
    jquery: [
        //a jquery selector
        [
            function (node) {
                return node[0] === 'call' &&
                    node[1][0] === 'name' &&
                    node[1][1] === jQuery &&
                    node[2][0][0] === 'string' &&
                    !(node[2][0][1].charAt(0) === "<" && node[2][0][1].charAt( node[2][0][1].length - 1 ) === ">" && node[2][0][1].length >= 3 )
            },
            function (node) {
                node[0] = 'jQselect';
            }
        ],
        //a jquery HTML selector/creator?
        [
            function (node) {
                return node[0] === 'call' &&
                    node[1][0] === 'name' &&
                    node[1][1] === jQuery &&
                    node[2][0][0] === 'string' &&
                    (node[2][0][1].charAt(0) === "<" && node[2][0][1].charAt( node[2][0][1].length - 1 ) === ">" && node[2][0][1].length >= 3 )
            },
            function (node) {
                node[0] = 'jQhtml';
            }
        ],
        //jquery element wrapper
        [
            function (node) {
                return node[0] === 'call' &&
                    node[1][0] === 'name' &&
                    node[1][1] === jQuery &&
                    node[2][0][0] === 'name';
            },
            function (node) {
                node[0] = 'jQwrapper';
            }
        ],
        //jquery vars
        [
            function (node) {
                return node[0] === 'var' &&
                    allJQ.indexOf(node[1][0][1][0]) !== -1;
            },
            function (node) {
                node[0] = 'jQvar';
            }
        ],
        // jQuery.func
        [
            function (node) {
                return node[0] === 'call' &&
                    node[1][0] === 'dot' &&
                    node[1][1][0] === 'name' &&
                    node[1][1][1] === jQuery;
            },
            function (node) {
                node[0] = 'jQDotcall';
            }
        ],
        //a dot command on a jquery root
        [
            function (node) {
                return node[0] === 'call' &&
                    node[1][0] === 'dot' &&
                    allJQ.indexOf(node[1][1][0]) !== -1;
            },
            function (node) {
                node[0] = 'jQcallDot';
            }
        ]
    ]
}

var parse2Patterns = {
    jquery: [
        //a jquery call (direct)
        [
            function (node) {
                return node[0] === 'jQselect';
            },
            def.funcDefs.jquery.jQselect.convert

        ],
        //a jquery html call (direct)
        [
            function (node) {
                return node[0] === 'jQhtml';
            },
            def.funcDefs.jquery.jQhtml.convert

        ],
        // jQuery.func
        [
            function (node) {
                return node[0] === 'jQvar';

            },
            function (node) {
                node[0] = 'var';
            }
        ],
        //a dot command on a jquery root
        [
            function (node) {
                return node[0] === 'jQcallDot';
            },
            function (node) {
                var func = node[1][2];
                var funcDef = def.funcDefs.jquery[func] || def.funcDefs.jquery.default;
                funcDef.convert(node);
            }
        ],
        //a jQuery dot call [ ex. $.get() ]
        [
            function (node) {
                return node[0] === 'jQDotcall';
            },
            function (node) {
                node[0] = 'call';
            }
        ],
        //a var wrapped by jquery
        [
            function (node) {
                return node[0] === 'jQwrapper';
            },
            function (node) {
                var name = node[2][0][1];
                node.length = 0;
                node.push("name", name);

            }
        ]
    ]
}

module.exports = {
    pattern1 : parse1Patterns,
    pattern2 : parse2Patterns
}