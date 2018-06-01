var app = angular.module('exApp', []);
app.controller('exCtrl', function($scope, $http) {
	
    $scope.isLoggedIn = function() {
        if (localStorage.getItem("token") == null) {
            return false;
        } else {
        	$scope.token = localStorage.getItem("token");
            return true;
        }
    }

    $scope.login = function() {
    	var username = $scope.username;
    	var password = $scope.password;

    	var dataObj = {"username": username, "password": password};

    	var res = $http.post("https://app.accidentally14.hasura-app.io/api/login", dataObj);
    	res.then(function(response) {
    		$scope.token = response.data.data.auth_token;
    		localStorage.setItem("item", $scope.token)
    		$scope.fetchNotes();
    	});
    }

    $scope.fetchNotes = function() {
    	console.log("fetching notes")
    }
});