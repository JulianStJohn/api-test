import  request from 'superagent' // require('superagent')
import * as conf from '../config.js'
import { prettyPrint } from '@base2/pretty-print-object';

// Issue a POST request on the `/challenger` end point, with no body, to create a new challenger session.
// Use the generated X-CHALLENGER header in future requests to track challenge completion.
let challengerHeaders = await request.post(conf.apiUrl + "/challenger").then( res => {
    return res.headers
})
let xchallengerHeader = challengerHeaders['x-challenger'] 
console.log(xchallengerHeader)
