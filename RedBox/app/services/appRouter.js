(function () {
    var myApp = angular.module('myApp', ['ngRoute' ,'ngMaterial', 'LocalStorageModule']);

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
                authorize: true
            })
            .when('/EOM', {
                templateUrl: 'app/views/EOM.html',
                controller: 'eomController',
                authorize: true
            })
            .otherwise({ redirectTo: '/' });

        //$httpProvider.interceptors.push('authInterceptorService');

    });

    myApp.config(function () {
        //uiSelectConfig.theme = 'bootstrap';
        //uiSelectConfig.resetSearchInput = true;
        //uiSelectConfig.appendToBody = true;
    });

    myApp.run(function ($rootScope, authService, $location) {
        $rootScope.$on('$routeChangeStart', function (event, currentRoute) {
            if (!authService.authentification.isAuth) {

                authService.login({ Username: "sso", Password: "sso" }).then(function () {
                    $location.path('/');
                }, function () {
                    window.location = 'http://localhost:58902/Account/Login.aspx?ReturnUrl=' + encodeURIComponent($location.absUrl());
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