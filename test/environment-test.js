var test = require('tape');
var globals = require('globals');
var setEquals = require('./set-equals-helper');

var find = require('..');

test('default environment: ignores javascript built-ins', function(t) {
  t.plan(2);

  var code = `
    ${Object.keys(globals.builtin).join('\n')}
  `;
  // no options
  var result = find(code);

  setEquals(t, result, new Set());

  // has options but no environment specifier
  result = find(code, {});

  setEquals(t, result, new Set());
});

test('default environment: ignores browser built-ins', function(t) {
  t.plan(2);

  var code = `
    ${Object.keys(globals.browser).join('\n')}
  `;
  // no options
  var result = find(code);

  setEquals(t, result, new Set());

  // has options but no environment specifier
  result = find(code, {});

  setEquals(t, result, new Set());
});

test('default environment: finds node built-ins', function(t) {
  t.plan(2);

  var code = `
    process;
  `;
  // no options
  var result = find(code);

  setEquals(t, result, new Set(['process']));

  // has options but no environment specifier
  result = find(code, {});

  setEquals(t, result, new Set(['process']));
});

test('default environment: finds serviceworker built-ins', function(t) {
  t.plan(2);

  var code = `
    FetchEvent;
  `;
  // no options
  var result = find(code);

  setEquals(t, result, new Set(['FetchEvent']));

  // has options but no environment specifier
  result = find(code, {});

  setEquals(t, result, new Set(['FetchEvent']));
});

test('default environment: finds commonjs built-ins', function(t) {
  t.plan(2);

  var code = `
    module;
  `;
  // no options
  var result = find(code);

  setEquals(t, result, new Set(['module']));

  // has options but no environment specifier
  result = find(code, {});

  setEquals(t, result, new Set(['module']));
});

test('default environment: finds amd built-ins', function(t) {
  t.plan(2);

  var code = `
    define;
  `;
  // no options
  var result = find(code);

  setEquals(t, result, new Set(['define']));

  // has options but no environment specifier
  result = find(code, {});

  setEquals(t, result, new Set(['define']));
});

test('node environment: ignores node built-ins', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.node).join('\n')}
  `;
  var result = find(code, {
    environment: ['node']
  });

  setEquals(t, result, new Set());
});

test('serviceworker environment: ignores serviceworker built-ins', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.serviceworker).join('\n')}
  `;
  var result = find(code, {
    environment: ['serviceworker']
  });

  setEquals(t, result, new Set());
});

test('commonjs environment: ignores commonjs built-ins', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.commonjs).join('\n')}
  `;
  var result = find(code, {
    environment: ['commonjs']
  });

  setEquals(t, result, new Set());
});

test('amd environment: ignores amd built-ins', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.amd).join('\n')}
  `;
  var result = find(code, {
    environment: ['amd']
  });

  setEquals(t, result, new Set());
});

test('can ignore any combo of environment-based built-ins', function(t) {
  t.plan(1);

  var code = `
    ${Object.keys(globals.es5).join('\n')}
    ${Object.keys(globals.browser).join('\n')}
    ${Object.keys(globals.node).join('\n')}
    ${Object.keys(globals.serviceworker).join('\n')}
    ${Object.keys(globals.commonjs).join('\n')}
    ${Object.keys(globals.amd).join('\n')}
  `;
  var result = find(code, {
    environment: 'es5 browser node serviceworker commonjs amd'.split(' ')
  });

  setEquals(t, result, new Set());
});

test('blows up on unknown environment name', function(t) {
  t.plan(1);

  var code = `foo`;

  t.throws(() => {
    find(code, {
      environment: ['asdf']
    });
  }, /Invalid environment name/);
});

test('blows up when environment specifier is not Array', function(t) {
  t.plan(1);

  var code = `foo`;

  t.throws(() => {
    find(code, {
      environment: 'asdf'
    });
  }, /must be an Array/);
});
