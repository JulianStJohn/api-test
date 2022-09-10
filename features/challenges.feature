Feature: challenger endpoint 
    Scenario: An empty POST to the challenger endpoint returns 'x-challenger' HTTP header
    When an empty POST request is made to /challenger
    Then the header 'x-challenger' is returned in the response