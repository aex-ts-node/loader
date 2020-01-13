[![Build Status](https://travis-ci.org/aex-ts-node/loader.svg?branch=master)](https://travis-ci.org/aex-ts-node/loader.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/aex-ts-node/loader/badge.svg?branch=master)](https://coveralls.io/github/aex-ts-node/loader?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# @aex/loader

Load data from a directory.

```ts
const dirName = path.resolve(__dirname, "../fixture-tests/");
const nameless = true;
const loader = new Loader(dirName, nameless);
const object = loader.load();
```