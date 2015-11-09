(function() {
	'use strict';

	angular
	.module('ScraperApp')
	.controller('ProfileController', ProfileController);

	function ProfileController(AccountFactory, $auth) {
		var vm = this;
		vm.user = {};
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
		
		vm.link = function(provider) {
		  $auth.link(provider)
			.then(function() {
			  console.log('You have successfully linked a ' + provider + ' account');
			  vm.getProfile();
			})
			.catch(function(response) {
			  console.log(response.data.message, response.status);
			});
		};
		vm.unlink = function(provider) {
		  $auth.unlink(provider)
			.then(function() {
			  console.log('You have unlinked a ' + provider + ' account');
			  vm.getProfile();
			})
			.catch(function(response) {
			  console.log(response.data ? response.data.message : 'Could not unlink ' + provider + ' account', response.status);
			});
		};
		
		vm.getProfile();
	}
})();