
(function () {
  var myApp = angular.module('Redbox', ['ngRoute', 'ngMaterial', 'LocalStorageModule', 'toastr',
    'ngAnimate']);

  myApp.config(['$mdThemingProvider', function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('red')
      .accentPalette('blue');
  }]);

  myApp.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    var resolveIsAuth = ['authService', function (authService) {
      if (authService.authentification.fullName) {
        return true;
      }

      return false;
    }];

    $routeProvider
      .when('/', {
        templateUrl: 'app/views/Suggestions.html',
        controller: 'suggestionsController',
        resolve: {
          isAuth: resolveIsAuth
        }
      })
      .when('/EOM', {
        templateUrl: 'app/views/EOM.html',
        controller: 'eomController',
        resolve: {
          isAuth: resolveIsAuth
        }
      })
      .when('/Events', {
        templateUrl: 'app/views/Events.html',
        controller: 'eventsController',
        resolve: {
          isAuth: resolveIsAuth
        }
      })
      .otherwise({
        redirectTo: '/'
      });

    $httpProvider.interceptors.push('authInterceptorService');
  }]);

  myApp.run(['$rootScope', 'authService', '$location', '$route', function ($rootScope,
    authService, $location, $route) {
    $rootScope.$on('$routeChangeStart', function () {
      if (!authService.authentification.isAuth) {
        authService.login({
          Username: 'sso',
          Password: 'sso'
        }).then(function () {
          authService.fillAuthData();
          $location.path('/');
          $route.reload();
        }, function () {
          window.location = window.ssoLoginUrl + encodeURIComponent($location.absUrl());
        });
      }
    });

    authService.fillAuthData();
  }]);
}());
