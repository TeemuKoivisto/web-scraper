var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

function checkCharsetAndEncode(html) {
	console.log('html on', html);
	var uusi = iconv.decode(html, "utf-8");
	var $ = cheerio.load(uusi);
	
	$('meta').filter(function() {
		var data = $(this);
		 // console.log('', data);
		if (typeof data['0'].attribs !== 'undefined' && data['0'].attribs.content.indexOf('charset')!==-1) {
			console.log('charset löytyi', data['0'].attribs.content);
			if (data['0'].attribs.content.indexOf('utf-8')!==-1) {
				console.log('palauta utf8');
				return uusi;
			} else if (data['0'].attribs.content.indexOf('ISO-8859-1')!==-1) {
				console.log('palauta iso', html);
				var iso = iconv.decode(html, "ISO-8859-1");
				// console.log('iso on', iso);
				return iso;
			} else {
				console.log('wtf was encoding? ', data.attrib.content);
				throw('fug');
			}
		}
	})
	return uusi;
}

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
			console.log('headers', response.headers);
			if (response.headers['content-type'] === 'text/html; charset=utf-8' || response.headers['content-type'] === 'text/html; charset=UTF-8' || response.headers['content-type'] === 'text/html') {
				html = iconv.decode(html, "utf-8");
			} else if (response.headers['content-type'] === 'text/html; charset=ISO-8859-1') {
				html = iconv.decode(html, "ISO-8859-1");
			} else {
				throw('unknown encoding', response.headers['content-type']);
			}
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