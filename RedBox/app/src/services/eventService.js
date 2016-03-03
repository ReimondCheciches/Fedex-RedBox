(function () {
  'use strict';

  var module = angular.module('Redbox');

  module.service('eventService', ['$http', '$q', function ($http, $q) {
    var submitEvent = function (event) {
      var deferred = $q.defer();

      var request = {
        Description: event.description,
        Location: event.location,
        Time: event.time,
        Date: event.date
      };

      $http.post('/api/event/AddEvent', request).success(function (response) {
        deferred.resolve(response);
      }).error(function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    };

    var respondToEvent = function (eventId, eventResponse) {
      var deferred = $q.defer();
      $http.post('/api/event/RespondToEvent', {
        EventId: eventId,
        EventResponse: eventResponse
      }).success(function (response) {
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

    var getEventsForCurrentWeek = function () {
      var deferred = $q.defer();
      $http.get('/api/event/GetEventsForCurrentWeek').success(function (response) {
        deferred.resolve(response);
      }).error(function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    };
    var archiveEvent = function (id) {
      var deferred = $q.defer();

      $http.post('/api/event/ArchiveEvent', {
        Id: id
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    };

    var getEventsForCurrentMonth = function () {
      var deferred = $q.defer();
      $http.get('/api/event/GetEventsForCurrentMonth').success(function (response) {
        deferred.resolve(response);
      }).error(function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    };

    var cancelEvent = function (eventId) {
      var request = {
        Id: eventId
      };

      return $http.post('/api/event/cancel', request).then(function (data) {
        return data.data;
      }).catch(function (error) {
        return $q.reject(error);
      });
    };

    return {
      submitEvent: submitEvent,
      respondToEvent: respondToEvent,
      getEvents: getEvents,
      archiveEvent: archiveEvent,
      getEventsForCurrentMonth: getEventsForCurrentMonth,
      getEventsForCurrentWeek: getEventsForCurrentWeek,
      cancelEvent: cancelEvent
    };
  }]);
}());
