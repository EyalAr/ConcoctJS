var assert = require('assert'),
    Concoct = require('../../');

describe('ConcoctJS Options Test', function() {

    describe('without a \'templates\' field', function() {

        var concoct = new Concoct({
            plugins: [],
            contexts: []
        });

        it('should give a callback error', function(done) {

            concoct.concoct(function(err) {
                assert( !! err);
                done();
            });

        })

    });

    describe('with \'templates\' field not an array or string', function() {

        var concoct = new Concoct({
            plugins: [],
            templates: 5,
            contexts: []
        });

        it('should give a callback error', function(done) {

            concoct.concoct(function(err) {
                assert( !! err);
                done();
            });

        })

    });

    describe('with 0 templates', function() {

        var concoct = new Concoct({
            plugins: [],
            templates: [],
            contexts: []
        });

        it('should not give a callback error', function(done) {

            concoct.concoct(function(err) {
                assert(!err);
                done();
            });

        })

    });

    describe('with a valid templates path as a string', function() {

        var concoct = new Concoct({
            plugins: [],
            templates: './test/templates/*.tpl',
            contexts: []
        });

        it('should not give a callback error', function(done) {

            concoct.concoct(function(err) {
                assert(!err);
                done();
            });

        })

    });

    describe('with a valid templates path as an array', function() {

        var concoct = new Concoct({
            plugins: [],
            templates: ['./test/templates/*.tpl'],
            contexts: []
        });

        it('should not give a callback error', function(done) {

            concoct.concoct(function(err) {
                assert(!err);
                done();
            });

        })

    });

});