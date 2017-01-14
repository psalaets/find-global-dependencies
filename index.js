var babylon = require('babylon');
var traverse = require('babel-traverse').default;
var globals = require('globals');

module.exports = findGlobalDeps;

function findGlobalDeps(code, options = {additionalIgnoreLists: []}) {
  var globalDeps = new Set();

  var ast = babylon.parse(code);
  traverse(ast, {
    Identifier: {
      enter(path) {
        if (path.findParent(path => path.isMemberExpression())) {
          return;
        }

        var identifierName = path.node.name;

        var isIgnored = options.additionalIgnoreLists.some(listName => {
          var listObject = globals[listName];
          return identifierName in listObject;
        });

        if (isIgnored) return;

        var parent = path.findParent(path => path.isBlock() || path.isFunction())
        var bindingExists = parent.scope.hasBinding(identifierName);

        if (!bindingExists) {
          globalDeps.add(identifierName);
        }
      }
    }
  });

  return globalDeps;
}
