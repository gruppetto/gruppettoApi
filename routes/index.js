var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json(
    {
      'users': [
        {
          'Method' : 'POST /login',
          'body': {
            'email': 'String (required)',
            'name':'String (optionnal)',
            'pictureUrl': 'String (optionnal)',
            'fbId':'String (optionnal)'
          }
        },
        {
          'Method': 'GET /users',
          'Response': [
            {
              _id: "string",
              pictureUrl: "string",
              name: "string"
            }
          ]
        },
        {
          'Method': 'GET /users/:id',
          'Response': {
            _id: "string",
            pictureUrl: "string",
            name: "string"
          }
        },
        {
          'Method' : 'POST /users/:id/groups',
          'body': {
            'name':'String (required)'
          }
        },
        {
          'Method': 'GET /users/:id/groups',
          'Response': [
            {
              _id: 'String',
              name: 'String',
              members: '[String]',
              admin: '[String]'
            }
          ]
        }
      ],
      'groups' : [
        {
          'Method' : 'GET /groups',
          'Response': [
            {
              _id: 'String',
              name: 'String',
              members: '[String]',
              admin: '[String]'
            }
          ]
        }
      ]
    }
  );
  res.status(200).end();
});

module.exports = router;
