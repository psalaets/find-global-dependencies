# find-global-deps

Find what global variables are used in js code.

## Purpose

For this module, a "global dependency" is a global variable used by your code that is not provided by the environment.

Maybe you want to find these and do something with webpack's [`imports-loader`](https://github.com/webpack/imports-loader).

## Install

`npm install find-global-deps`

Requires node 6 or later

## Usage

```js
var findGlobalDeps = require('find-global-deps');

var code = 'let a = foo';
var result = findGlobalDeps(code);

result // Set { 'foo' }
```

## API

```js
var findGlobalDeps = require('find-global-deps');
```

### `findGlobalDeps(code[, options])`

Returns a `Set<string>` of names of global dependencies found.

#### `code`

String of js code.

#### `options.environment`

Optional array of strings. Defaults to `['es6', 'browser']`.

Specifies what environment `code` is written for. Any use of globals that come with these environments (e.g. `process` in node) will not be reported.

Can contain any top-level property names of the object exported by the [globals module](https://github.com/sindresorhus/globals).

## Gotchas

Does not detect (yet)

- `window.foo` in browser
- `this.foo` at top level in browser
- `global.foo` in node

No support for anything

## License

MIT
