(function () {
    'use strict';

    var module = angular.module('myApp');

    module.service('eventService', ['$http', '$q', function ($http, $q) {

        var submitEvent = function (eventDesc) {

            var deferred = $q.defer();

            $http.post('/api/event/AddEvent', { 'EventDesc': eventDesc }).success(function (response) {
                deferred.resolve(response);

            }).error(function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        var respondToEvent = function (eventId, eventResponse) {
            var deferred = $q.defer();
            $http.post('/api/event/RespondToEvent', { 'EventId': eventId, 'EventResponse': eventResponse }).success(function (response) {
                deferred.resolve(response);

            }).error(function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        var getEvents = function () {
            var deferred = $q.defer();
            $http.get('/api/event/GetEvents').success(function (response) {
                deferred.resolve(response);

            }).error(function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        };


        return {
            submitEvent: submitEvent,
            respondToEvent: respondToEvent,
            getEvents: getEvents
        };

    }]);
})();