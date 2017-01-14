var test = require('tape');
var find = require('.');

test('finds access at top level', function(t) {
  t.plan(1);

  var code = 'foo + 3';
  var result = find(code);

  t.deepEquals(result, ['foo']);
});

test('ignores declared variable at top level', function(t) {
  t.plan(1);

  var code = `
    var foo;
    foo = 4;
  `;
  var result = find(code);

  t.deepEquals(result, []);
});

test('finds access in function', function(t) {
  t.plan(1);

  var code = `
    function bar() {
      return foo;
    }
  `;
  var result = find(code);

  t.deepEquals(result, ['foo']);
});

test('ignores parameter access in function', function(t) {
  t.plan(1);

  var code = `
    function bar(foo) {
      return foo;
    }
  `;
  var result = find(code);

  t.deepEquals(result, []);
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

  t.deepEquals(result, []);
});
