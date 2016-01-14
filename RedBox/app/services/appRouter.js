(function () {
    var myApp = angular.module('myApp', ['ngRoute' ,'ngMaterial']);

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
            .when('/MyEvaluation', {
                templateUrl: 'app/views/MyEvaluation.html',
                controller: 'myEvaluationController',
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

    //myApp.run(function ($rootScope, authService, $location) {
    //    $rootScope.$on('$routeChangeStart', function (event, currentRoute) {
    //        if (!authService.authentification.isAuth) {


    //            //event.preventDefault();
    //            $rootScope.$evalAsync(function () {
    //                $location.path('/Login');
    //            });
    //        }

    //        //    if (authService.authentification.isAuth) {

    //        //        $rootScope.$evalAsync(function () {
    //        //            $location.path('/SelfEvaluation');
    //        //        });

    //        //}else{

    //        //        //  console.log('Not authorized for route  ' + currentRoute.$$route.originalPath);

    //        //   // event.preventDefault();
    //        //    $rootScope.$evalAsync(function () {
    //        //        $location.path('/');
    //        //    });
    //        //}
    //    });

    //    authService.fillAuthData();
    //});
}());