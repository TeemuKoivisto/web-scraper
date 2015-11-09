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