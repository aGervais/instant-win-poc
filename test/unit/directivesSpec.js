'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {

    beforeEach(module('myApp.directives'));

    describe('timerSettingsController', function() {

        it('pattern.numeric should test that only numeric values are valid', inject(function($controller) {
            var scope = {},
                ctrl = $controller('timerSettingsController', { $scope: scope });

            // Test for non-numeric
            expect(scope.pattern.numeric.test('9s99')).toBe(false);
            expect(scope.pattern.numeric.test('abc')).toBe(false);
            expect(scope.pattern.numeric.test('1e')).toBe(false);
            // Test for numeric
            expect(scope.pattern.numeric.test(1)).toBe(true);
            expect(scope.pattern.numeric.test('1')).toBe(true);
            expect(scope.pattern.numeric.test(929999)).toBe(true);
        }));

        it('pattern.date should test that only dates formatted as dd/mm/yyyy are valid', inject(function($controller) {
            var scope = {},
                ctrl = $controller('timerSettingsController', { $scope: scope });

            // Test for non-valid
            expect(scope.pattern.date.test('2001-09-01')).toBe(false);
            expect(scope.pattern.date.test('12-25-2014')).toBe(false);
            expect(scope.pattern.date.test('32a/12/2013')).toBe(false);
            // Test for valid
            expect(scope.pattern.date.test('01/13/2012')).toBe(true);
            expect(scope.pattern.date.test('12/31/2015')).toBe(true);
            expect(scope.pattern.date.test('06/14/1976')).toBe(true);
        }));

        it('pattern.time should test that only times formatted as hh:mm:ss are valid', inject(function($controller) {
            var scope = {},
                ctrl = $controller('timerSettingsController', { $scope: scope });

            // Test for non-valid
            expect(scope.pattern.time.test('14 12 44')).toBe(false);
            expect(scope.pattern.time.test('06:04:45:666')).toBe(false);
            expect(scope.pattern.time.test('9:35am')).toBe(false);
            // Test for valid
            expect(scope.pattern.time.test('08:59:01')).toBe(true);
            expect(scope.pattern.time.test('23:59:59')).toBe(true);
            expect(scope.pattern.time.test('13:09:59')).toBe(true);
        }));


        // TODO: The following test doesn't work because the validateTimerForm() is not on the $scope; consider moving it to the e2e test?
        /*
        it('validateTimerForm() should test a form / timerSettings object is valid', inject(function($controller) {
            var scope = {},
                ctrl = $controller('timerSettingsController', { $scope: scope });

            // Test for non-valid; this form has an invalid event end date
            scope.timerSettings = {
                numberOfPrizes: '5',
                eventStartDate: '01/16/2014',
                eventStartTime: '09:33:45',
                eventEndDate: '01/16/2014',
                eventEndTime: '00:00:01',
                isWinner: false,
                timerCountdown: 0,
                timerInterval: 1000
            };
            // ctrl.validateTimerForm();
            expect(scope.validateTimerForm()).toBe(false);

        }));
        */

    });
});
