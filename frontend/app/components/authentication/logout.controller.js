(function() {
	'use strict';

	angular
	.module('ScraperApp')
	.controller('LogoutController', LogoutController);
	
	function LogoutController($location, $auth) {
		if (!$auth.isAuthenticated()) {
			return;
		}
		$auth.logout()
		.then(function() {
			$location.path('/');
			console.log('you have been logged out');
		})
	}
})();