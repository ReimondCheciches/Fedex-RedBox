(function () {
    var myApp = angular.module('myApp');

    myApp.controller('registerController', function ($scope, $http, $location,$timeout) {

        $scope.register = function () {
            if ($scope.user == null || $scope.user == undefined) {
                $scope.registrationError = "Please complete all the fields in order to register";
                return;
            }
            

            if (emptyCheck()) {
                if (matchPassword()) {
                    var data = {
                        Username: $scope.user.userName,
                        FullName: $scope.user.fullName,
                        Email:$scope.user.email,
                        Password: $scope.user.password
                    };
                    
                    $http.post('/api/user/register',data).success(function(response) {
                        $scope.registrationSuccess = response;
                        $timeout($location.path('/Login'), 3000, true);

                    })
                        .error(function(response) {

                            $scope.registrationError = response;
                        });

                } else {
                    $scope.registrationError = "Password field and Confirm filed must match!";
                }
            }

        };
        var emptyCheck = function () {
            if ($scope.user.fullName === "" || $scope.user.fullName === undefined ||
                $scope.user.userName === "" || $scope.user.userName === undefined ||
                $scope.user.password === "" || $scope.user.password === undefined ||
                $scope.user.confirmPassword === "") {
                
                $scope.registrationError = "All fields are required !";
                return false;
            }
            return true;
        };
        var matchPassword = function() {
            if ($scope.password === $scope.confirmPassword)
                return true;
            return false;
        };
    });

}());