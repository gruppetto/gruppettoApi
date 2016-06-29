var express = require('express');
var User = require('../models/user');
var Group = require('../models/group');

var router = express.Router();

router.get('/', function (req, res) {
  Group.find(function (err, groups) {
    if (err){
      console.log(err);
      res.send(err);
    }

    res.json(groups);
  });
});

router.get('/:id', function (req, res) {
  Group.findById(req.params.id, function (err, group) {
    if (err){
      console.log(err);
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
