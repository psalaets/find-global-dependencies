var test = require('tape');
var setEquals = require('./set-equals-helper');

var find = require('..');

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

test('ignores function declared at higher level', function(t) {
  t.plan(1);

  var code = `
    function foo() {
      return 1;
    }

    function bar() {
      return foo;
    }
  `;
  var result = find(code);

  setEquals(t, result, new Set());
});

test('ignores class declared at higher level', function(t) {
  t.plan(1);

  var code = `
    class Foo {}

    function bar() {
      return Foo;
    }
  `;
  var result = find(code);

  setEquals(t, result, new Set());
});

test('ignores function expression using its name', function(t) {
  t.plan(1);

  var code = `
    var blah = function foo() {
      return foo(4);
    };
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

  setEquals(t, result, new Set());
});

test('finds global on left side of member access', function(t) {
  t.plan(1);

  var code = `
    foo.name;
  `;
  var result = find(code);

  setEquals(t, result, new Set(['foo']));
});

test('finds multiple accesses at various levels', function(t) {
  t.plan(1);

  var code = `
    foo();

    function asdf() {
      return bar;
    }
  `;
  var result = find(code);

  setEquals(t, result, new Set(['foo', 'bar']));
});

test('finds use in computed property name', function(t) {
  t.plan(1);

  var code = `
    var a = {
      [foo]: 4
    };
  `;
  var result = find(code);

  setEquals(t, result, new Set(['foo']));
});

test('finds use in array spread', function(t) {
  t.plan(1);

  var code = `
    var a = [...foo];
  `;
  var result = find(code);

  setEquals(t, result, new Set(['foo']));
});

test('ignores arguments object in function', function(t) {
  t.plan(1);

  var code = `
    function a() {
      return arguments;
    }
  `;
  var result = find(code);

  setEquals(t, result, new Set());
});

test('ignores this in function', function(t) {
  t.plan(1);

  var code = `
    function a() {
      return this;
    }
  `;
  var result = find(code);

  setEquals(t, result, new Set());
});

test('ignores this at top level', function(t) {
  t.plan(1);

  var code = `
    this;
  `;
  var result = find(code);

  setEquals(t, result, new Set());
});

test('ignores let in a block', function(t) {
  t.plan(1);

  var code = `
    {
      let foo = 9;
      foo + 3;
    }
  `;
  var result = find(code);

  setEquals(t, result, new Set());
});

test('ignores const in a block', function(t) {
  t.plan(1);

  var code = `
    {
      const foo = 9;
      foo + 3;
    }
  `;
  var result = find(code);

  setEquals(t, result, new Set());
});

test('ignores property names in object literal', function(t) {
  t.plan(1);

  var code = `
    var a = {
      name: 'bob'
    };
  `;
  var result = find(code);

  setEquals(t, result, new Set());
});

test('ignores non-global shorthand property in object literal', function(t) {
  t.plan(1);

  var code = `
    var name = 'bob';
    var a = {
      name
    };
  `;
  var result = find(code);

  setEquals(t, result, new Set());
});

test('finds global shorthand property in object literal', function(t) {
  t.plan(1);

  var code = `
    var a = {
      foo
    };
  `;
  var result = find(code);

  setEquals(t, result, new Set(['foo']));
});

test('ignores param to a catch()', function(t) {
  t.plan(1);

  var code = `
    try {

    } catch (e) {

    }
  `;
  var result = find(code);

  setEquals(t, result, new Set());
});
