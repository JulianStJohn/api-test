// https://visionmedia.github.io/superagent/
import request from 'superagent' 
import CookieJar from '../shared/cookiejar.js'
import { prettyPrint } from '@base2/pretty-print-object';
import config from '../config.js'

const cookieJar = new CookieJar(); 

const getTodos = () => {
    request.get(`${config.apiUrl}/todos`).then((response) => { 
        //console.log(JSON.stringify(response)
        console.log(response.text)
    }).catch(console.log)
}


const getTodo = () => {
    request.get(`${config.apiUrl}/todo`).then((response) => { 
        //console.log(JSON.stringify(response))
        //console.log(response.text)
    }).catch((error) => {
        //console.log(error.name)
        if(error.message == "Not Found"){
            console.log(JSON.stringify(error)) 
        }
    })
}

getTodo()


