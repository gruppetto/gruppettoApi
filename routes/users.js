var express = require('express');
var User = require('../models/user');
var mongoose = require('mongoose');

var router = express.Router();

mongoose.connect('mongodb://gruppetto:gruppetto@ds021333.mlab.com:21333/gruppetto');


router.get('/', function (req, res) {
  User.find(function (err, users) {
    if (err){
      console.log(err);
      res.send(err);
    }

    res.json(users);
  });
});

router.get('/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err){
      console.log(err);
      res.json(
        {
          message: 'User not found'
        }
      );
      res.status(404).end();
    }

    res.json(user);
  });
});

router.post('/', function (req, res) {

  var user = new User();      // create a new instance of the User model
  user.name = req.body.name;
  user.imageLink = "";

  // save the bear and check for errors
  user.save(function (err) {
    if (err){
      console.log(err);
      res.send(err);
    }

    res.json(
      {
        message: 'User created'
      }
    );
    res.status(200).end();
  });
});

module.exports = router;
