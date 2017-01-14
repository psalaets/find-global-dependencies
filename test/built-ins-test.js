var test = require('tape');
var globals = require('globals');
var setEquals = require('./set-equals-helper');

var find = require('..');

test('ignores javascript built-ins', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.builtin).join('\n')}
  `;
  var result = find(code);

  setEquals(t, result, new Set([]));
});

test('can also ignore browser built-ins', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.builtin).join('\n')}
    ${Object.keys(globals.browser).join('\n')}
  `;
  var result = find(code, {
    additionalIgnoreLists: ['browser']
  });

  setEquals(t, result, new Set([]));
});

test('can also ignore node built-ins', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.builtin).join('\n')}
    ${Object.keys(globals.node).join('\n')}
  `;
  var result = find(code, {
    additionalIgnoreLists: ['node']
  });

  setEquals(t, result, new Set([]));
});

test('can also ignore serviceworker built-ins', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.builtin).join('\n')}
    ${Object.keys(globals.worker).join('\n')}
  `;
  var result = find(code, {
    additionalIgnoreLists: ['worker']
  });

  setEquals(t, result, new Set([]));
});

test('can also ignore commonjs built-ins', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.builtin).join('\n')}
    ${Object.keys(globals.commonjs).join('\n')}
  `;
  var result = find(code, {
    additionalIgnoreLists: ['commonjs']
  });

  setEquals(t, result, new Set([]));
});

test('can also ignore amd built-ins', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.builtin).join('\n')}
    ${Object.keys(globals.amd).join('\n')}
  `;
  var result = find(code, {
    additionalIgnoreLists: ['amd']
  });

  setEquals(t, result, new Set([]));
});

test('can ignore any combo of additional built-ins', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.builtin).join('\n')}
    ${Object.keys(globals.browser).join('\n')}
    ${Object.keys(globals.node).join('\n')}
    ${Object.keys(globals.worker).join('\n')}
    ${Object.keys(globals.commonjs).join('\n')}
    ${Object.keys(globals.amd).join('\n')}
  `;
  var result = find(code, {
    additionalIgnoreLists: 'browser node worker commonjs amd'.split(' ')
  });

  setEquals(t, result, new Set([]));
});

test('blows up when given unknown additional ignores list', function(t) {
  t.plan(1);


  var code = `foo`;

  t.throws(() => {
    find(code, {
      additionalIgnoreLists: ['asdf']
    });
  }, /Invalid ignore list/);
});
