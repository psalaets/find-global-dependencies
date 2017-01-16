var test = require('tape');
var globals = require('globals');
var setEquals = require('./set-equals-helper');

var find = require('..');

test('ignores javascript built-ins by default', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.builtin).join('\n')}
  `;
  var result = find(code);

  setEquals(t, result, new Set());
});

test('ignores browser built-ins by default', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.browser).join('\n')}
  `;
  var result = find(code);

  setEquals(t, result, new Set());
});

test('finds node built-ins by default', function(t) {
  t.plan(1);

  var code = `
    process;
  `;
  var result = find(code);

  setEquals(t, result, new Set(['process']));
});

test('ignores node built-ins in node environment', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.node).join('\n')}
  `;
  var result = find(code, {
    environment: ['node']
  });

  setEquals(t, result, new Set());
});

test('finds serviceworker built-ins by default', function(t) {
  t.plan(1);

  var code = `
    FetchEvent;
  `;
  var result = find(code);

  setEquals(t, result, new Set(['FetchEvent']));
});

test('ignores serviceworker built-ins in serviceworker environment', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.serviceworker).join('\n')}
  `;
  var result = find(code, {
    environment: ['serviceworker']
  });

  setEquals(t, result, new Set());
});

test('finds commonjs built-ins by default', function(t) {
  t.plan(1);

  var code = `
    module;
  `;
  var result = find(code);

  setEquals(t, result, new Set(['module']));
});

test('ignores commonjs built-ins in commonjs environment', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.commonjs).join('\n')}
  `;
  var result = find(code, {
    environment: ['commonjs']
  });

  setEquals(t, result, new Set());
});

test('finds amd built-ins by default', function(t) {
  t.plan(1);

  var code = `
    define;
  `;
  var result = find(code);

  setEquals(t, result, new Set(['define']));
});

test('ignores amd built-ins in amd environment', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.amd).join('\n')}
  `;
  var result = find(code, {
    environment: ['amd']
  });

  setEquals(t, result, new Set());
});

test('can ignore any combo of additional built-ins', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.builtin).join('\n')}
    ${Object.keys(globals.browser).join('\n')}
    ${Object.keys(globals.node).join('\n')}
    ${Object.keys(globals.serviceworker).join('\n')}
    ${Object.keys(globals.commonjs).join('\n')}
    ${Object.keys(globals.amd).join('\n')}
  `;
  var result = find(code, {
    environment: 'builtin browser node serviceworker commonjs amd'.split(' ')
  });

  setEquals(t, result, new Set());
});

test('blows up when given unknown environment name', function(t) {
  t.plan(1);

  var code = `foo`;

  t.throws(() => {
    find(code, {
      environment: ['asdf']
    });
  }, /Invalid environment name/);
});

test('blows up when given environment specifier is not Array', function(t) {
  t.plan(1);

  var code = `foo`;

  t.throws(() => {
    find(code, {
      environment: 'asdf'
    });
  }, /must be an Array/);
});
