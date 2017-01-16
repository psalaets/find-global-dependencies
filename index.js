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
        if (isOnIgnoreList(path)) return;
        if (isInMemberExpression(path)) return;
        if (isObjectPropertyName(path)) return;
        if (isArguments(path)) return;
        if (hasBinding(path)) return;

        globalDeps.add(path.node.name);
      }
    }
  });

  return globalDeps;
}

function hasBinding(path) {
  var parent = path.findParent(path => path.isBlock() || path.isFunction())
  return parent.scope.hasBinding(path.node.name, true);
}

function isArguments(path) {
  return path.node.name === 'arguments';
}

// is identifier the foo in `{foo: 5}`
function isObjectPropertyName(path) {
  var parent = path.parentPath;
  if (parent.isObjectProperty()) {
    return !parent.node.computed && parent.node.key === path.node;
  }
  return false;
}

// is identifier the foo in `obj.foo`
function isInMemberExpression(path) {
  var parent = path.parentPath;
  if (parent.isMemberExpression()) {
    return !parent.node.computed && parent.node.property === path.node;
  }
  return false;
}

function makeIgnoreListChecker(listNames) {
  var listObjects = listNames.map(name => globals[name] || invalidList(name));
  // always ignore builtins
  listObjects.unshift(globals.builtin);

  return function isOnIgnoreList(path) {
    var identifierName = path.node.name;
    return listObjects.some(listObject => identifierName in listObject);
  };
}

function invalidList(name) {
  throw new Error(`Invalid ignore list: ${name}. Expected: ${Object.keys(globals).join(', ')}`);
}
