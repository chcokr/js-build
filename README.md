# chcokr-js-build

## What is this?

There are a number of JS build steps and best practices I follow on a regular
basis (browser and node alike), and I want a core tool that enforces their use.

This tool is mainly intended for use across my own projects.
I want a common standard across them, and this tool helps enforce it.
Criticism is welcome, but please don't just condemn me for not making this tool
available enough for generic use.
If you have a suggestion, we can work on it together.

## What does this do?

It checks whether the directory structure is set up as expected and whether
certain best practices are being followed.
Provided these rules are being followed, it will make use of the following tools
to ensure the quality of the codebase.

- Lint: [eslint](https://eslint.org)
- Transpile: [babel](https://babeljs.io) + [webpack](http://webpack.github.io)
- (TODO) Test: [jest](https://facebook.github.io/jest/)
- (TODO) Check code coverage: jest also seems to take care of this
- Install a git pre-commit hook: can't commit until all of the above are
verified

For a complete list of rules, see the relevant section below.

## Using the CLI

The only prerequisite to using this tool so far is to have node.js and npm
installed in advance.

```
npm install -g chcokr-js-build
cjb
```

## Semver

Until it hits v1.0, every new `x` in v0.x may introduce breaking changes.

## Expectations on the target project

**Note**: These same rules are expected upon this repo itself.
In fact, one of the tests is to apply the build process to this very repo.

### Git

The project must have Git initialized in `.git/`.

### Git pre-commit hook

Running `cjb` in the terminal automatically installs/overwrites a Git pre-commit
hook that prevents you from committing unless the following rules are all met.
So be careful if you have set up your own pre-commit hook in the project
you're going to use `cjb` against.

### `README.md`

The project must contain documentation in `README.md`.

### The Language

The project should be written in a variant of JS that:

- the latest version of `babel` as documented in this repo's `package.json` can
successfully compile given the rules in this repo's `src/.babelrc`
- the latest version of `eslint` as documented in this repo's `package.json` can
successfully pass given the rules in this repo's `src/.eslintrc`

### `envrionment.js/jsx`

The project should have a file named `environment.js` or `environment.jsx` in
the root.
This is where all environment variables will be exported.
This file is checked for compilation, linted, and checked for code coverage.
Please do not use `process.env` to manage environment variables.
In fact, ESLint will prevent occurrences of `process.env`.
Relevant best practices guide:
[StackOverflow](http://stackoverflow.com/questions/5869216)

### `src/`

The project should have a directory named `src/`.
This is where all source codes of the project go.
All files with the extension `.js` or `.jsx` in this directory are checked for
compilation, linted, and checked for code coverage.

### `dist/`

Writing code in a brand-new version of JS is great, but compatibility with
platforms that don't support such cutting-edge features is important, across
node and browsers alike.
So the project should have a directory named `dist/`, into which webpack will
transpile the codes in `src/`.

### Expect to run `dist/`, not `src/` - beware webpack-style `require()`s

Codes in `src/` are expected to utilize webpack's `require()`, not node's.
These two behave quite differently.
This is why things like `require('raw!gitPrecommitHook.sh')` appear in this code
base.
Thus running `babel-node src/index.jsx` for example will not work.
So always expect to run what's inside `dist/`, instead of directly running
what's inside `src/`.

### `.config.js/jsx` - `module.exports.webpackConfigs`

CJB provides some default webpack configurations which are commonly found across
some JS projects.
For the full list of these, there's a relevant section further below.
Thus there must be a way for the target project to inject its own custom webpack
configuration.
This is where a file named `cjb.config.js` or `.jsx` in the project root comes
into play, which is required.
This file is checked for compilation and is linted.
In it, export a property called `webpackConfigs`.
This property must be an object, each of whose keys must be the name of a
webpack [entry point](http://webpack.github.io/docs/multiple-entry-points.html).
You choose the name to whatever you want.
Then each of these names must be mapped to an object.
This object should look like a webpack configuration as documented
[here](http://webpack.github.io/docs/multiple-entry-points.html), with the
following caveats to keep in mind.

- Key `entry` must be mapped to a string, whereas [webpack originally also
allows an array or an
object](http://webpack.github.io/docs/configuration.html#entry).
This is because `webpackConfigs` already identifies each entry point.
So, why does CJB use its own multiple-entry-point syntax, when webpack's
original array or object `entry` syntax already supports multiple entry points?
While webpack does indeed multiple entry points to begin with, the rest of the
configuration other than `entry` could not be changed flexibly according to
what entry point.
So a new syntax was necessary.
- CJB makes a number of modifications to each entry point's webpack
configuration before passing it into webpack.
For the full list of manipulations, there's a relevant section further below.

### `cjb.config.js/jsx` - `module.exports.target`

Before diving into what the manipulations are, it should be pointed out that
webpack configurations (and many other things) look quite different when
targeting a node environment and a browser environment.
This is why `cjb.config.js/jsx` should export a property called `target`, which
should be either `"node"` or `"browser"`.

### `__test__/`

The project should have a directory named `__test__/`.
This is where all tests go.
All files with the extension `.js` or `.jsx` in this directory are checked for
compilation and are linted.

## List of `webpackConfig` manipulations

### `devtool`

In browser mode, `devtool` is not touched.

In node mode, `devtool` is set to `"sourcemap"`.

### `externals`

In browser mode, `externals` is not touched.

In node mode, `externals` is set to:

```JS
const nodeModules =
  fs.readdirSync('node_modules')
    .filter(x => ['.bin'].indexOf(x) === -1)
    .reduce((prev, mod) => {
      prev[mod] = `commonjs ${mod}`;
      return prev;
    }, {});
```

### `module.loaders`

In node mode, the following loaders are added at the **end** of the
`module.loaders` array (order: the last one in this list will be the last one in
the `module.loaders` array).

```JS
{test: /\.jsx$/, exclude: /node_modules/, loader: 'babel'}
```
```JS
{test: /\.json$/, loader: 'json'}
```

### `output.path`

`output.path` is set to the absolute path of the `dist/` directory.

### `plugins`

In node mode, the following plugins are added at the **beginning** of the
`plugins` array, in this order:

```
new webpack.HotModuleReplacementPlugin()
```
```
new webpack.NoErrorsPlugin()
```

### `target`

In node mode, `target` is set to `"node"`.

In browser mode, `target` is set to `"web"`.

## webpack-dev-server support

CJB provides basic configurations for
[webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html)
and helps run it.

### `environment.js/jsx` - `module.exports.CJB_WDS_PORT`

To use the WDS support, `environment.js/jsx` must export an integer property
`CJB_WDS_PORT`, the port on which webpack-dev-server will run.

### `cjb wds`

Run `cjb wds <entry_point_name>` to run the WDS.
This command will do everything that `cjb` does but replaces the webpack build
step with its own non-terminating server process.
You do not need to run `cjb` before or after.
`cjb wds` takes care of everything.
However, it does not generate files in `dist/` like `cjb` does.
So don't use `cjb wds` for deploying.

Here's an example of what happens when `CJB_WDS_PORT` is set to 3000 and an
entry point is named `hello`:

```
cjb wds hello

Server listening at localhost:3000
```

Then browse to `http://localhost:3000/webpack-dev-server/dist`.
From here on, every time you save a file required by the entry point `hello`,
the server will automatically update itself according to the changes,
accelerating the development process.

### Hot module replacement is enabled

The server is equipped with
[hot module replacement](http://webpack.github.io/docs/hot-module-replacement.html)
support.

### WDS-specific `webpackConfig` manipulations

#### `entry`

The following strings are added to the **beginning** of the `entry` array.

```
webpack-dev-server/client?http://0.0.0.0:<wdsPort in cjbConfig.js/jsx>
```

```
webpack/hot/dev-server
```

#### `output.publicPath`

`output.publicPath` is set to `dist/`.

## API

Many of these functionalities are programmatically accessible through the API
exposed through `src/api.jsx`. To use this API in your project, install via `npm
install chcokr-js-build` and simply access `require('chcokr-js-build')` in your
code.

To learn more about the API, check out `src/api.jsx` and the corresponding
documentation for each function.
