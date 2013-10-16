//define all the functions to refactor (either native or marked up)
var funcDefs = {
    jquery: {
        default: {
            convert: function (node) {
                node[0] = 'call';
            },
            chainable: true
        },
        //convert attr function to use setAttribute
        attr: {
            convert: function (node) {
                utils.renameFunc(node, 'setAttribute');
            },
            chainable: false
        },
        on: {
            convert: function (node) {
                utils.renameFunc(node, 'addEventListener');
            },
            chainable: false
        },
        append: {
            convert: function (node) {
                utils.renameFunc(node, 'appendChild');
            },
            chainable: false
        },
        prepend: {
            convert: function (node) {
                utils.renameFunc(node, 'insertBefore');
                utils.pushParam(node,["sub",["dot",node[1][1],"childNodes"],["num",0]])
            },
            chainable: false
        },
        jQselect: {
            convert: function (node) {
                var selector = node[2][0][1];
                node[0] = "call";
                node[1] = ["dot", ["name", "document"], "querySelector"];
                node[2] = [
                    ["string", selector]
                ];
            },
            chainable: true
        },
        jQhtml: {
            convert: function (node) {
                var html = node[2][0][1];
                node[0] = "call";
                node[1] = ["dot", ["name", "document"], "createElement"];
                node[2] = [
                    ["string", html]
                ];
            },
            chainable: true
        },
        jQwrapper: {
            convert: function(node) {

            },
            chainable: true
        }

    }
}
//helper util functions
var utils = {
    //rename helper
    renameFunc: function (node, name) {
        node[0] = 'call';
        node[1][2] = name;
    },
    pushParam: function (node, param) {
        node[2].push(param);
    }
}

module.exports = {funcDefs: funcDefs, utils: utils};