var babylon = require('babylon');
var traverse = require('babel-traverse').default;
var globals = require('globals');

module.exports = findGlobalDeps;

function findGlobalDeps(code, options = {additionalIgnoreLists: []}) {
  var globalDeps = new Set();
  var isOnIgnoreList = makeIgnoreListChecker(options.additionalIgnoreLists);

  var ast = babylon.parse(code);
  traverse(ast, {
    Identifier: {
      enter(path) {
        if (path.findParent(path => path.isMemberExpression())) {
          return;
        }

        var identifierName = path.node.name;

        if (isOnIgnoreList(identifierName)) {
          return;
        }

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

function makeIgnoreListChecker(listNames) {
  var listObjects = listNames.map(name => globals[name] || invalidList(name));

  return function isOnIgnoreList(identifierName) {
    return listObjects.some(listObject => identifierName in listObject);
  };
}

function invalidList(name) {
  throw new Error(`Invalid ignore list: ${name}. Expected: ${Object.keys(globals).join(', ')}`);
}
