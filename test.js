var test = require('tape');
var find = require('.');

test('finds access at top level', function(t) {
  t.plan(1);

  var code = 'foo + 3';
  var result = find(code);

  setEquals(t, result, new Set(['foo']));
});

test('ignores declared variable at top level', function(t) {
  t.plan(1);

  var code = `
    var foo;
    foo = 4;
  `;
  var result = find(code);

  setEquals(t, result, new Set());
});

test('finds access in function', function(t) {
  t.plan(1);

  var code = `
    function bar() {
      return foo;
    }
  `;
  var result = find(code);

  setEquals(t, result, new Set(['foo']));
});

test('ignores parameter access in function', function(t) {
  t.plan(1);

  var code = `
    function bar(foo) {
      return foo;
    }
  `;
  var result = find(code);

  setEquals(t, result, new Set());
});

test('ignores variable declared at higher level', function(t) {
  t.plan(1);

  var code = `
    var foo;

    function bar() {
      return foo;
    }
  `;
  var result = find(code);

  setEquals(t, result, new Set());
});

test('ignores property access', function(t) {
  t.plan(1);

  var code = `
    var foo;
    foo.name;
  `;
  var result = find(code);

  setEquals(t, result, new Set([]));
});

function setEquals(t, set1, set2) {
  t.deepEquals([...set1], [...set2]);
}
