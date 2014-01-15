'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngRoute',
    'myApp.directives'
]).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html'});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html'});
    $routeProvider.when('/view3', {templateUrl: 'partials/partial3.html'});
    $routeProvider.otherwise({redirectTo: '/view1'});
}])
.controller('mainController', function($scope) {

    }
);
