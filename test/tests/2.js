var assert = require('assert'),
    Concoct = require('../../');

describe('ConcoctJS Operations Test', function() {

    var resolve = require('path').resolve,
        t1Path = resolve(process.cwd(), './test/templates/1.tpl'),
        t2Path = resolve(process.cwd(), './test/templates/2.tpl'),
        t1con = '{{foo}} {{bar}}',
        t2con = '{{foo}} {{foo}} {{bar}} {{bar}}';

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

        piReceiveContexts = {
            name: 'Receive Contexts',
            handler: require('../dummyPlugins/receiveContexts'),
            params: {
                called: false,
                contexts: null
            }
        }

    });

    before(function() {

        options = {
            plugins: [piJustCall, piReceiveTemplates, piReceiveContexts],
            templates: './test/templates/*.tpl',
            contexts: './test/contexts/*.json'
        };

    });

    before(function(done) {

        concoct = new Concoct(options);
        concoct.concoct(done);

    });

    it('should call all plugged plugins', function() {

        assert(piJustCall.params.called === true);
        assert(piReceiveTemplates.params.called === true);
        assert(piReceiveContexts.params.called === true);

    });

    it('should initialize the templates object', function() {

        assert(piReceiveTemplates.params.templates !== null);
        assert(typeof piReceiveTemplates.params.templates === 'object');

    });

    it('should have exactly two template paths', function() {

        assert(Object.keys(piReceiveTemplates.params.templates).length === 2);

    });

    it('should have the correct template paths', function() {

        assert(typeof piReceiveTemplates.params.templates[t1Path] !== 'undefined');
        assert(typeof piReceiveTemplates.params.templates[t2Path] !== 'undefined');

    });

    it('should have the correct templates content', function() {

        assert(piReceiveTemplates.params.templates[t1Path] === t1con);
        assert(piReceiveTemplates.params.templates[t2Path] === t2con);

    });

});