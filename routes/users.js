var express = require('express');
var User = require('../models/user');
var Group = require('../models/group');

var router = express.Router();



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

router.post('/:id/groups', function (req, res) {

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

    console.log(user);

    var group = new Group();
    group.name = req.body.name;
    group.admin = [user._id];
    group.members = [user._id];

    console.log(group);

    group.save(function (err) {
      if (err){
        console.log(err);
        res.send(err);
      }

      res.json(
        {
          message: 'Group created'
        }
      );
      res.status(200).end();
    });
  });

});

module.exports = router;
