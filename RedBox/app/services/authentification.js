'use strict';
(function () {
    var myApp = angular.module('myApp');

    myApp.factory('authService', function ($http, $q, localStorageService, $rootScope) {

        var serviceBase = '/';
        var authServiceFactory = {};

        var _authentification = {
            isAuth: false,
            userName: '',
            isAdmin: false

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

                localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.Username });

                $http.get('api/User/UserInfo').then(function (userInfoResponse) {
                    _authentification.isAuth = true;
                    _authentification.userName = userInfoResponse.data.Email;
                    _authentification.fullName = userInfoResponse.data.fullName;
                    _authentification.isAdmin = userInfoResponse.data.isAdmin;

                    localStorageService.remove('authorizationData');

                    var email = angular.copy(userInfoResponse.data.email);

                    localStorageService.set('authorizationData', { token: response.access_token, userName: email, fullName: userInfoResponse.data.fullName, isAdmin: userInfoResponse.data.isAdmin });

                    deferred.resolve(response);
                });
            }).error(function (err, status) {
                localStorageService.remove('authorizationData');

                _authentification.isAuth = false;
                _authentification.userName = '';
                deferred.reject(err);

            });
            return deferred.promise;
        };
        var _logOut = function () {
            localStorageService.remove('authorizationData');

            _authentification.isAuth = false;
            _authentification.userName = '';

            window.location = window.ssoLogoutUrl;
        };

        var _fillAuthData = function () {
            var authData = localStorageService.get('authorizationData');

            if (authData) {
                _authentification.isAuth = true;
                _authentification.userName = authData.userName;
                _authentification.fullName = authData.fullName;
                _authentification.isAdmin = authData.isAdmin;
            }

            if (authData && (authData.userName == null || _authentification.fullName == null)) {
                $http.get('api/User/UserInfo').then(function (userInfoResponse) {
                    _authentification.isAuth = true;
                    _authentification.userName = userInfoResponse.data.email;
                    _authentification.fullName = userInfoResponse.data.fullName;
                    _authentification.isAdmin = userInfoResponse.data.isAdmin;
                });
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