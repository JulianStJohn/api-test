// https://visionmedia.github.io/superagent/
import request from 'superagent' 
import CookieJar from '../shared/cookiejar.js'
import { prettyPrint } from '@base2/pretty-print-object';
import config from '../config.js'
import fs from 'fs';





const cookieJar = new CookieJar(); 

// For a failure, the object has two keys: status, response
    // response has keys including: res, req, text, buffered, header, headers, error, _body, statusCode

const logSuperAgentRequestOutput =  (superAgentResultObject) => {
    console.log(JSON.stringify(unbufferTextField(revealSuperagentResponse(superAgentResultObject)))) 
}

const requestSuccess = logSuperAgentRequestOutput

const requestFailure = logSuperAgentRequestOutput

const revealSuperagentResponse = (superagentRequestOutput) => {
    return  (superagentRequestOutput.response === undefined) ?  
    superagentRequestOutput : 
    superagentRequestOutput.response
}

const unbufferTextField = (superagentResponse) => {
 
    if( !(superagentResponse.header === undefined)
        && !(superagentResponse.header['content-type'] === undefined)
        && superagentResponse.header['content-type'] == 'application/xml'
        && !(superagentResponse._body === undefined) 
    ){
        const buf = Buffer.from(superagentResponse._body)
        superagentResponse['text'] = buf.toString('utf8')
    }
    return superagentResponse
}

const getTodos = (headers={}) => {
    request.get(`${config.apiUrl}/todos`)
    .set(headers)
    .then(requestSuccess,requestFailure)
}

const getTodo = () => {
    request.get(`${config.apiUrl}/todo`)
    .then(requestSuccess,requestFailure)  
}

const getTodosWithId = (id) => {
    request.get(`${config.apiUrl}/todos/${id}`).then(requestSuccess,requestFailure)  
}

// Test that we are prevented from specifying an id when creating a record
//let sendObj = {'title':'test3','id':13}
//let sendObj = {'title':'ggoK01DZCweTwYOMzZQbOZuChWG6BW2ogGnrpHIMbHU8ChSs9M6rf7hdEvx4AOV9NK2whltrjLE3SKqytxMkgIxUrBfttONmGEXtpajUFvSrQt1lixqhTwC9IQbrPqTIaQCCXD4qMRXFxnx4sOxKn0AO6VSGOCuEHcSIO5hdjHaaO0GIh45W6ynv53A0nxBTqP929aQB'}
//postTodos(sendObj);

const postTodos = (dataString, headers={}) => {
    request.post(`${config.apiUrl}/todos`)
        .set(headers)
        .send(dataString)
        .then(requestSuccess)
        .catch(requestFailure)

}


const optionsTodos = () => {
    request.options(`${config.apiUrl}/todos`) .then(requestSuccess,requestFailure)  
}

const headTodosWithId = (id) => {
    request.head(`${config.apiUrl}/todos/${id}`) .then(requestSuccess,requestFailure)  
}

const headTodos = () => {
    request.head(`${config.apiUrl}/todos`) .then(requestSuccess,requestFailure)  
}

const deleteWithId = (id) => {
    request.delete(`${config.apiUrl}/todos/${id}`).then(requestSuccess,requestFailure)  
}

const update = (id, dataString, headers={}) => {
    request.post(`${config.apiUrl}/todos/${id}`)
        .set(headers)
        .send(dataString)
        .then( requestSuccess, requestFailure)
}

const getFilteredtodos = () => {
    request.get(`${config.apiUrl}/todos?doneStatus=true`).then(requestSuccess,requestFailure)  
}
 

// application/json, application/xml, application/gzip, */*, ;q=0.8

// can't post with donestatus of true
let sendObj = {
                'title':'initial upddate', 
                'description':'first check for post in string',
                'doneStatus': true
            }
//postTodos(sendObj);
//deleteWithId(15)

//update(10, sendObj)
//update(1, sendObj)

//deleteWithId(18)
//deleteWithId(17)
//deleteWithId(16) 
// getTodos()

//postTodos(sendObj)
//getTodos()
//getTodosWithId(99)

//getFilteredtodos()

//getTodos('application/xml, application/json')
//getTodos('application/xml')
//console.log(JSON.stringify(sendObj))
//update('1',JSON.stringify(sendObj))
let jsonUpdateData = JSON.stringify(sendObj)

let xmlUpdateData = "<title>Created with XML</title>"
//xmlUpdateData += "<id>1</id>"
xmlUpdateData += "<description>Pog</description>"
xmlUpdateData += "<doneStatus>true</doneStatus>"
xmlUpdateData = "<todo>" + xmlUpdateData + "</todo>"

// Create a tood item:
//postTodos(jsonUpdateData, {'Content-Type':'application/json','Accept':'application/xml'})
//postTodos(jsonUpdateData, {'Content-Type':'application/json','Accept':'application/json'})

//update(1,xmlUpdateData, {'Content-Type':'application/xml','Accept':'application/xml'})

const authheadersWithCorrectUidPassword = {'Authorization': 'Basic ' + (new Buffer.from("admin:password").toString('base64'))}
const authheadersWithIncorrectUidPassword = {'Authorization': 'Basic ' + (new Buffer.from("admin:pwd").toString('base64'))}
const authheadersWithoutUidPassword = {'Authorization': 'Basic' }

// Get credentials: 
//request.post(`${config.apiUrl}/secret/token`).set(authheadersWithCorrectUidPassword).then( requestSuccess, requestFailure)

const authHeader = {'x-auth-token':'a350bc9b-9f65-4c5e-b6a6-d56e21a82512'}
const authHeaderAcceptText = authHeader
authHeaderAcceptText['accept'] = 'application/ggg'
const bearerAuthHeader = {'Authorization':'Bearer a350bc9b-9f65-4c5e-b6a6-d56e21a82512'}
const secretNoteUrl = `${config.apiUrl}/secret/note`
const incorrectAuthHeader = {'x-auth-token':'bananas'}
//request.get(`${config.apiUrl}/secret/note`).set(bearerAuthHeader).then(logSuperAgentRequestOutput,logSuperAgentRequestOutput)

const noteData = {"note":"Here is a third note"}
//request.post(secretNoteUrl).set(bearerAuthHeader).send(noteData).then( requestSuccess, requestFailure)

//getTodosWithId('1')

// other methods:
//request.delete(`${config.apiUrl}/heartbeat`).then( requestSuccess, requestFailure)


// postTodos("<todo><title>highere</title></todo>",{'content-type':'application/xml','accept':'blahino' })

getTodos({'accept':'*/*' })

// delete every todo: 

/*
request.get(`${config.apiUrl}/todos`).then(
    (response) => {JSON.parse(response.text).todos.forEach((todo) => { 
       let id = todo['id']
       request.delete(`${config.apiUrl}/todos/${id}`).then(requestSuccess,requestFailure)  
    }
    )}, 
    requestFailure)
*/