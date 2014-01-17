'use strict';

/* Directives */

angular.module('myApp.directives', [])
    .directive('timerForm', function() {
        return {
            templateUrl: './partials/timer-form.html'
        }
    })
    .controller('timerSettingsController', function($scope,$log){
        var defaultEventDateTime = new Date(); // let's default to the current date/time

        // Instantiate our model
        var timerSettings = $scope.timerSettings = {
            numberOfPrizes: "",
            eventStartDate: formatDate(defaultEventDateTime),
            eventStartTime: formatTime(defaultEventDateTime),
            eventEndDate: formatDate(defaultEventDateTime),
            eventEndTime: "",
            isWinner: false,
            timerCountdown: 0,
            timerInterval: 1000
        };

        // Instantiate the internal start/end date/times used by our timer
        var startDateTime = "";
        var endDateTime = "";

        $scope.toggleHideAdmin = false;
        $scope.toggleShowHideLink = "hide";

        // Instantiate our validation patterns
        $scope.pattern = {
            numeric: /^\d+$/,
            date: /^\d{2}\/\d{2}\/\d{4}$/,
            time: /^(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/
        };

        // Instantiate the scope variables
        $scope.surveyCompletionMsg = "";
        $scope.millis = 0;
        $scope.timeoutId = null;
        $scope.seconds = 0;
        $scope.minutes = 0;
        $scope.hours = 0;
        $scope.days = 0;
        $scope.invalidFormErrorMsg = "";


        $scope.saveTimerForm = function() {
            // $log.info("saveTimerForm() fired!");

            // Validate the form fields
            var formIsValid = validateTimerForm();

            if (formIsValid) {
                $scope.invalidFormErrorMsg = "";
                // Calculate what the timer's countdown amount will be and then start the timer's countdown
                $scope.calculateCountdown();

                // We now have everything setup; start the timer's countdown!
                $scope.startTimer();
            }
        };

        $scope.calculateCountdown = function() {
            // $log.info("calculateCountdown() fired!");
            var timeDifferential = 0;
            var now = new Date();

            // Convert the event dates to proper date/times
            startDateTime = createDateTime(timerSettings.eventStartDate, timerSettings.eventStartTime);
            endDateTime = createDateTime(timerSettings.eventEndDate, timerSettings.eventEndTime);

            // Handle an event start date/time that's in the past
            if (now > startDateTime) {
                // Event's start date/time is in the past; use the current date/time instead
                startDateTime = now;
                // refresh the form value
                timerSettings.eventStartDate = formatDate(now);
                timerSettings.eventStartTime = formatTime(now);
            }

            // Calculate the time differential between the start and end times
            timeDifferential = (endDateTime-startDateTime) / 1000;

            // We now know how many seconds long the event will be; now figure out how often we award a prize
            if (parseInt(timeDifferential / timerSettings.numberOfPrizes) < 0) {
                timerSettings.timerCountdown = 0;
            }
            else {
                timerSettings.timerCountdown = parseInt(timeDifferential / timerSettings.numberOfPrizes);
            }

            // Setup the countdown's initial amount of milliseconds
            $scope.millis = timerSettings.timerCountdown * 1000;

            // Setup the countdown's other initial time parts
            calculateTimeUnits();
        }

        $scope.startTimer = function() {
            // $log.info("startTimer() fired!");
            timerSettings.isWinner = false;
            resetTimeout();
            tick();
        };

        $scope.stop = function () {
            // $log.info("stop() fired!");
            $scope.stoppedTime = new Date();
            resetTimeout();
            $scope.timeoutId = null;
        };

        $scope.completeSurvey = function() {
            if (timerSettings.isWinner) {
                $scope.surveyCompletionMsg = "Congratulations; you're a winner!";
                timerSettings.numberOfPrizes --;

                // Only restart the timer if we have prizes left
                if (timerSettings.numberOfPrizes > 0) {
                    // Calculate what the timer's countdown amount will be and then start the timer's countdown
                    $scope.calculateCountdown();

                    // We now have everything setup; start the timer's countdown!
                    $scope.startTimer();
                }
                else {
                    timerSettings.isWinner = false;
                }
            }
            else {
                $scope.surveyCompletionMsg = "Thanks for completing the survey; better luck next time!";
            }
        };

        $scope.restartSurvey = function() {
            $scope.surveyCompletionMsg = "";
        }

        $scope.toggleShowHideAdmin = function() {
            if ($scope.toggleHideAdmin) {
                $scope.toggleShowHideLink = "hide";
                $scope.toggleHideAdmin = false;
            }
            else {
                $scope.toggleShowHideLink = "show";
                $scope.toggleHideAdmin = true;
            }
        }

        function validateTimerForm() {
            var tempStartDateTime = "";
            var tempEndDateTime = "";

            // Number of prizes must be numeric
            if (!$scope.pattern.numeric.test(timerSettings.numberOfPrizes)) {
                $scope.invalidFormErrorMsg = 'Please enter a valid Number of Prizes!';
                return false;
            }

            // Event Ends date must hold a valid future date w/ a format of dd/mm/yyyy
            if (!$scope.pattern.date.test(timerSettings.eventEndDate)) {
                $scope.invalidFormErrorMsg = 'Please enter a valid Event Ends date (dd/mm/yyyy)!';
                return false;
            }

            // Event Ends time must hold a valid future time w/ a format of hh:mm:ss timerSettings.eventEndTime
            if (!$scope.pattern.time.test(timerSettings.eventEndTime)) {
                $scope.invalidFormErrorMsg = 'Please enter a valid Event Ends time (hh:mm:ss)!';
                return false;
            }

            // Event Ends date/time must be greater then the Event Starts date/time
            tempStartDateTime = new Date();
            tempEndDateTime = createDateTime(timerSettings.eventEndDate, timerSettings.eventEndTime);

            if (tempStartDateTime > tempEndDateTime) {
                $scope.invalidFormErrorMsg = 'Please enter an Event Ends date/time beyond the Event Starts date/time!';
                // Refresh the event start date/time
                timerSettings.eventStartDate = formatDate(tempStartDateTime);
                timerSettings.eventStartTime = formatTime(tempStartDateTime);
                return false;
            }

            return true;
        }

        function createDateTime(dateString, timeString) {
            // dateString mask = dd/mm/yyyy
            // timeString mask = hh:mm:ss
            try {
                var newDate = new Date(dateString);
                newDate.setHours(parseInt(timeString.substring(0,2)));
                newDate.setMinutes(parseInt(timeString.substring(3,5)));
                newDate.setSeconds(parseInt(timeString.substring(6,9)));

                return newDate;
            }
            catch (err) {
                $log.error(err.message);
                return new Date();
            }
        }

        function formatTime(d) {
            var hours = d.getHours();
            var mins = d.getMinutes();
            var secs = d.getSeconds();

            // Pad all single digits with a 0
            if (parseInt(hours) < 10) {
                hours = "0" + hours;
            }
            if (parseInt(mins) < 10) {
                mins = "0" + mins;
            }
            if (parseInt(secs) < 10) {
                secs = "0" + secs;
            }

            return hours + ":" + mins + ":" + secs;
        }

        function formatDate(d) {
            var currentDate = d.getDate();
            var currentMonth = d.getMonth() + 1; //Months are zero based
            var currentYear = d.getFullYear();

            // Pad all single digits with a 0
            if (parseInt(currentDate) < 10) {
                currentDate = "0" + currentDate;
            }
            if (parseInt(currentMonth) < 10) {
                currentMonth = "0" + currentMonth;
            }

            return currentMonth + "/" + currentDate + "/" + currentYear;
        }

        function calculateTimeUnits() {
            // $log.info("$scope.millis = " + $scope.millis);

            $scope.seconds = Math.floor(($scope.millis / 1000) % 60);
            $scope.minutes = Math.floor((($scope.millis / (60000)) % 60));
            $scope.hours = Math.floor((($scope.millis / (3600000)) % 24));
            $scope.days = Math.floor((($scope.millis / (3600000)) / 24));
        }

        function setWinner() {
            // Ensure we have prizes left!
            if (timerSettings.numberOfPrizes > 0) {
                timerSettings.isWinner = true;
            }
        }

        function resetTimeout() {
            // $log.info("resetTimeout() fired!");

            if ($scope.timeoutId) {
                clearTimeout($scope.timeoutId);
                // $log.info("clearTimeout() fired!");
            }
        }

        function tick() {
            // $log.info("tick() fired!");

            // Get the amount of milliseconds left in our countdown
            $scope.millis = timerSettings.timerCountdown * 1000;

            if ($scope.millis < 0) {
                $scope.stop();
                $scope.millis = 0;
                calculateTimeUnits();
                return;
            }

            calculateTimeUnits();

            if (timerSettings.timerCountdown > 0) {
                timerSettings.timerCountdown --;
            }
            else if (timerSettings.timerCountdown <= 0) {
                timerSettings.timerCountdown = 0;
                $scope.stop();
                setWinner();
                return;
            }

            //We are not using $timeout for a reason. Please read here - https://github.com/siddii/angular-timer/pull/5
            $scope.timeoutId = setTimeout(function () {
                tick();
                $scope.$digest();
            }, timerSettings.timerInterval);
        }

    });