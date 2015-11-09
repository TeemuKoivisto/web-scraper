(function() {
	'use strict';

	angular
	.module('ScraperApp')
	.controller('ScrapeController', ScrapeController);

	function ScrapeController(ScraperService) {
		var vm = this;
		vm.scraped = ScraperService.scrape('iltasanomat', 'asdf');
		vm.site = '';
		vm.options = '';
		vm.scrape = function() {
			ScraperService.scrape2(vm.site, vm.options).then(function(response) {
				// console.log('response on ' + response);
				vm.scraped = response.links;
			})
		};
	}
})();