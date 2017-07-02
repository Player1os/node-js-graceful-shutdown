# NodeJS Library

This project serves as a template for any library compiled to be published in npm and consumed in a node js environment.

The repository includes:

- Transpiling and bundling of the core library's code written in Typescript.
- Transpiling and running of tests also written in Typescript.
- Linting of all contains sourcecode.
- The publishing of the library to the npm registry.
- Typescript definition files for the library's interface.

## Scripts

All tasks are defined as npm scripts:

- Building the library: `npm run build:lib`
- Building the library in watch mode: `npm run build:lib:watch`
- Building the tests: `npm run build:test`
- Building the tests in watch mode: `npm run build:test:watch`
- Running the tests: `npm test`
- Running the tests in watch mode: `npm run test:watch`
- Running the code linter: `npm run lint`
- Running the code linter in watch mode: `npm run lint:watch`

## Creating a new library

Follow these instructions to create a new forked library repository:

1. Fork this repository on github.
2. Setup the repository locally.
3. Add a remote by entering `git remote add base git@github.com:Player1os/node-js-library.git`
or `git remote add base https://github.com/Player1os/node-js-library.git`.
4. When publishing the first version enter the command `npm publish --access=public` or `npm publish`.

## Updating the new library with changes from the base

Follow these instructions to update the new library:
1. Make sure you are in the library's master branch `git checkout master`.
2. Rebase the library's master branch to the base repository's master `git pull --rebase base master`.

## Debugging

To debug the library's tests choose the *Launch Tests* configuration in the vscode debugger.

## Developement

It is recommended to run the following scripts in seperate windows during development:

1. `npm run build:lib:watch`.
2. `npm run build:test:watch`.
3. `npm run lint:watch`.
4. `npm run test:watch`.

## Publishing a new version

Follow these instructions, when a new version is ready to be published:

1. Commit and push the final changes to the topic branch of the git repository.
2. Create a pull request in the origin repository and await approval (a quick test can be done by running `npm run validate`).
3. After the merge is complete, run the `npm version [significance]` script choosing the `patch`, `minor` or `major` as the second argument depending on the significance of the changes to be applied. This will automatically publish the package to the npm registry.

## TODO

- Add NYC/Istanbul code coverage.
- Setup Continuous Integration.
