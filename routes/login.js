var express = require('express');
var User = require('../models/user');

var router = express.Router();


router.post('/', function (req, res) {

  console.log(req.body);

  User.find({
    email: req.body.email
  }).exec(function (err, user) {
    if (err) {
      console.log('error:' + err);
    }

    if (user.length === 0) {
      console.log('no user found');

      var newUser = new User();      // create a new instance of the User model
      newUser.name = req.body.userName;
      newUser.fbId = req.body.fbId;
      newUser.pictureUrl = req.body.pictureUrl;
      newUser.email = req.body.email;

      // save the bear and check for errors
      newUser.save(function (err) {
        if (err) {
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
    }
    else {
      var foundUser = user[0];

      foundUser.name = req.body.userName;
      foundUser.pictureUrl = req.body.pictureUrl;

      console.log(user);

      foundUser.save(function (err) {
        if (err) {
          console.log(err);
          res.send(err);
        }
        res.send(user)
      });

    }

  });


});

module.exports = router;
