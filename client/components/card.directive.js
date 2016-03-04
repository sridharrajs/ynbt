/**
 * Created by sridharrajs.
 */

angular
	.module('readLater')
	.directive('card', directive);

function directive() {
	return {
		scope: {
			data: '='
		},
		restrict: 'AE',
		replace: true,
		templateUrl: (element, attrs)=> {
			return attrs.templateurl || 'components/card.html';
		},
		controller: CardController,
		controllerAs: 'cardCtrl',
		bindToController: true
	};
}

function CardController(Article, SweetAlert, $scope) {

	const ALERT_OPTIONS = {
		title: 'Are you sure?',
		allowOutsideClick: true,
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Yes",
		closeOnConfirm: true
	};

	let self = this;

	self.id = self.data._id;
	self.tag = self.data.tag;
	self.title = self.data.title;
	self.url = self.data.url;
	self.is_fav = self.data.is_fav;

	self.favourited = getFavourites(self.data.is_fav);
	self.deleteArticle = deleteArticle;
	self.archive = archive;
	self.favourite = favourite;

	$scope.$watch('data', function () {
		console.log('99', self.data);
	}, true)

	function getFavourites(isFav) {
		return isFav === true ? 'favourited' : '';
	}

	function deleteArticle() {
		SweetAlert.swal(ALERT_OPTIONS, (isConfirm) => {
			if (isConfirm) {
				Article.deleteArticle(self.id).then((response)=> {
					$(`#${self.id}`).remove();
					self.alertMsg = 'Success!';
					self.alertClass = 'show alert-success';
				}).catch((err)=> {
					self.alertMsg = 'Failed :(';
					self.alertClass = 'show alert-danger';
				});
			}
		});
	}

	function archive() {
		SweetAlert.swal(ALERT_OPTIONS, (isConfirm) => {
			if (isConfirm) {
				Article.archive(self.id).then((response)=> {
					$(`#${self.id}`).remove();
				}).catch((err)=> {
					console.log('999');
				});
			}
		});
	}

	function favourite() {
		let newStatus = !self.is_fav;
		Article.favourite({
			articleId: self.id,
			isFavourited: newStatus
		}).then((response)=> {
			let data = response.data.data;
			let msg = response.data.msg;
			self.is_fav = newStatus;
			self.favourited = getFavourites(newStatus);
		}).catch((response)=> {

		});
	}

}