var def = require('./funcs.js');

var dejquery = {
    //counter for temporary variables
    varcounter: 0,
    //generic recursive traverse/visit
    traverse: function (node, visit, after) {
        var self = this;

        if (!after) {
            visit(node);
        }
        if (node instanceof Array) {
            for (var i = 0, len = node.length; i < len; i++) {
                self.traverse(node[i], visit, after || false);
            }
        }
        if (after) {
            visit(node);
        }
    },

    chainTraverse: function (node, base, newRoot, parent, index, tempvar) {
        var self = this;

        var isRoot = false;
        if (node instanceof Array) {
            var _base = base;
            var _newRoot = newRoot;
            var _tempvar = tempvar;
            if (node[0] === 'stat' && node[1] && node[1][0] === 'jQcallDot') {

                isRoot = true;
                _base = self.getBase(node[1], false);

                if (_base !== node[1] && _base !== node[1][1][1]) {
                    self.varcounter++;
                    _tempvar = 'djqTemp' + self.varcounter;
                    _newRoot = [
                        ["jQvar", [
                            [_tempvar, _base]
                        ]]
                    ];
                }
            }
            if (node !== base) {
                for (var i = 0, len = node.length; i < len; i++) {
                    self.chainTraverse(node[i], _base, _newRoot, node, i, _tempvar);
                }
            }
        }
        if (node[0] == 'jQcallDot' && newRoot.length > 0) {
            newRoot.push(["stat", ["jQcallDot", ["dot", ["name", tempvar], node[1][2]], node[2]]]);
        }
        if (isRoot && _newRoot.length > 0) {
            //replace stat with first
            parent[index] = _newRoot[0];
            //splice in the rest
            for (var i = 1, len = _newRoot.length; i < len; i++) {
                parent.splice(index + i, 0, _newRoot[i]);
            }
        }

    },

    getBase: function (node, base) {
        var self = this;

        if (node[0] !== 'jQcallDot') {
            var func = def.funcDefs.jquery[base[1][2]] || def.funcDefs.jquery.default;
            return func.chainable ? base : base[1][1];
        } else if (node instanceof Array) {
            var cr = node[0] === 'jQcallDot' ? node : base;
            if ((base[0] === 'jQcallDot' || base[0] === 'dot') && node[0] === 'dot') {
                var func = def.funcDefs.jquery[node[2]] || def.funcDefs.jquery.default;
                cr = func.chainable ? cr : node[1];
            }
            return self.getBase(node[1][1], cr);
        }
    },
    patternMatch: function (node, test) {
        try {
            return test(node);
        } catch (e) {
            return false;
        }
    }

}

module.exports = dejquery;
