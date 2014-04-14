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
            contextPath: c1Path,
            templatePath: t1Path
        }, {
            contextPath: c1Path,
            templatePath: t2Path
        }, {
            contextPath: c2Path,
            templatePath: t1Path
        }, {
            contextPath: c2Path,
            templatePath: t2Path
        }],
        buffers = [{
            link: links[0],
            content: t1con,
            path: resolve(process.cwd(), 'content/1 (1)')
        }, {
            link: links[1],
            content: t2con,
            path: resolve(process.cwd(), 'content/2 (1)')
        }, {
            link: links[2],
            content: t1con,
            path: resolve(process.cwd(), 'content/1 (2)')
        }, {
            link: links[3],
            content: t2con,
            path: resolve(process.cwd(), 'content/2 (2)')
        }];

    var options, concoct, piJustCall, piReceiveTemplates, piReceiveLinks, piReceiveBuffers;

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

        piReceiveBuffers = {
            name: 'Receive Buffers',
            handler: require('../dummyPlugins/receiveBuffers'),
            params: {
                called: false,
                buffers: null
            }
        };

    });

    before(function() {

        options = {
            plugins: [piJustCall, piReceiveTemplates, piReceiveContexts, piReceiveLinks, piReceiveBuffers],
            templates: './test/templates/*.tpl',
            contexts: './test/contexts/*.json',
            linkingRules: {
                './test/contexts/*.json': './test/templates/*.tpl'
            },
            dest: 'content'
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

        piReceiveLinks.params.links.should.have.length(4);

    });

    it('should have the correct links', function() {

        piReceiveLinks.params.links.should.containEql(links[0]);
        piReceiveLinks.params.links.should.containEql(links[1]);
        piReceiveLinks.params.links.should.containEql(links[2]);
        piReceiveLinks.params.links.should.containEql(links[3]);

    });

    it('should initialize the buffers array', function() {

        piReceiveBuffers.params.buffers.should.be.ok;
        piReceiveBuffers.params.buffers.should.be.an.Array;

    });

    it('should have exactly four buffers', function() {

        piReceiveBuffers.params.buffers.should.have.length(4);

    });

    it('should have the correct buffers', function() {

        piReceiveBuffers.params.buffers.should.containEql(buffers[0]);
        piReceiveBuffers.params.buffers.should.containEql(buffers[1]);
        piReceiveBuffers.params.buffers.should.containEql(buffers[2]);
        piReceiveBuffers.params.buffers.should.containEql(buffers[3]);

    });

});