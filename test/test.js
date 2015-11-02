/**
 * Created by dave on 26/10/15.
 * https://mochajs.org/
 * https://github.com/shouldjs/should.js
 */

var assert = require('assert');
var should = require('should');
//describe.skip() = commenter un test
describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            [1,2,3].indexOf(5).should.equal(-1);
            [1,2,3].indexOf(0).should.equal(-1);
        });
    });
});

describe('User', function() {
    describe('#save()', function() {
        it('should save without error', function(done) {
            /*var user = new User('Luna');
            user.save(done);*/
        });
    });
});

describe('hooks', function() {

    before(function() {
        // runs before all tests in this block
    });

    after(function() {
        // runs after all tests in this block
    });

    beforeEach(function() {
        // runs before each test in this block
    });

    afterEach(function() {
        // runs after each test in this block
    });

    // test cases
});

/*
 beforeEach(function() {
 // beforeEach hook
 });

 beforeEach(function namedFun() {
 // beforeEach:namedFun
 });

 beforeEach('some description', function() {
 // beforeEach:some description
 });
 */
