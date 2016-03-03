(function () {
    var myApp = angular.module('Redbox');

    myApp.controller('userController', function ($scope, $location, authService, $http) {

        if ($scope.$parent.isLogged()) {
            $location.path('/');
            return;
        }

        $scope.loginData = {
            Username: '',
            Password: ''
        };

        $scope.changePassword = function () {
            var request = {
                oldPassword: $scope.loginData.OldPassword,
                newPassword: $scope.loginData.NewPassword,
                confirmPassword: $scope.loginData.NewPasswordConfirm
            };
            $http.post('api/Account/ChangePassword', request).success(function() {
                $http.post('api/User/UpdateNeedsPasswordReset').success(function () {
                    authService.authentification.isAuth = true;
                    authService.authentification.userName = $scope.loginData.Username;
                    $location.path('/');
                });
            }).error(function(error) {
                if (error.modelState)
                    $scope.message = "";
                $scope.isNotAuthenticated = true;
                    for (var prop in error.modelState) {
                        $scope.message += error.modelState[prop][0];
                    }

            });
        }

        $scope.loginClick = function () {
            $scope.loading = true;
            authService.login($scope.loginData).then(function (response) {
                if (response.isResetNeeded) {
                    $scope.isResetNeeded = true;
                    $scope.loading = false;
                    $scope.isNotAuthenticated = false;
                } else {
                    $location.path('/');
                    $scope.loading = false;

                    $http.get('api/Roles/GetCoachFlag?userName=' + authService.authentification.userName).success(function (response) {
                        authService.authentification.isCoach = response;
                    });
                }
            },
            function (err) {
                $scope.message = err.error_description;
                $scope.isNotAuthenticated = true;
                $scope.loading = false;
            });
        };
        $(".login-changer").click(function () {
            $(this).toggleClass("open");
        });
    });

}());
