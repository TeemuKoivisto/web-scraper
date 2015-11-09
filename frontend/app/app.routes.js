(function() {
	'use strict';

	angular
	.module('ScraperApp')
	.config(routeConfig);

	function routeConfig($routeProvider, $authProvider) {
		$routeProvider
			.when('/scrape', {
				controller: 'ScrapeController',
				templateUrl: 'app/components/scrape/scrape_index.html',
				controllerAs: 'scrape'
			})
			.when('/profile', {
				controller: 'ProfileController',
				templateUrl: 'app/components/profile/profile_index.html',
				controllerAs: 'profile',
				resolve: {
					loginRequired: loginRequired
				}
			})
			.when('/login', {
				controller: 'LoginController',
				templateUrl: 'app/components/login/login_index.html',
				controllerAs: 'login'
			})
			.when('/logout', {
				controller: 'LogoutController',
				template: null
			})
			.otherwise({
				redirectTo: '/'
			});
		
		$authProvider.facebook({
			clientId: '949975411766577'
		});

		$authProvider.google({
			clientId: '227681006174-d0g75l4r6d30qsgq59744trc4b54abnd.apps.googleusercontent.com'
		});
		
		function loginRequired($q, $location, $auth) {
			var deferred = $q.defer();
			if ($auth.isAuthenticated()) {
				deferred.resolve();
			} else {
				$location.path('/login');
			}
			return deferred.promise;
		}
	}
})();