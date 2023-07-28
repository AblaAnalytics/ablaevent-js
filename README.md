# Ablaevent Browser JS Library

[![npm package](https://img.shields.io/npm/v/ablaevent-js?style=flat-square)](https://www.npmjs.com/package/ablaevent-js)
[![MIT License](https://img.shields.io/badge/License-MIT-red.svg?style=flat-square)](https://opensource.org/licenses/MIT)
 

## Testing

Unit tests: run `yarn test`.
Cypress: run `yarn serve` to have a test server running and separately `yarn cypress` to launch Cypress test engine.

### Running TestCafe E2E tests with BrowserStack

Testing on IE11 requires a bit more setup. TestCafe tests will use the
playground application to test the locally built array.full.js bundle. It will
also verify that the events emitted during the testing of playground are loaded
into the Ablaevent app. By default it uses https://e.abla.io and the
project with ID 11213. 

You'll also need to sign up to [BrowserStack](https://www.browserstack.com/).
Note that if you are using CodeSpaces, these variables will already be available
in your shell env variables.

After all this, you'll be able to run through the below steps:

1. Optional: rebuild array.js on changes: `nodemon -w src/ --exec bash -c "yarn build-rollup"`.
1. Export browserstack credentials: `export BROWSERSTACK_USERNAME=xxx BROWSERSTACK_ACCESS_KEY=xxx`.
1. Run tests: `npx testcafe "browserstack:ie" testcafe/e2e.spec.js`.

### Running local create react app example

You can use the create react app setup in `playground/nextjs` to test ablaevent-js as an npm module in a Nextjs application.

1. Run `posthog` locally on port 8000 (`DEBUG=1 TEST=1 ./bin/start`).
2. Run `python manage.py setup_dev --no-data` on posthog repo, which sets up a demo account.
3. Copy posthog token found in `http://localhost:8000/project/settings` and then
4. `cd playground/nextjs`and run `NEXT_PUBLIC_POSTHOG_KEY='<your-local-api-key>' yarn dev`

### Tiers of testing

1. Unit tests - this verifies the behavior of the library in bite-sized chunks. Keep this coverage close to 100%, test corner cases and internal behavior here
2. Cypress tests - integrates with a real chrome browser and is capable of testing timing, browser requests, etc. Useful for testing high-level library behavior, ordering and verifying requests. We shouldn't aim for 100% coverage here as it's impossible to test all possible combinations.
3. TestCafe E2E tests - integrates with a real ablaevent instance sends data to it. Hardest to write and maintain - keep these very high level

## Developing together with another project

Install Yalc to link a local version of `ablaevent-js` in another JS project: `npm install -g yalc` 

#### Run this to link the local version

- In the `ablaevent-js` directory: `yalc publish`
- In the other directory: `yalc add ablaevent-js`, then install dependencies  
  (for `ablaevent` this means: `yalc add ablaevent-js && pnpm i && pnpm copy-scripts`)

#### Run this to update the linked local version

- In the other directory: `yalc update`, then install dependencies  
  (for `ablaevent` this means: `yalc update && pnpm i && pnpm copy-scripts`)

#### Run this to unlink the local version

- In the other directory: `yalc remove ablaevent-js`, then install dependencies  
  (for `ablaevent` this means: `yalc remove ablaevent-js && pnpm i && pnpm copy-scripts`)

## Releasing a new version

Just put a `bump patch/minor/major` label on your PR! Once the PR is merged, a new version with the appropriate version bump will be released, and the dependency will be updated in [AblaAnalytics/ablaevent-js](https://github.com/AblaAnalytics/ablaevent-js) – automatically.
 
If you want to release a new version without a PR (e.g. because you forgot to use the label), check out the `master` branch and run `npm version [major | minor | patch] && git push --tags` - this will trigger the automated release process just like the label.

### Prereleases

To release an alpha or beta version, you'll need to use the CLI locally:

1. Make sure you're a collaborator on `ablaevent-js` in npm ([check here](https://www.npmjs.com/package/ablaevent-js)).
2. Make sure you're logged into the npm CLI (`npm login`).
3. Check out your work-in-progress branch (do not release an alpha/beta from `master`).
4. Run the following commands, using the same bump level (major/minor/patch) as your PR:
    ```bash
    npm version [premajor | preminor | prepatch] --preid=beta
    npm publish --tag beta
    git push --tags
    ```
5. Enjoy the new prerelease version. You can now use it locally, in a dummy app, or in the [main repo](https://github.com/AblaAnalytics/ablaevent-js).
