var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

module.exports.basicScrape = function(req, res){
	if (!req.body.url) {
		res.send('no url you fool');
		return;
	}
	
	var urli = req.body.url;
	console.log('urli ' + urli);
	request(urli, function(error, response, html){
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
				var newlink = {};
				newlink.url = url;
				json.urls++;
				console.log('hei', data);
				
				if (data.children.length > 0 && typeof data.children[0] !== 'undefined' && data.children[0].type === 'text') {
					newlink.title = data.children[0].data;
					json.titles++;
				}
				json.links.push(newlink);
			})
		}
		res.status('Check your console!').send(json);
	});
}

module.exports.pageScrape = function(req, res){
	var urli = req.body.url;
	console.log('urli ' + urli);
	if (typeof urli === 'undefined' || urli.length===0) {
		urli = 'http://www.taloussanomat.fi/sivu.php?page_id=1?';
	}
	var requestOptions = {
		uri: urli,
		encoding: null
	};
	request(requestOptions, function(error, response, html){
		var json = {
			links: [],
			urls: 0,
			titles: 0
		}
		if(!error){
			html = iconv.decode(html, "ISO-8859-1");
			var $ = cheerio.load(html);
			
			$('a').filter(function(){
				var data = $(this);
				var url = data.attr('href');
				if (!url) {
					return;
				}
				var newlink = {
					url: url
				}
				// console.log('hei', data);
				json.urls++;
				if (data.text()) {
					// console.log(data.text());
					newlink.title = data.text();
					json.titles++;
				} else {
					newlink.title = '';
				}
				json.links.push(newlink);
			})
		}
		res.status('Check your console!').send(json);
	});
}