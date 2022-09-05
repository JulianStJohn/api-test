
// Challenge 1

var axios = require('axios');

var config = {
  method: 'get',
  url: '{{api-url}}/challenges',
  headers: { }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});

