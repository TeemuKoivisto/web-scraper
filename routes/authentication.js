var request = require('request');

var jwt = require('jwt-simple');
var config = require('../config/authConfig');
var auth = require('../config/authMethods');

var User = require('../models/user');

module.exports.unLink = function(req, res) {
  var provider = req.body.provider;
  var providers = ['facebook', 'google'];

  if (providers.indexOf(provider) === -1) {
    return res.status(400).send({ message: 'Unknown OAuth Provider' });
  }

  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User Not Found' });
    }
	 
	var count = 0;
	var object = user.toObject();
	// console.log('user on', object);
	for(var key in object) {
		console.log(key);
		if (providers.indexOf(key)!==-1) {
			count++;
		}
	}
	 // console.log('providers on', count);
	if (count===1) {
		res.status(405).send({ message: 'Cant unlink the last provider' });
	} else {
		user[provider] = undefined;
		user.save(function() {
		  res.status(200).end();
		});
	}
  });
};

module.exports.googleAuth = function(req, res){
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };
	console.log('taalla');
  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
      if (profile.error) {
        return res.status(500).send({message: profile.error.message});
      }
	  console.log('profile on ', profile);
      // Step 3a. Link user accounts.
      if (req.headers.authorization) {
        User.findOne({ 'google.id': profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.google.id = profile.sub;
            user.google.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
            user.google.displayName = user.displayName || profile.name;
            user.save(function() {
              var token = auth.createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
		  console.log('hei');
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ 'google.id': profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.send({ token: auth.createJWT(existingUser) });
          }
          var user = new User();
		  user.primary = 'google';
          user.google.id = profile.sub;
          user.google.picture = profile.picture.replace('sz=50', 'sz=200');
          user.google.displayName = profile.name;
          user.save(function(err) {
            var token = auth.createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
}

module.exports.facebookAuth = function(req, res){
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }
      console.log(profile);
      if (req.headers.authorization) {
		  console.log('luon linkin facebook accounttiin');
        User.findOne({ 'facebook.id': profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.facebook.id = profile.id;
            user.facebook.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.facebook.displayName = user.displayName || profile.name;
            user.save(function() {
              var token = auth.createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ 'facebook.id': profile.id }, function(err, existingUser) {
          if (existingUser) {
            var token = auth.createJWT(existingUser);
            return res.send({ token: token });
          }
          var user = new User();
          user.primary = 'facebook';
          user.facebook.id = profile.id;
          user.facebook.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.facebook.displayName = profile.name;
          user.save(function(err) {
			if (err) console.log(err);
            var token = auth.createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
}