(function () {
    var myApp = angular.module('myApp', ['ngRoute' ,'ngMaterial', 'LocalStorageModule', 'toastr', 'ngAnimate']);

    myApp.config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('red')
        .accentPalette('blue');
    });

    myApp.config(function ($routeProvider, $httpProvider) {

        $routeProvider
            //.when('/Login', {
            //    templateUrl: 'app/views/Login.html',
            //    controller: 'userController'
            //})
            .when('/', {
                templateUrl: 'app/views/Suggestions.html',
                controller: 'suggestionsController',
                resolve: {
                    isAuth: function (authService) {
                        if (authService.authentification.fullName) {
                            return true;
                        }

                        return false;
                    }
                }
            })
            .when('/EOM', {
                templateUrl: 'app/views/EOM.html',
                controller: 'eomController',
                resolve: {
                    isAuth: function (authService) {
                        if (authService.authentification.fullName) {
                            return true;
                        }

                        return false;
                    }
                }
            })
            .when('/Events', {
                templateUrl: 'app/views/Events.html',
                controller: 'eventsController',
                resolve: {
                    isAuth: function (authService) {
                        if (authService.authentification.fullName) {
                            return true;
                        }

                        return false;
                    }
                }
            })
            .otherwise({ redirectTo: '/' });

        $httpProvider.interceptors.push('authInterceptorService');

    });

    myApp.config(function () {
        //uiSelectConfig.theme = 'bootstrap';
        //uiSelectConfig.resetSearchInput = true;
        //uiSelectConfig.appendToBody = true;
    });

    myApp.run(function ($rootScope, authService, $location, $route) {
        $rootScope.$on('$routeChangeStart', function (event, currentRoute) {
            if (!authService.authentification.isAuth) {

                authService.login({ Username: "sso", Password: "sso" }).then(function () {
                  authService.fillAuthData();
                  $location.path('/');
                  $route.reload();
                }, function () {
                    window.location = window.ssoLoginUrl + encodeURIComponent($location.absUrl());
                });

                //event.preventDefault();
                //$rootScope.$evalAsync(function () {
                //    $location.path('/Login');
                //});
            }

        });

        authService.fillAuthData();
    });
}());