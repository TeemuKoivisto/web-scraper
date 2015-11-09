var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var basicRoutes = require('./basic');
var authRoutes = require('./authentication');
var profileRoutes = require('./profile');

var auth = require('../config/authMethods');

module.exports = function(app) {
	
	app.get('/hei', function(req, res, next) {
		res.send('huiffffsss');
	});
	
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
	
	app.get('/scrap', function(req, res){
		url = 'http://www.iltasanomat.fi/kotimaa/';
		
		request(url, function(error, response, html){
			var json = {
				titles: [], 
				urls: [] 
			};
			if(!error){
				var $ = cheerio.load(html);
				
				$('a').filter(function(){
					var data = $(this);
					var url = data.attr('href');
					if (url && url.substring(0, 12) === '/kotimaa/art') {
						json.urls.push(url);
						// console.log("data on " + data);
						var titles = data.find('h2');
						// console.log("titles on " + titles);
						if (titles.length>0) {
							if (titles[0].children.length > 0 && titles[0].children[0].type === 'text') {
								json.titles.push(titles[0].children[0].data);
							}
							// console.log("title on ", titles[0]);
						}
					}
				})
			}
			json.urlslength = json.urls.length;
			json.titleslength = json.titles.length;
			/*
			fs.writeFile('uutiset.json', JSON.stringify(json, null, 4), function(err){
				console.log('File successfully written! - Check your project directory for the output.json file');
			})*/
			res.status('Check your console!').send(json);
		});
	})
	
	app.get('/scrape', function(req, res){
		url = 'http://www.imdb.com/title/tt1229340/';
		
		request(url, function(error, response, html){
			if(!error){
				var $ = cheerio.load(html);

				var title, release, rating;
				var json = { title : "", release : "", rating : ""};

				$('.header').filter(function(){
					var data = $(this);
					title = data.children().first().text();
					release = data.children().last().children().text();

					json.title = title;
					json.release = release;
				})

				$('.star-box-giga-star').filter(function(){
					var data = $(this);
					rating = data.text();

					json.rating = rating;
				})
			}

			// To write to the system we will use the built in 'fs' library.
			// In this example we will pass 3 parameters to the writeFile function
			// Parameter 1 :  output.json - this is what the created filename will be called
			// Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
			// Parameter 3 :  callback function - a callback function to let us know the status of our function

			fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
				console.log('File successfully written! - Check your project directory for the output.json file');
			})

			// Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
			res.send('Check your console!')

		});
	})
}
