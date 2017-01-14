var test = require('tape');
var find = require('.');

test('global access at top level', function(t) {
  t.plan(1);

  var code = 'foo + 3';
  var result = find(code);

  t.deepEquals(result, ['foo']);
});
