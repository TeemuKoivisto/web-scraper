(function() {
	'use strict';

	angular
	.module('ScraperApp')
	.controller('LoginController', LoginController);

	function LoginController($scope, $location, $auth) {
		var vm = this;
		$scope.authenticate = function(provider) {
			$auth.authenticate(provider)
				.then(function() {
					console.log('You have successfully signed in with ' + provider);
					$location.path('/');
				})
				.catch(function(response) {
					console.log(response.data.message);
				});
		};
	}
})();