(function () {
    var myApp = angular.module('myApp');

    myApp.controller('eventsController', ['$scope', '$location', 'eventService', function ($scope, $location, eventService) {

        var controller = this;
        controller.loadEvents = function () {
            eventService.getEvents().then(function (events) {
                $scope.events = events;
            });
        }

        var init = function (controller) {
            controller.loadEvents();
        };
        init(controller);

        $scope.submitEvent = function (event) {
            eventService.submitEvent(event).then(function () {
                controller.loadEvents();
            });
        }

        $scope.respondToEvent = function (eventId, responseToEvent) {
            eventService.respondToEvent(eventId, responseToEvent).then(function () {
                controller.loadEvents();
            });
        }
    }]);
}());