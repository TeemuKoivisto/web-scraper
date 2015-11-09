(function() {
	'use strict';

	angular
	.module('ScraperApp')
	.service('ScraperService', ScraperService);

	function ScraperService($http) {
		this.scraped = [
			{
				title: 'aasdfggggggggdddddddddddddddddddddddddddGGGGGGGGGG',
				url: 'www.lol.fi'
			},
			{
				title: 'addd',
				url: 'www.lol.fi'
			}
		];
		
		this.scrape = function(url, something) {
			return this.scraped;
		}
		
		this.scrape2 = function(url, options) {
			var json = {
				url: url,
				options: options
			};
			return $http.post('/basic2', json).then(function(response) {
				// console.log('hui', response);
				return response.data;
			})
		}
	}
})();