'use strict';
(function () {
    var myApp = angular.module('myApp');

    myApp.factory('authService', function ($http, $q, localStorageService) {

        var serviceBase = '/';
        var authServiceFactory = {};

        var _authentification = {
            isAuth: false,
            userName: '',
            isCoach: false

        };

        var _saveRegistration = function (registration) {
            _logOut();

            return $http.post('api/account/logout').then(function (response) {
                return response;
            });
        };

        var _login = function (loginData) {
            var data = "grant_type=password&userName=" + loginData.Username + "&password=" + loginData.Password;

            var deferred = $q.defer();

            $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {


                $http.get('api/User/NeedsPasswordReset?userName=' + loginData.Username).success(function (isResetNeeded) {

                    localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.Username });

                  

                    if (isResetNeeded) {
                        response.isResetNeeded = true;
                       
                    } else {
                          _authentification.isAuth = true;
                    _authentification.userName = loginData.Username;
                    }
                    deferred.resolve(response);
                });



            })
                .error(function (err, status) {
                    _logOut();
                    deferred.reject(err);

                });
            return deferred.promise;
        };
        var _logOut = function () {
            localStorageService.remove('authorizationData');

            _authentification.isAuth = false;
            _authentification.userName = '';
        };

        var _fillAuthData = function () {
            var authData = localStorageService.get('authorizationData');

            if (authData) {
                _authentification.isAuth = true;
                _authentification.userName = authData.userName;
            }
        };


        authServiceFactory.saveRegistration = _saveRegistration;
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentification = _authentification;
        return authServiceFactory;
    });
}());