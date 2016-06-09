var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json(
    {
      'users': [
        {
          'Method': 'GET /users',
          'Response': [
            {
              _id: "string",
              imageLink: "string",
              name: "string"
            }
          ]
        },
        {
          'Method': 'GET /users/:id',
          'Response': {
            _id: "string",
            imageLink: "string",
            name: "string"
          }
        },
        {
          'Method': 'POST /users',
          'Body': {
            name: 'string',
            imageLink: 'string'
          },
          'Response': {
            code: 200,
            message: 'User created'
          }
        }
      ]
    }
  );
  res.status(200).end();
});

module.exports = router;
