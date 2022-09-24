
# Testing Session Notes

_I'll be using Jon Bach's Session Based Test Management approach, with a set focus each time I devote time to the challenge._

---

## Charter: Familiarisation with the behaviour of 'todo' REST record

* Examine the response to http actions
* Try to create and retrieve a record
* Try to determine what makes a valid record, try to create an invalid record
 
### Session Details
* **Date:** Friday 16/9/22
* **Start:** 12.30pm 
* **Duration:** 45 minutes
* **Tester:** Julian

### Tools
node.js, superagent

### Files
* /exploratory/todo.js

### Test Notes

_Setup:_

* For the purpose of exploratory testing I might need to build an object to show a summary of the request and response. 
* For the time being however JSON.stringify will show the details I need
* where the returned `response.text` is JSON, I can output and pipe to jq :`node ./exploratory/todo.js | jq`, or Shift + Option + F to format json in vscode

_/todos_

```
      "id": 10,
      "title": "install webcam",
      "doneStatus": false,
      "description": ""
```
* description doesn't seem to be mandatory
* no todos are currently done
* ids 1-10 are populated
* Performing a 'get' on the endpoint _without_ passing the `x-challenger` header marks the task as completed in the gui - in single-user mode, is the header disregarded / not enforced? 
* Where superagent encounters a 404, it throws an error. This isn't what I'd have expected 
* `JSON.stringify(error)` returns the request/response object, but no error details - message, name. 
* Helpfully, the `error.name` is 'Error', `message` is 'Not Found'
* Handling the error object took the remainder of the session time. 

### Summary

* Still working out using SuperAgent as an exploratory testing tool. 
* Attempt to complete the objectives next session

## Issues

* Not requiring the `x-challenger` header for single user seems to contradict the documentation.


--- 

## Charter: Familiarisation with the behaviour of 'todo' REST record (Repeat)

* Explore GET, POST on /todos to retrieve and create records
* Examine, trigger validation behaviour on creating records
* Test OPTIONS

### Session Details
* **Date:** Friday 16/9/22 
* **Start:** 2pm 
* **Duration:** 45m
* **Tester:** Julian

### Tools
node.js, superagent

### Files 
* /exploratory/todo.js

### Test Notes 

_GET /todos_

* `todos/{id}` returns the correct todo record compared with `todos`
* `todos/{id}` returns an error where id is not 1..10 

_POST /todos_

* POST with no data returns a 400 `errorMessages\":[\"title : field is mandatory\"]}"}`
* PUT with no data returns a 405 (method not allowed)
* POST with only title defined responds 201, with text: `{\"id\":12,\"title\":\"test\",\"doneStatus\":false,\"description\":\"\"}"}`
* the id seems to have skipped 11 - possibly an invalid post still increments the record count?
* Observation: Challenge-wise, you can complete steps out of order. 
* Repeated steps: post empty, post empty, post title only
* Observation: Confirmed post invalid record increments the counter
* the 'location' header given on successful post gives the new id; `location": "todos/15",`
* posting with an id responds with 400, `{\"errorMessages\":[\"Invalid Creation: Failed Validation: Not allowed to create with id\"]}"` 

_OPTIONS_

* OPTIONS returns `OPTIONS, GET, HEAD, POST`

_Some assumptions I would make about the /todos endpoint that I would like to test:_

* there is character length restriction around title and description
* values are sanitised on processing 
* can't POST a todo with a doneStatus of true
* test if POST todos/id can be used to update record details
* if updates are possible, that we can't update a record to change the id 


### Summary 

* GET, POST, OPTIONS work as expected
* 'location' header gives the created record path
* For the ET challenge, you can complete steps out of order. 
* Further assumptions to test noted

## Issues

* POST with an invalid data increments the record count

--- 

## Charter: 'todo' endpoint CRUD validations  

* can't POST a todo with a doneStatus of true
* can't POST a todo with extra fields
* can delete a record
    * error deleting a record that has already been deleted
* where an id has been skipped due to an invalid create, 
    * the skipped id cannot be deleted 
    * the skipped id will always prevent that id being used for a valid record.
* test if POST todos/id can be used to update record details and if so:
    * id is immutable
    * the new record is returned
    * updates that do not change the values give feedback that the values are unchanged 
    * can't update an id that isn't associated with a record (e.g. where an invalid post caused an id value to be skipped) 
* there is character length restriction around title and description
* values are sanitised on processing 

### Session Details
* **Date:** 
* **Start:**  7.15pm
* **Duration:** 45m
* **Tester:** Julian

### Tools

### Files 

### Test Notes 

_Create_

* can POST a todo with doneStatus of true
* can't POST a todo with a doneStatus of 'true' `Failed Validation: doneStatus should be BOOLEAN\`
* can't POST a todo with an extra field `Could not find field: extrafield\`


_Delete_

* Can delete a record: `/todos/{id}`
* Can't delete a previously deleted record `Could not find any instances with todos/15\`
* Tools: where establishing skipped IDs, use jq and sort to filter just the id numbers: `node ./exploratory/todo.js | jq '.todos[] | .id' | sort`
* Tools: I just ran three functions in the `todo.js` script in the one execution - they didn't complete in order as they are async. Should handle this if compiling more complex scripts 
* where an id has been skipped due to an invalid create, 
    * Verified: the skipped id cannot be deleted 
    * Verified: the skipped id will always prevent that id being used for a valid record.

_Update_
* records can be updated with POST /todos/{id}
* id is ignored when supplied in the data object 
* extra fields cause an error
* all fields not manadatory - where a field is not supplied it will not be updated
* no difference in response beteween updates that did or didn't affect an existing record, where the updates were valid. 
* Can't update a record taht doesn't exist: `No such todo entity instance with GUID or ID 18 found\"`

### Summary 

## Issues

--- 
## Charter: Test MIME type of sent / accepted data on /todos endpoint 

### Session Details
* **Date:** 17/9/22
* **Start:**  12.45pm
* **Duration:** 45m
* **Tester:** Julian

### Tools

### Files 

### Test Notes 

_Updating functions to accept application/xml_ 

* Sending 'Accept: application/xml', I found that xml is buffered in superagent - will need to be rendered as string
* Went down a wrong path trying to call `.buffer(false)` - I'm not sure what this does in superagent. 
* modified getTodos to unbuffer the body and set it to string where xml is received
* sampled the data returned for /todos between xml/json to check order and details are the same 
* The input I've used to superagent to the POST requests has been a js object, which superagent converts to json - I'm going to try using a string
    * this is a notable point in testing tools - examining what the tool is actually doing
    * I am assuming that superagent accepts a js object, stringifies it, and sends the string
    * going to try using a string instead of js object, see if there is any difference in behaivour.  
    * called JSON.stringify on data being sent, no difference in results. 
* Refactoring: separating out the logic to log xml into a function. Actually makes the request calls cleaner. 

### Summary 

## Issues

* an update (challenges id 20) to /todos/id won't satisfy the condition of this challenge. Not really an issue but would seem to go against the concept of the challenge. 
* an update (challenge 22) with invalid accept type and content type won't satisfy the challenge - has to be only content type. Not an issue as the http codes are different. (406 vs 415)
* Okay so I found an interesting one! When I made a mistake with my function call: 
    * `postTodos(1,xmlUpdateData, {'Content-Type':'application/xml','Accept':'application/xml'})` 
    * which results in a superagent call of  `request.post(${config.apiUrl}/todos).set("<todos><title ...").send("1")`, giving headers of an xml string and body of "1"
    * the result I get back is `{"code":"ERR_INVALID_HTTP_TOKEN"}` - unsurprising,
    * _but the script hangs_. I need to ^C out of it. 
    * On first inspection I'm thinking that the http error means the connection remains open. 
* From the documentation, the behaviour of `.then()` might differ between POST / PUT and GET, in terms of error handling. 

--- 

## Charter: Test MIME type of sent / accepted data on /todos endpoint (repeat)

### Session Details
* **Date:** 19/9/22
* **Start:** 10.30am 
* **Duration:** 45m 
* **Tester:** Julian

### Tools

### Files 

### Test Notes 

_Accept_

* delivers xml when `accept: application/xml` is passed
* invalid accept string `accept: json` returns a 406
* delivers json by default
* `application/gzip` returns a code of 406

_Content-Type_

* Where xml is sent with no content-type header, api returns `Unsupported Content Type - application/x-www-form-urlencoded\` 
* Where data is submitted in xml, and no accept specified, the new record is returned in json. I think this behaviour should be api-specific. Capture this in the feature file. 
* Added a basic feature file for this case. 
* `application/gzip` is unsupported, returns a status of 415
* content type of any `*/*` results in json being sent
* content-type and data of xml, accept of `*/*` results in json being returned



### Summary 

* Content Type and Accept headers work as expected


## Issues

--- 
## Charter: Authorisation - /secret/token and /secret/note endpoints

### Session Details
* **Date:** 23/9/22
* **Start:** 4.15pm 
* **Duration:** 45m 
* **Tester:** Julian

### Tools

### Files 

### Test Notes 

_Auth token: /secret/token_

* Token is retrievable with correct uid/password: ` "x-auth-token": "a350bc9b-9f65-4c5e-b6a6-d56e21a82512",`
* Token should not be retrievable without uid/password: 401
* Token should not be retrievable without wrong password: 401
* Token is not retrievable with no `Authorization` header: 401
* Using POST: ok
* Using GET: 405 (Method not allowed)
* Multiple requests seem to get the same token `a350bc9b-9f65-4c5e-b6a6-d56e21a82512` 
    * could be time limited?

_Secure resource: /secret/note_

* Token is correct - 200, text of `{\"note\":\"\"}` is returned. 
* when accept: application/xml is passed, it is ignored
* Token is incorrect: 403
* No token: 401
* POST a note returns a 200 with correct x-auth-token header
* It seems only one note at a time is captured to be returned with the next get
* Can't POST a note with incorrect or missing x-auth-token
* Alternative header `authorization: Bearer <token string>` is accepted

### Summary 

* Secure resource /secret/note is correctly protected by authorization 

## Issues
* `Accept` is ignored for /secret/note, even for invalid values. 