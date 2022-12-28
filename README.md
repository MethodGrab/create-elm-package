# create-elm-package

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/MethodGrab/create-elm-package/CI.yaml?branch=main&style=flat-square)](https://github.com/MethodGrab/create-elm-package/actions/workflows/CI.yaml)
[![npm version](https://img.shields.io/npm/v/create-elm-package?style=flat-square)](https://www.npmjs.com/package/create-elm-package)

> An [npm initializer](https://docs.npmjs.com/cli/commands/npm-init) for creating new [Elm](https://elm-lang.org) packages.


## Usage

```
mkdir my-elm-package
cd my-elm-package
npm init elm-package
```


## What's included

Please review the generated code before using it to ensure it meets your needs and doesn't include anything you don't want.

- Basic Elm package boilerplate.
- GitHub [Workflow actions](./templates/base/.github/workflows/CI.yaml) to:
	- Validate the package.
	- Automatically publish new versions using [`elm-publish-action`](https://github.com/dillonkearns/elm-publish-action).  
		Note the initial version 1.0.0 must be published manually.

Note the GitHub workflow assumes your default branch is called `main`. If that's not the case, you should update the following places after you run the initializer:
- The 2 references to `main` at the top of `.github/workflows/CI.yaml`.
- `?branch=main` in the _GitHub Workflow Status_ badge URL in `README.md`.


## Development

1. Clone the repo.
1. `cd create-elm-package`
1. `npm install`
1. `npm run dev`

In a separate session/tab/window:
1. `npm link`
1. `npm init elm-package`  
	This will run the local cloned/linked version.

Instead of running `npm init elm-package` you can run the `create-elm-package` global binary directly.

Instead of linking it with `npm link` and using the global binary you can run the local binary directly: `./dist/cli.js`.
