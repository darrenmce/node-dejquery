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
        }
    }
}
//helper util functions
var utils = {
    //rename helper
    renameFunc: function (node, name) {
        node[0] = 'call';
        node[1][2] = name;
    }
}

module.exports = {funcDefs: funcDefs, utils: utils};