'use strict';

angular
	.module('readLater')
	.controller('HomeCtrl', HomeCtrl);

function HomeCtrl($timeout, $log, Auth, $state, Article, SweetAlert, User) {
	let self = this;

	self.alertMsg = '';
	self.alertClass = '';
	self.articles = [];
	self.pageNo = 0;

	self.addUrl = addUrl;
	self.deleteArticle = deleteArticle;
	self.fetchNextArticle = fetchNextArticle;
	self.previousArticle = previousArticle;
	self.logout = logout;

	function deleteArticle(id) {
		SweetAlert.swal({
			title: 'Are you sure?',
			allowOutsideClick: true,
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes",
			closeOnConfirm: true
		}, function () {
			Article
				.deleteArticle(id)
				.then((response)=> {
					$(`#${id}`).remove();
					self.alertMsg = 'Success!';
					self.alertClass = 'show alert-success';
					clearMsg();
					self.count--;
				})
				.catch((err)=> {
					self.alertMsg = 'Failed :(';
					self.alertClass = 'show alert-danger';
					clearMsg();
				});
		});
	}

	function clearMsg() {
		$timeout(()=> {
			self.alertClass = '';
		}, 1000);
	}

	self.profile_url = '';
	self.emailId = '';
	init();

	User
		.getMe()
		.then((response)=> {
			self.profile_url = response.data.data.profile_url;
			self.username = response.data.data.username;
			self.count = response.data.data.count;
			console.log('all good');
		})
		.catch(()=> {
			console.log('something');
		});

	function init() {
		Article
			.getArticles(self.pageNo)
			.then((response) => {
				self.pageNo = response.data.data.pageNo;
				self.articles = _.union(self.articles, response.data.data.articles)
			});
	}

	function fetchNextArticle() {
		self.pageNo = self.pageNo + 1;
		Article
			.getArticles(self.pageNo)
			.then((response) => {
				self.articles.length = 0;
				self.articles = _.union(self.articles, response.data.data.articles)
			});
	}

	function previousArticle() {
		if (self.pageNo >= 1) {
			self.pageNo = self.pageNo - 1;
		}
		Article
			.getArticles(self.pageNo)
			.then((response) => {
				self.articles.length = 0;
				self.articles = _.union(self.articles, response.data.data.articles)
			});
	}

	function logout() {
		Auth.removeToken();
		$state.go('login');
	}

	self.goSettings = goSettings;

	function goSettings() {
		$state.go('settings');
	};

	function addUrl() {
		self.loading = true;
		let data = {
			url: self.newUrl
		};
		Article
			.addArticle(data)
			.then((response) => {
				self.newUrl = '';
				self.alertMsg = 'Success!';
				self.alertClass = 'show alert-success';
				clearMsg();
				self.articles.unshift(response.data.data.articles);
				self.loading = false;
				self.count++;
			})
			.catch((err) => {
				$log.error(err);
				self.alertMsg = 'Failed :(';
				self.alertClass = 'show alert-danger';
				clearMsg();
				self.loading = false;
			});
	}

}