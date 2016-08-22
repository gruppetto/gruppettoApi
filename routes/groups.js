var express = require('express');
var Group = require('../models/group');
var User = require('../models/user');

var router = express.Router();

var jwt = require('jwt-simple');
var config = require('../config/database');
var passport = require('passport');

// get all

router.get('/', function (req, res) {
  Group
    .find()
    .populate(['admin', 'members'])
    .exec(function (err, groups) {
      if (err) {
        console.log(err);
        res.json(
          {
            message: 'Group not found'
          }
        );
        res.status(404).end();
      }
      res.json(groups);
    });
});

// update group

router.put('/:id', passport.authenticate('jwt', {session: false}), function (req, res) {
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
        Group.findById(req.params.id, function (err, group) {
          if (err)
            res.send(err);

          group.name = req.body.name;

          group.save(function (err) {
            if (err)
              res.send(err);

            res.json({success: true, message: 'Group updated'});
          });
        });
      }

    });
  }
  else {

    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

// delete group by id

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
        Group.findByIdAndRemove(req.params.id, function (err) {
          if (err)
            res.send(err);

          res.json({success: true, message: 'Group deleted'});
        });
      }

    });
  }
  else {

    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

// Leave group

router.delete('/:id/members/:memberId', passport.authenticate('jwt', {session: false}), function (req, res) {
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
        Group.findById(req.params.id, function (err, group) {
          if (err) {
            res.json(
              {
                message: 'Group not found'
              }
            );
            res.status(404).end();
          }

          User.findById(req.params.memberId, function (err, user) {
            if (err) {
              res.json(
                {
                  message: 'User not found'
                }
              );
            }

            group.members.remove(user._id);
            group.admin.remove(user._id);

            group.save(function (err) {
              if (err)
                res.send(err);

              res.json({success: true, message: 'group left'});
            });
          });

        });
      }

    });
  }
  else {

    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

// Join group

router.post('/:id/members', passport.authenticate('jwt', {session: false}), function (req, res) {
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

        Group.findById(req.params.id, function (err, group) {
          if (err) {
            res.json(
              {
                message: 'Group not found'
              }
            );
            res.status(404).end();
          }

          User.findById(req.body.memberId, function (err, user) {
            if (err) {
              res.json(
                {
                  message: 'User not found'
                }
              );
            }

            group.members.push(user._id);

            // if no admins on the group when joining, then the new member is the new admin
            if(group.admin.length === 0) {
              group.admin.push(user._id);
            }

            group.save(function (err) {
              if (err)
                res.send(err);

              res.json({success: true, message: 'group updated'});
            });
          });

        });
      }

    });
  }
  else {

    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});


// Get by id


router.get('/:id', function (req, res) {
  Group
    .findById(req.params.id)
    .populate(['admin', 'members'])
    .exec(function (err, group) {
      if (err) {

        res.json(
          {
            message: 'Group not found'
          }
        );
        res.status(404).end();
      }
      res.json(group);
    });
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
