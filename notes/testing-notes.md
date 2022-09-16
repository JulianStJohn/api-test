
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
## Charter:

### Session Details
* **Date:** 
* **Start:**  
* **Duration:** 
* **Tester:** Julian

### Tools

### Files 

### Test Notes 

### Summary 

## Issues