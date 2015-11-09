(function() {
	'use strict';

	angular
	.module('ScraperApp', ['ngRoute', 'satellizer']);
})();
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
(function() {
	'use strict';
	
	angular
	.module('ScraperApp')
	.factory('AccountFactory', AccountFactory);
	
	function AccountFactory($http) {
		return {
			getProfile: function() {
				return $http.get('/api/me');
			},
			updateProfile: function(profileData) {
				return $http.put('/api/me', profileData);
			}
		}
	}
})();
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
(function() {
	'use strict';

	angular
	.module('ScraperApp')
	.controller('ProfileController', ProfileController);

	function ProfileController(AccountFactory) {
		var vm = this;
		vm.user = {
			facebook: {
				id: '',
				token: ''
			},
			google: {
				id: '',
				token: ''
			}
		}
		vm.getProfile = function() {
			AccountFactory.getProfile()
				.then(function(response) {
					vm.user = response.data;
					console.log('user tuli', vm.user);
				})
				.catch(function(response) {
					console.log(response.data.message, response.status);
					// toastr.error(response.data.message, response.status);
				});
		};
		/*
		vm.updateProfile = function() {
		  Account.updateProfile(vm.user)
			.then(function() {
			  toastr.success('Profile has been updated');
			})
			.catch(function(response) {
			  toastr.error(response.data.message, response.status);
			});
		};
		vm.link = function(provider) {
		  $auth.link(provider)
			.then(function() {
			  toastr.success('You have successfully linked a ' + provider + ' account');
			  vm.getProfile();
			})
			.catch(function(response) {
			  toastr.error(response.data.message, response.status);
			});
		};
		vm.unlink = function(provider) {
		  $auth.unlink(provider)
			.then(function() {
			  toastr.info('You have unlinked a ' + provider + ' account');
			  vm.getProfile();
			})
			.catch(function(response) {
			  toastr.error(response.data ? response.data.message : 'Could not unlink ' + provider + ' account', response.status);
			});
		};
		*/
		vm.getProfile();
	}
})();
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