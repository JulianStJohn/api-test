const assert = require('assert')
const request = require('superagent')
const config = require("../../config") 
const { When, Then, And } = require('@cucumber/cucumber')
const challengerEndPoint = require('../endpoints/challenger.ep.js')


let challengerEmptyPost; 
let challenger = new challengerEndPoint();

When(/^an empty POST is made to the 'challenger' endpoint$/, () => {
    challengerEmptyPost = challenger.postEmpty() 
})

Then('the header \'x-challenger\' is returned in the response', () => {
   return challengerEmptyPost.then((res) => {
        assert.ok(res.headers['x-challenger'] != undefined ) 
    }).catch((e) => {
        console.log(e)
        if(e.name == "AssertionError") throw e;
    })
})