(function () {
  'use strict';
  var myApp = angular.module('Redbox');
  myApp.factory('authInterceptorService', ['$q', '$location', 'localStorageService',
    function ($q, $location, localStorageService) {
      var authInterceptorServiceFactory = {};

      var _request = function (config) {
        config.headers = config.headers || {};

        var authData = localStorageService.get('authorizationData');
        if (authData) {
          config.headers.Authorization = 'Bearer ' + authData.token;
        }

        return config;
      };

      var _responseError = function (rejection) {
        if (rejection.status === 401) {
          localStorageService.remove('authorizationData');
          window.location = window.ssoLogoutUrl;
        }
        return $q.reject(rejection);
      };

      authInterceptorServiceFactory.request = _request;
      authInterceptorServiceFactory.responseError = _responseError;

      return authInterceptorServiceFactory;
    }]);
}());
