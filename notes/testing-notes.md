
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

### Task Breadown
 * Perform get request on todos and todo
 * Output meaningful details for the request / response 

### Tools

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

