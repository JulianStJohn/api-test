const assert = require('assert')
const { When, Then } = require('@cucumber/cucumber')
const Challenges = require('../../shared/models/challenges.ep.js');

//require('../../shared/models/challenges.ep.js');
//require('./challenges.ep.js');
//import { Challenges } from '../../shared/models/challenges.ep.js';

When('an empty POST request is made to \\/challenger', () => {
})

Then('the header \'x-challenger\' is returned in the response', () => {
    let c = new Challenges();
    assert.ok(c.returnTrue())
})