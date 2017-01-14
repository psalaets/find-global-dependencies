/**
 * for every identifier that could be a var reference
 *   - search its scope and all parent scopes for a declaration
 *   - if declaration found, it's not a global
 *   - if no declaration found, it's a global
 *
 * potentially useful stuff
 *
 *   - path.getFunctionParent();
 *   - path.scope.hasBinding("n")
 */

var babylon = require('babylon');
var traverse = require('babel-traverse').default;

module.exports = findGlobalDeps;

function findGlobalDeps(code) {
  var globalDeps = new Set();

  var ast = babylon.parse(code);
  traverse(ast, {
    Identifier: {
      enter(path) {
        var identifierName = path.node.name;

        if (path.findParent(path => path.isMemberExpression())) {
          return;
        }

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
