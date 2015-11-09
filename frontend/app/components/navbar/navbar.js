(function() {
	
	angular
	.module('ScraperApp')
	.controller('NavbarController', NavbarController);
	
	function NavbarController($scope, $auth) {
		$scope.isAuthenticated = function() {
			return $auth.isAuthenticated();
		};
	}
})();