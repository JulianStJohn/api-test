const request = require('superagent')
const { Given, When, Then } = require('@cucumber/cucumber')
const config = require("../../config")
 
When('a get request is made to the \'challenges\' endpoint',() => {
    request.get(config.apiUrl + "/challenges").then((result) => { console.log(result.statusCode) }).catch((error) => {
        console.log(error)
    })
})
