var should = require('should'),
    Concoct = require('../../');

describe('ConcoctJS Contexts Handling Test', function() {

    var options, concoct, piReceiveContexts, piReceiveBuffers;

    before(function() {

        piReceiveContexts = {
            name: 'Receive Contexts',
            handler: require('../dummyPlugins/receiveContexts'),
            params: {
                called: false,
                contexts: undefined
            }
        };

        piReceiveBuffers = {
            name: 'Receive Buffers',
            handler: require('../dummyPlugins/receiveBuffers'),
            params: {
                called: false,
                buffers: undefined
            }
        };

    });

    before(function() {

        options = {
            plugins: [piReceiveContexts, piReceiveBuffers],
            templates: './test/templates/*.tpl',
            contexts: './test/contexts/invalid*.json',
            linkingRules: {
                './test/contexts/*.json': './test/templates/*.tpl'
            },
            dest: './test/content'
        };

    });

    before(function(done) {

        concoct = new Concoct(options);
        concoct.concoct(done);

    });

    it('should have a contexts object', function() {

        piReceiveContexts.params.contexts.should.be.type('object');

    });

    it('should not have any contexts', function() {

        piReceiveContexts.params.contexts.should.be.empty;

    });

    it('should have a buffers object', function() {

        piReceiveBuffers.params.buffers.should.be.type('object');

    });

    it('should not have any buffers', function() {

        piReceiveBuffers.params.buffers.should.be.empty;

    });

});