var express = require('express');
var Group = require('../models/group');
var User = require('../models/user');

var router = express.Router();

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

router.put('/:id', function (req, res) {

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

});

// delete group by id

router.delete('/:id', function (req, res) {
  Group.findByIdAndRemove(req.params.id, function (err) {
    if (err)
      res.send(err);

    res.json({success: true, message: 'Group deleted'});
  });
});

// Leave group

router.delete('/:id/members/:memberId', function (req, res) {
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
});

// Join group

router.post('/:id/members', function (req, res) {
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

      group.save(function (err) {
        if (err)
          res.send(err);

        res.json({success: true, message: 'group updated'});
      });
    });

  });
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

module.exports = router;
