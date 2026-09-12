# install-optional

Install and remove optional dependencies

```sh
npm install install-optional
```

In a CommonJS `.cjs` file:

```js
var optional = require('install-optional');

// Remove optional dependencies with @esbuild/ in their name.
optional.removeSync('esbuild', '@esbuild/');

// Install optional dependencies for this platform synchronously.
optional.installSync('esbuild', process.platform + '-' + process.arch);

// Install optional dependencies for this platform asynchronously.
optional.install('esbuild', process.platform + '-' + process.arch, function (err) {
  if (err) throw err;
});
```

### Documentation

[API Docs](https://kmalakoff.github.io/install-optional/)
