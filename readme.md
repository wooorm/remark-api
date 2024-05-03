# remark-api

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]

> 🐉 **Note**: this is new software doing complex things that hasn’t been used
> much.
> Here be dragons!

**[remark][github-remark]** plugin to generate an API section.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`remarkApi() (default)`](#remarkapi-default)
* [Compatibility](#compatibility)
* [Thanks](#thanks)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a [unified][github-unified] ([remark][github-remark]) plugin
to generate am API section of a package such as the one below.

## When should I use this?

This project is useful when you write readmes for npm packages typed with
TypeScript.
You can keep your docs in the code and have it automatically be pulled into the
readme.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 18+), install with [npm][npm-install]:

```sh
npm install remark-api
```

## Use

See this repo.
The `format` script in `package.json` runs `remark`,
which includes in the `remarkConfig` settings this plugin `remark-api`,
and generates:

## API

### `remarkApi() (default)`

Generate an API section.

Looks for the closest `package.json` file upwards from the current
markdown file.
For each export in the package, it generates API docs.
It injects those into an `# API` section.

###### Parameters

There are no parameters.

###### Returns

Transform (`(tree: Root, file: VFile) => Promise<undefined>`).

## Compatibility

This projects is compatible with maintained versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `remark-api@0`,
compatible with Node.js 18.

## Thanks

Special thanks go out to:

* [**@bertspaan**][github-bertspaan] for funding the initial development

## Contribute

Yes please!
See [How to Contribute to Open Source][open-source-guide-contribute].

## License

[MIT][file-license] © [Titus Wormer][wooorm]

<!-- Definitions -->

[badge-build-image]: https://github.com/wooorm/remark-api/actions/workflows/main.yml/badge.svg

[badge-build-url]: https://github.com/wooorm/remark-api/actions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/wooorm/remark-api.svg

[badge-coverage-url]: https://codecov.io/github/wooorm/remark-api

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-api.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-api

[file-license]: license

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-bertspaan]: https://github.com/bertspaan

[github-remark]: https://github.com/remarkjs/remark

[github-unified]: https://github.com/unifiedjs/unified

[npm-install]: https://docs.npmjs.com/cli/install

[open-source-guide-contribute]: https://opensource.guide/how-to-contribute/

[wooorm]: https://wooorm.com
