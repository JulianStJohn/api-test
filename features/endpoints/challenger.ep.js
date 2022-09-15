//import  request from 'superagent' 
const request = require('superagent')
//import { CookieJar } from '../shared/cookiejar.js'
//import  * as config from "../../config"
const config = require("../../config")

class ChallengerEndpoint {

    async postEmpty(){
        return request.post(config.apiUrl + '/challenger').then((results) => { return results; }).catch((e) => { console.log(e)})
    }
}
module.exports = ChallengerEndpoint