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
        console.log(response.text)
    }).catch((error) => {
        //console.log(error.name)
        if(error.message == "Not Found"){
            console.log(JSON.stringify(error)) 
        }
    })
}

const getTodosWithId = (id) => {
    request.get(`${config.apiUrl}/todos/${id}`).then((response) => { 
        console.log(JSON.stringify(response))
        //console.log(response.text)
    }).catch((error) => {
        //console.log(error.name)
        if(error.message == "Not Found"){
            console.log(JSON.stringify(error)) 
        }
    })
}

//getTodos()
//getTodosWithId(4)
//getTodosWithId(-1)

const postTodos = (sendObj) => {
    request.post(`${config.apiUrl}/todos`)
        .send(sendObj)
        .then(
            (response) => { 
            console.log(JSON.stringify(response))
            //console.log(response.text)
        },
            (error) => {
            //console.log(error.name)
            console.log(JSON.stringify(error)) 
        })
}

// Test that we are prevented from specifying an id when creating a record
//let sendObj = {'title':'test3','id':13}
//let sendObj = {'title':'ggoK01DZCweTwYOMzZQbOZuChWG6BW2ogGnrpHIMbHU8ChSs9M6rf7hdEvx4AOV9NK2whltrjLE3SKqytxMkgIxUrBfttONmGEXtpajUFvSrQt1lixqhTwC9IQbrPqTIaQCCXD4qMRXFxnx4sOxKn0AO6VSGOCuEHcSIO5hdjHaaO0GIh45W6ynv53A0nxBTqP929aQB'}
//postTodos(sendObj);




const optionsTodos = () => {
    request.options(`${config.apiUrl}/todos`)
        .then((response) => { console.log(JSON.stringify(response)) },
              (error) => { console.log(JSON.stringify(error)) })
}

//optionsTodos();

const headTodosWithId = (id) => {
    request.head(`${config.apiUrl}/todos/${id}`)
    .then(  (response) => { console.log(JSON.stringify(response)) },
            (error) => { console.log(JSON.stringify(error)) })
}
//headTodosWithId(1)

const headTodos = () => {
    request.head(`${config.apiUrl}/todos`)
    .then(  (response) => { console.log(JSON.stringify(response)) },
            (error) => { console.log(JSON.stringify(error)) })
}

const deleteWithId = (id) => {
    request.delete(`${config.apiUrl}/todos/${id}`)
    .then(  (response) => { console.log(JSON.stringify(response)) },
            (error) => { console.log(JSON.stringify(error)) })
}

const update = (id, sendObj) => {
    request.post(`${config.apiUrl}/todos/${id}`)
        .send(sendObj)
        .then(  (response) => { console.log(JSON.stringify(response)) },
                (error) => { console.log(JSON.stringify(error)) })
}

const getFilteredtodos = () => {
    request.get(`${config.apiUrl}/todos?doneStatus=true`)
    .then(  (response) => { console.log(JSON.stringify(response)) },
            (error) => { console.log(JSON.stringify(error)) })
}
 

// can't post with donestatus of true
let sendObj = {
                //'title':'this is still x23', 
                //'description':'testing for skipped ',
                'doneStatus': true
            }
//postTodos(sendObj);
//getTodosWithId('17')
//deleteWithId(15)

//update(10, sendObj)
//update(1, sendObj)

//deleteWithId(18)
//deleteWithId(17)
//deleteWithId(16) 
// getTodos()

//postTodos(sendObj)
//getTodos()
//getTodosWithId(23)

getFilteredtodos()