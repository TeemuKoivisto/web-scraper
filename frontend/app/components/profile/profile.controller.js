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