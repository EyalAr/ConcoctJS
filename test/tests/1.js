var assert = require('assert'),
    Concoct = require('../../');

describe('ConcoctJS', function() {

    var options, concoct, piJustCall, piReceiveTemplates;

    before(function() {

        piJustCall = {
            name: 'Just Call',
            handler: require('../dummyPlugins/justCall'),
            params: {
                called: false
            }
        }

        piReceiveTemplates = {
            name: 'Receive Templates',
            handler: require('../dummyPlugins/receiveTemplates'),
            params: {
                called: false,
                templates: null
            }
        }

    });

    before(function() {

        options = {
            plugins: [piJustCall, piReceiveTemplates],
            src: './test/templates'
        };

    });

    before(function(done) {

        concoct = new Concoct(options);
        concoct.concoct(done);

    });

    it('should call all plugged plugins', function() {

        assert(piJustCall.params.called === true);
        assert(piReceiveTemplates.params.called === true);

    });

    it('should read all templates', function() {

        assert(piReceiveTemplates.params.templates !== null); // TODO imporove test

    });

});