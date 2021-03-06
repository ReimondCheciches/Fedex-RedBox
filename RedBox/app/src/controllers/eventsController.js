﻿
(function () {
  var myApp = angular.module('Redbox');

  myApp.controller('eventsController', ['$scope', '$location', 'eventService', '$q', 'isAuth',
    function ($scope, $location, eventService, $q, isAuth) {
      if (!isAuth) return;

      $scope.event = {};

      var allEvents;

      var loadEvents = function () {
        var deferred = $q.defer();

        if (allEvents) {
          deferred.resolve();
          return deferred.promise;
        }

        eventService.getEvents().then(function (events) {
          var sortedEvents = _.each(events, function (item) {
            item.date = new Date(item.date);
          });

          allEvents = sortedEvents;

          deferred.resolve();
        });

        return deferred.promise;
      };

      var init = function () {
        $scope.allTime = false;
        $scope.currentWeek = false;
        $scope.hotest = false;
        $scope.newest = true;
        $scope.archived = false;
        $scope.currentMonth = true;
      };

      init();

      $scope.submitEvent = function (event) {
        $scope.eventDesc = null;

        eventService.submitEvent(event).then(function (response) {
          allEvents.push(response);

          response.date = new Date(response.date);

          var offset = response.date.getTimezoneOffset();

          response.date.setMinutes(response.date.getMinutes() - offset);

          filterItems();
        });
      };

      $scope.respondToEvent = function (eventId, responseToEvent) {
        eventService.respondToEvent(eventId, responseToEvent)
          .then(function (response) {
            var event = _.find($scope.events, function (e) {
              return e.id == eventId;
            });

            event.goingUsers = response.goingUsers;
            event.going = response.going;
            event.tentativeUsers = response.tentativeUsers;
            event.tentative = response.tentative;
            event.notNowUsers = response.notNowUsers;
            event.notNow = response.notNow;
          });
      };

      $scope.cancelEvent = function (event) {
        eventService.cancelEvent(event.id).then(function () {
          event.isCanceld = true;
          event.archived = true;
        });
      };

      $scope.showEventsForCurrentWeek = function () {
        var deferred = $q.defer();

        $scope.allTime = false;
        $scope.currentWeek = true;
        $scope.currentMonth = false;

        loadEvents().then(function () {
          var weekDate = new Date();
          weekDate.setDate(weekDate.getDate() - 7);

          var events = _.filter(allEvents, function (s) {
            return s.date >= weekDate && (($scope.archived && s.archived) || (!
              $scope.archived && !s.archived));
          });

          if ($scope.archived || $scope.newest) {
            events = _.sortBy(events, 'date');
            events = events.reverse();
          } else if ($scope.hotest) {
            events = _.sortBy(events, function (item) {
              return -(item.goingUsers.length * 3 + item.tentativeUsers.length -
                item.notNowUsers.length * 2);
            });
          }

          $scope.events = events;

          deferred.resolve();
        });

        return deferred.promise;
      };

      $scope.showEventsForCurrentMonth = function () {
        var deferred = $q.defer();

        $scope.allTime = false;
        $scope.currentWeek = false;
        $scope.currentMonth = true;

        loadEvents().then(function () {
          var monthDate = new Date();
          monthDate.setMonth(monthDate.getMonth() - 1);

          var events = _.filter(allEvents, function (s) {
            return s.date >= monthDate && (($scope.archived && s.archived) || (!
              $scope.archived && !s.archived));
          });

          if ($scope.archived || $scope.newest) {
            events = _.sortBy(events, 'date');
            events = events.reverse();
          } else if ($scope.hotest) {
            events = _.sortBy(events, function (item) {
              return -(item.goingUsers.length * 3 + item.tentativeUsers.length -
                item.notNowUsers.length * 2);
            });
          }

          $scope.events = events;

          deferred.resolve();
        });

        return deferred.promise;
      };

      $scope.showAllTime = function () {
        var deferred = $q.defer();

        $scope.allTime = true;
        $scope.currentWeek = false;
        $scope.currentMonth = false;

        loadEvents().then(function () {
          var events = _.filter(allEvents, function (s) {
            return (($scope.archived && s.archived) || (!$scope.archived && !s.archived));
          });

          if ($scope.archived || $scope.newest) {
            events = _.sortBy(events, 'date');
            events = events.reverse();
          } else if ($scope.hotest) {
            events = _.sortBy(events, function (item) {
              return -(item.goingUsers.length * 3 + item.tentativeUsers.length -
                item.notNowUsers.length * 2);
            });
          }

          $scope.events = events;

          deferred.resolve();
        });

        return deferred.promise;
      };

      function filterItems() {
        var deferred = $q.defer();

        if ($scope.currentWeek) {
          $scope.showEventsForCurrentWeek().then(function () {
            deferred.resolve();
          });
        } else if ($scope.currentMonth) {
          $scope.showEventsForCurrentMonth().then(function () {
            deferred.resolve();
          });
        } else if ($scope.allTime) {
          $scope.showAllTime().then(function () {
            deferred.resolve();
          });
        }
        return deferred.promise;
      }

      $scope.orderNewest = function () {
        $scope.hotest = false;
        $scope.newest = true;
        $scope.archived = false;

        filterItems().then(function () {
          var events = _.sortBy($scope.events, 'date');
          $scope.events = events.reverse();
        });
      };

      $scope.orderHotest = function () {
        $scope.hotest = true;
        $scope.newest = false;
        $scope.archived = false;

        filterItems().then(function () {
          $scope.events = _.sortBy($scope.events, function (item) {
            return -(item.goingUsers.length * 3 + item.tentativeUsers.length - item
              .notNowUsers.length * 2);
          });
        });
      };

      $scope.showArchived = function () {
        $scope.hotest = false;
        $scope.newest = false;
        $scope.archived = true;

        filterItems();
      };

      $scope.archiveEvent = function (id) {
        var event = _.find(allEvents, function (s) {
          return s.id === id;
        });
        event.archived = true;
        filterItems();

        eventService.archiveEvent(id).then(function () {});
      };

      $scope.orderNewest();
    }
  ]);
}());
