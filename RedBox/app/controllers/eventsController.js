(function () {
    var myApp = angular.module('myApp');

    myApp.controller('eventsController', ['$scope', '$location', 'eventService', function ($scope, $location, eventService) {

        var controller = this;
        controller.loadEvents = function () {
            eventService.getEvents().then(function (events) {
                $scope.events = _.filter(events, function (item) {
                    return item.archived != true;
                });
                $scope.allEvents = events;

                $scope.hotest = false;
                $scope.newest = true;
                $scope.archived = false;

                $scope.showEventsForCurrentMonth();
            });
        };

        var init = function (controller) {
            $scope.allTime = false;
            $scope.currentWeek = true;
            $scope.hotest = false;
            $scope.newest = true;
            $scope.archived = false;
            $scope.currentMonth = false;
            controller.loadEvents();
        };
        init(controller);

        $scope.submitEvent = function (event) {
            eventService.submitEvent(event).then(function () {
                controller.loadEvents();
            });
        };

        $scope.respondToEvent = function (eventId, responseToEvent) {
            eventService.respondToEvent(eventId, responseToEvent).then(function () {
                controller.loadEvents();
            });
        };

        $scope.showEventsForCurrentWeek = function () {
            $scope.allTime = false;
            $scope.currentWeek = true;
            $scope.currentMonth = false;
            eventService.getEventsForCurrentWeek().then(function (events) {
                $scope.events = events;
                if ($scope.newest) {
                    $scope.orderNewest($scope.events);
                    return;
                }
                if ($scope.hotest) {
                    $scope.orderHotest($scope.events);
                    return;
                }
                $scope.showArchived($scope.events);
            });
        };

        $scope.showEventsForCurrentMonth = function () {
            $scope.allTime = false;
            $scope.currentWeek = false;
            $scope.currentMonth = true;
            eventService.getEventsForCurrentMonth().then(function (events) {
                $scope.events = events;
                if ($scope.newest) {
                    $scope.orderNewest($scope.events);
                    return;
                }
                if ($scope.hotest) {
                    $scope.orderHotest($scope.events);
                    return;
                }
                $scope.showArchived($scope.events);
            });
        };

        $scope.orderNewest = function () {
            if ($scope.archived)
                $scope.events = $scope.allEvents;
            $scope.hotest = false;
            $scope.newest = true;
            $scope.archived = false;
            $scope.events = _.sortBy($scope.events, function (e) {
                return -new Date(e.date);
            });
        };

        $scope.orderHotest = function () {
            if ($scope.archived)
                $scope.events = $scope.allEvents;
            $scope.hotest = true;
            $scope.newest = false;
            $scope.archived = false;
            $scope.events = _.sortBy($scope.events, function (item) {
                return item.goingUsers.length * 3 + item.tentativeUsers.length - item.notNowUsers.length * 2;
            });
            $scope.events = $scope.events.reverse();
        };

        $scope.showArchived = function () {
            //$scope.events = $scope.allEvents;

            $scope.hotest = false;
            $scope.newest = false;
            $scope.archived = true;

            $scope.events = _.filter($scope.events, function (item) {
                return item.archived === true;
            });

        };

        $scope.showAllTime = function () {
            $scope.allTime = true;
            $scope.currentWeek = false;
            $scope.currentMonth = false;

            //$scope.events = $scope.allEvents;

            if ($scope.archived) {
                $scope.showArchived();
            }

            if ($scope.newest) {
                $scope.orderNewest($scope.events);
                return;
            }
            if ($scope.hotest) {
                $scope.orderHotest($scope.events);
            }
        }

    }]);
}());