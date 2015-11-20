var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var basicRoutes = require('./basic');
var authRoutes = require('./authentication');
var profileRoutes = require('./profile');

var auth = require('../config/authMethods');

module.exports = function(app) {
	
	app.get('/api/me', auth.ensureAuthenticated, profileRoutes.getProfile);
	app.put('/api/me', auth.ensureAuthenticated, profileRoutes.putProfile);
	
	app.post('/auth/unlink', auth.ensureAuthenticated, authRoutes.unLink);
	app.post('/auth/google', authRoutes.googleAuth);
	app.post('/auth/facebook', authRoutes.facebookAuth);
	
	app.post('/basic', basicRoutes.basicScrape);
	app.post('/basic2', basicRoutes.pageScrape);
	
	app.post('/scrap', function(req, res){
		var type = req.body.type;
		if (!type) {
			res.send('no type you fool');
			return;
		}
		
		var url = 'http://www.iltasanomat.fi/'+type;
		console.log('urli ' + url);
		request(url, function(error, response, html){
			var json = {
				links: [],
				urls: 0,
				titles: 0
			}
			if(!error){
				var $ = cheerio.load(html);
				
				$('a').filter(function(){
					var data = $(this);
					var url = data.attr('href');
					if (url && url.substring(0, (5 + type.length)) === '/' + type + '/art') {
						var newlink = {};
						newlink.url = url;
						json.urls++;
						// console.log("data on " + data);
						var titles = data.find('h2');
						// console.log("titles on " + titles);
						if (titles.length>0) {
							if (titles[0].children.length > 0 && titles[0].children[0].type === 'text') {
								newlink.title = titles[0].children[0].data;
								json.titles++;
							}
							// console.log("title on ", titles[0]);
						}
						json.links.push(newlink);
					}
				})
			}
			res.status('Check your console!').send(json);
		});
	})
	
}
