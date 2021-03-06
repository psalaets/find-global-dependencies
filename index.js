var babylon = require('babylon');
var traverse = require('babel-traverse').default;
var globals = require('globals');

module.exports = findGlobalDeps;

function findGlobalDeps(code, options = {}) {
  var environment = options.environment || ['es6', 'browser'];

  var globalDeps = new Set();
  var isIgnored = makeIgnoredGlobalChecker(environment);

  var ast = babylon.parse(code);
  traverse(ast, {
    Identifier: {
      enter(path) {
        if (isIgnored(path)) return;
        if (isInMemberExpression(path)) return;
        if (isObjectPropertyName(path)) return;
        if (isArguments(path)) return;
        if (isParamToCatchClause(path)) return;
        if (hasBinding(path)) return;

        globalDeps.add(path.node.name);
      }
    }
  });

  return globalDeps;
}

function hasBinding(path) {
  var parent = path.findParent(path => path.isBlock() || path.isFunction());
  var noGlobals = true;
  return parent.scope.hasBinding(path.node.name, noGlobals);
}

// is identifier the foo in `try {} catch (foo) {}`
function isParamToCatchClause(path) {
  var parent = path.findParent(path => path.isCatchClause());
  return !!parent && parent.node.param === path.node;
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

function makeIgnoredGlobalChecker(environment) {
  if (!Array.isArray(environment)) {
    throw new Error('environment must be an Array');
  }

  var listObjects = environment.map(name => globals[name] || invalidEnv(name));

  return function isOnIgnoreList(path) {
    var identifierName = path.node.name;
    return listObjects.some(listObject => identifierName in listObject);
  };
}

function invalidEnv(name) {
  throw new Error(`Invalid environment name: ${name}. Expected: ${Object.keys(globals).join(', ')}`);
}
