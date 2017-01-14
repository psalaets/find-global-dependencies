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
  var ast = babylon.parse(code);

  var globalDeps = [];

  traverse(ast, {
    Identifier: {
      enter(path) {
        var identifierName = path.node.name;

        var parent = path.getFunctionParent();
        var bindingExists = parent.scope.hasBinding(identifierName);

        if (!bindingExists && !globalDeps.includes(identifierName)) {
          globalDeps.push(identifierName);
        }
      }
    }
  });

  return globalDeps;
}
