var babylon = require('babylon');
var traverse = require('babel-traverse').default;

module.exports = findGlobalDeps;

function findGlobalDeps(code) {
  var globalDeps = new Set();

  var ast = babylon.parse(code);
  traverse(ast, {
    Identifier: {
      enter(path) {
        if (path.findParent(path => path.isMemberExpression())) {
          return;
        }

        var identifierName = path.node.name;
        var parent = path.getFunctionParent();
        var bindingExists = parent.scope.hasBinding(identifierName);

        if (!bindingExists) {
          globalDeps.add(identifierName);
        }
      }
    }
  });

  return globalDeps;
}
