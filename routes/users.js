var express = require('express');
var User = require('../models/user');
var Group = require('../models/group');
var mongoose = require('mongoose');

var router = express.Router();
var jwt = require('jwt-simple');
var config = require('../config/database');
var passport = require('passport');

/*
 *
 *  GET
 *
 ************************************************************************* */


// get users

router.get('/', function (req, res) {
  User.find(function (err, users) {
    if (err) {
      res.send(err);
    }

    res.json(users);
  });
});


// get user

router.get('/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) {
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


// get groups for a user

router.get('/:id/groups', function (req, res) {

  User.findById(req.params.id, function (err, user) {
    if (err) {
      res.json({
        message: 'User not found'
      });
      res.status(404).end();
    }

    Group
      .find({
        members: mongoose.Types.ObjectId(user._id)
      })
      .populate(['admin', 'members'])
      .exec(function (err, groups) {

        res.json(groups);
      });

  })
});

/*
 *
 *  POST
 *
 * *******************************************************/

// create user

router.post('/', function (req, res) {

  var user = new User();      // create a new instance of the User model
  user.name = req.body.name;
  user.imageLink = "";

  // save the bear and check for errors
  user.save(function (err) {
    if (err) {
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


// create group for a user

router.post('/:id/groups', function (req, res) {

  User.findById(req.params.id, function (err, user) {
    if (err) {
      res.json(
        {
          message: 'User not found'
        }
      );
      res.status(404).end();
    }


    var group = new Group();
    group.name = req.body.name;
    group.admin = [user._id];
    group.members = [user._id];


    group.save(function (err) {
      if (err) {
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

/*
 *
 *  PUT
 *
 * *******************************************************/


// update user

router.put('/:id', function (req, res) {

  // save the bear and check for errors
  User.findById(req.params.id, function (err, user) {
    if (err)
      res.send(err);

    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save(function (err) {
      if (err)
        res.send(err);

      res.json({success: true, message: 'User updated'});
    });
  });

});


/*
 *
 *  DELETE
 *
 * *******************************************************/


// delete user

router.delete('/:id', passport.authenticate('jwt', {session: false}), function (req, res) {
  var token = getToken(req.headers);

  if (token) {
    var decoded = jwt.decode(token, config.secret);

    User.findOne({
      email: decoded.email
    }, function (err, user) {
      if (err) throw err;

      if (!user) {

        return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
      }
      else {

        User.findByIdAndRemove(req.params.id, function (err) {
          if (err)
            res.send(err);

          res.json({success: true, message: 'User deleted'});
        });
      }

    });
  }
  else {

    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});


getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
