(function () {
    'use strict';

    var myApp = angular.module('Redbox');

    myApp.service('userService', ['$http', '$q', function ($http, $q) {

        var loadUsers = function () {
            var deferred = $q.defer();

            $http.get('/api/user/GetUsers').success(function (users) {
                deferred.resolve(users);
            }).error(function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        return {
            loadUsers: loadUsers
        };

    }]);

}());
