import  request from 'superagent' // require('superagent')
import * as conf from '../config.js'
import { prettyPrint } from '@base2/pretty-print-object';

// Issue a POST request on the `/challenger` end point, with no body, to create a new challenger session.
// Use the generated X-CHALLENGER header in future requests to track challenge completion.
let challengerHeaders = await request.post(conf.apiUrl + "/challenger").then( res => {
    return res.headers
})
let xchallengerHeader = challengerHeaders['x-challenger'] 
console.log("x-challenger header: " + xchallengerHeader)

let challengesResponse = await request.get(conf.apiUrl + "/challenges").then ( res => { return res});
//challengesResponse.body.challenges.forEach((challenge) => { console.log(challenge['id'])})
console.log(challengesResponse.body.challenges.length)

//console.log(prettyPrint(challengesResponse.body))

// could use https://github.com/sanack/node-jq here. 