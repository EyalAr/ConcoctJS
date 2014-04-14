var should = require('should'),
    Concoct = require('../../');

describe('ConcoctJS Operations Test', function() {

    var resolve = require('path').resolve,
        t1Path = resolve(process.cwd(), './test/templates/1.tpl'),
        t2Path = resolve(process.cwd(), './test/templates/2.tpl'),
        t1con = '{{foo}} {{bar}}',
        t2con = '{{foo}} {{foo}} {{bar}} {{bar}}',
        c1Path = resolve(process.cwd(), './test/contexts/1.json'),
        c2Path = resolve(process.cwd(), './test/contexts/2.json'),
        c1con = {
            "foo": "FOO",
            "bar": "BAR"
        },
        c2con = {
            "foo": "BAR",
            "bar": "FOO"
        },
        links = [{
            contextPath: resolve(process.cwd(), './test/contexts/1.json'),
            templatePath: resolve(process.cwd(), './test/templates/1.tpl')
        }, {
            contextPath: resolve(process.cwd(), './test/contexts/1.json'),
            templatePath: resolve(process.cwd(), './test/templates/2.tpl')
        }, {
            contextPath: resolve(process.cwd(), './test/contexts/2.json'),
            templatePath: resolve(process.cwd(), './test/templates/1.tpl')
        }, {
            contextPath: resolve(process.cwd(), './test/contexts/2.json'),
            templatePath: resolve(process.cwd(), './test/templates/2.tpl')
        }];

    var options, concoct, piJustCall, piReceiveTemplates, piReceiveLinks;

    before(function() {

        piJustCall = {
            name: 'Just Call',
            handler: require('../dummyPlugins/justCall'),
            params: {
                called: false
            }
        };

        piReceiveTemplates = {
            name: 'Receive Templates',
            handler: require('../dummyPlugins/receiveTemplates'),
            params: {
                called: false,
                templates: null
            }
        };

        piReceiveContexts = {
            name: 'Receive Contexts',
            handler: require('../dummyPlugins/receiveContexts'),
            params: {
                called: false,
                contexts: null
            }
        };

        piReceiveLinks = {
            name: 'Receive Links',
            handler: require('../dummyPlugins/receiveLinks'),
            params: {
                called: false,
                links: null
            }
        };

    });

    before(function() {

        options = {
            plugins: [piJustCall, piReceiveTemplates, piReceiveContexts, piReceiveLinks],
            templates: './test/templates/*.tpl',
            contexts: './test/contexts/*.json',
            linkingRules: {
                './test/contexts/*.json': './test/templates/*.tpl'
            }
        };

    });

    before(function(done) {

        concoct = new Concoct(options);
        concoct.concoct(done);

    });

    it('should call all plugged plugins', function() {

        piJustCall.params.called.should.be.true;
        piReceiveTemplates.params.called.should.be.true;
        piReceiveContexts.params.called.should.be.true;
        piReceiveLinks.params.called.should.be.true;

    });

    it('should initialize the templates object', function() {

        piReceiveTemplates.params.templates.should.be.ok;
        piReceiveTemplates.params.templates.should.be.type('object');

    });

    it('should have exactly two template paths', function() {

        Object.keys(piReceiveTemplates.params.templates).should.have.length(2);

    });

    it('should have the correct template paths', function() {

        piReceiveTemplates.params.templates.should.have.property(t1Path);
        piReceiveTemplates.params.templates.should.have.property(t2Path);

    });

    it('should have the correct templates content', function() {

        piReceiveTemplates.params.templates[t1Path].should.be.exactly(t1con);
        piReceiveTemplates.params.templates[t2Path].should.be.exactly(t2con);

    });

    it('should initialize the contexts object', function() {

        piReceiveContexts.params.contexts.should.be.ok;
        piReceiveContexts.params.contexts.should.be.type('object');

    });

    it('should have exactly two contexts paths', function() {

        Object.keys(piReceiveContexts.params.contexts).should.have.length(2);

    });

    it('should have the correct contexts paths', function() {

        piReceiveContexts.params.contexts.should.have.property(c1Path);
        piReceiveContexts.params.contexts.should.have.property(c2Path);

    });

    it('should have the correct contexts content', function() {

        piReceiveContexts.params.contexts[c1Path].should.be.eql(c1con);
        piReceiveContexts.params.contexts[c2Path].should.be.eql(c2con);

    });

    it('should initialize the links array', function() {

        piReceiveLinks.params.links.should.be.ok;
        piReceiveLinks.params.links.should.be.an.Array;

    });

    it('should have exactly four links', function() {

        Object.keys(piReceiveLinks.params.links).should.have.length(4);

    });

    it('should have the correct links', function() {

        piReceiveLinks.params.links.should.containEql(links[0]);
        piReceiveLinks.params.links.should.containEql(links[1]);
        piReceiveLinks.params.links.should.containEql(links[2]);
        piReceiveLinks.params.links.should.containEql(links[3]);

    });

});