# API Testing Challenge

The two purposes of this repo are: 
* **API Testing:** Solutions for the [eviltester API testing challenge](https://www.eviltester.com/page/tools/apichallenges/), arrived at using [session-based testing](https://www.satisfice.com/download/session-based-test-management). 
* **API Regression Testing:** Demonstrating API regression testing with [cucumber-js](https://github.com/cucumber/cucumber-js) and [superagent](https://github.com/visionmedia/superagent)

## Installation

* Install nvm - via homebrew on mac `brew install nvm` or the [install script](https://github.com/nvm-sh/nvm)
* Install the node version - `nvm use` should return `Now using node v16.17.0` 

## Running 

* Run the API `./launch-api.sh` will run the API jar in a docker container
* browse to `http://localhost:4567` to ensure the API is running and accessible
* Run the challenges: `node .`
* Run the tests for this module `npm test`
* Run the cuke scripts: `npx cucumber-js --format @cucumber/pretty-formatter`

## Notes

* cucumber.js [does not support native js module imports](https://github.com/cucumber/cucumber-js/issues/1304) so I have included a package.json file containing `"type": "commonjs"` in the `features/support` and `shared/models` directories. 