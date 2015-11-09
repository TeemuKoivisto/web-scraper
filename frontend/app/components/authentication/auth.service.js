(function() {
	
	angular
	.module('ScraperApp')
	.service('AuthService', AuthService);
	
	function AuthService($location, $auth) {
		if (!$auth.isAuthenticated()) {
			return ;
		}
		$auth.logout()
		.then(function() {
			console.log('you have been logged out');
			$location.path('/');
		})
	}
})();