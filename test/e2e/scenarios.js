'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

    beforeEach(function() {
        // browser().navigateTo('app/index.html');
        browser().navigateTo('../../app/index.html');
    });


    it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
        expect(browser().location().url()).toBe("/view1");
    });

    describe('view1', function() {

        beforeEach(function() {
            browser().navigateTo('#/view1');
        });

        it('should render view1 when user navigates to /view1', function() {
            expect(element('[ng-view] p:first').text()).toMatch(/This is the first part of the survey.../);
        });

    });

    describe('view2', function() {

        beforeEach(function() {
            browser().navigateTo('#/view2');
        });

        it('should render view2 when user navigates to /view2', function() {
            expect(element('[ng-view] p:first').text()).toMatch(/This is the second part of the survey.../);
        });

    });

    describe('view3', function() {

        beforeEach(function() {
            browser().navigateTo('#/view3');
        });

        it('should render view3 when user navigates to /view3', function() {
            expect(element('[ng-view] p:first').text()).toMatch(/This is third and final part of the survey.../);
        });

    });

    describe('toggleShowHideAdmin()', function() {

        it('clicking on hide should hide the admin panel', function() {
            expect(element('[timer-form] a:first').text()).toMatch(/hide/);

            element('[timer-form] a:first').click();

            expect(element('[timer-form] a:first').text()).toMatch(/show/);
        });

    });

});
