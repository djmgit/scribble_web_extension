var app = angular.module('exApp', []);
app.controller('exCtrl', function($scope, $http) {

	$scope.fetched = {};
	
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
    		localStorage.setItem("token", $scope.token)
    		$scope.fetchNotes();
    	});
    }

    $scope.fetchNotes = function() {
    	var config = {headers:  {
        		"Authorization": "Bearer " + $scope.token
    		}
		};

		console.log(config.headers);

		var res = $http.post("https://app.accidentally14.hasura-app.io/api/all_notes", {},  config);
    	res.then(function(response) {
    		$scope.notes = response.data.data;
    		console.log($scope.notes)
    	});
    }

    $scope.show = function(note_id) {

    	if (!$scope.fetched[note_id]) {

    		var config = {headers:  {
        			"Authorization": "Bearer " + $scope.token
    			}
			};
	
			var dataObj = {
				"note_id": note_id
			}
	
			var res = $http.post("https://app.accidentally14.hasura-app.io/api/note_by_id", dataObj,  config);
    		res.then(function(response) {
    			var note_body = response.data.data[0].note_body;
    			console.log(note_body);
    			$("."+note_id+"-body").html(note_body);
    			$("."+note_id+"-note").click(function() {
    				$("."+note_id+"-body").slideToggle();
    			});
    			$scope.fetched[note_id] = true;
    		});
    	}
    }

    $scope.createNote = function() {
        var note_title = $scope.note_title;
        var note_body = $scope.note_body;
        var keywords = $scope.note_keywords;
        var category = $scope.note_category;

        var dataObj = {}
        if (note_title !== null && note_title !== "") {
            dataObj["note_title"] = note_title
        }

        if (note_body !== null && note_body !== "") {
            dataObj["note_body"] = note_body
        }

        if (keywords !== null && keywords !== "") {
            dataObj["keywords"] = keywords
        }

        if (category !== null && category !== "") {
            dataObj["category"] = category
        }

        $scope.token = localStorage.getItem("token");

        var config = {headers:  {
                    "Authorization": "Bearer " + $scope.token
                }
            };

        var res = $http.post("https://app.accidentally14.hasura-app.io/api/add_note", dataObj,  config);
            res.then(function(response) {
                console.log(response.data)
            });
    }
});