Feature: challenger endpoint 

Scenario: An empty POST to the 'challenger' endpoint returns 'x-challenger' HTTP header
When an empty POST is made to the 'challenger' endpoint
Then the header 'x-challenger' is returned in the response
