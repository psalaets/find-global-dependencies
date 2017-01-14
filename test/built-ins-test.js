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
