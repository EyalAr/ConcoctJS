module.exports = {

    initBuffers: function(options, templates, contexts, links, buffers, log, done) {

        links.forEach(function(link) {
            buffers.push({
                link: link,
                content: templates[link.templatePath]
            });
        });

        done();

    },

    initLinks: function(options, templates, contexts, links, buffers, log, done) {

        var async = require('async'),
            format = require('../concoctUtils').format,
            rel = require('../concoctUtils').rel,
            glob = require('glob');

        if (options.linkingRules) {

            if (options.linkingRules.constructor !== Object) {
                return done('\'linkingRules\' must be an object.');
            }

            log.info('Linking contexts to templates...');

            var pairs = [];

            for (var contextRule in options.linkingRules) {
                if (options.linkingRules.hasOwnProperty(contextRule)) {

                    var templateRule = options.linkingRules[contextRule];

                    if (typeof contextRule !== 'string' || typeof templateRule !== 'string') {
                        return done(format('Encountered invalid linking rule (%s: %s).', contextRule, templateRule));
                    }

                    pairs.push({
                        contextRule: contextRule,
                        templateRule: templateRule
                    });

                }
            }

            log.info('Found %d linking rules.', pairs.length);

            async.each(pairs, function(pair, done) {

                async.parallel([

                    function(done) {
                        glob(pair.contextRule, done);
                    },

                    function(done) {
                        glob(pair.templateRule, done);
                    }

                ], function(err, lists) {

                    if (err) {
                        return done('Pattern matching error. ' + err);
                    }

                    var contextRuleMatches = lists[0],
                        templateRuleMatches = lists[1];

                    contextRuleMatches.forEach(function(contextPath) {
                        templateRuleMatches.forEach(function(templatePath) {

                            var link = {
                                contextPath: rel(contextPath),
                                templatePath: rel(templatePath)
                            };

                            links.push(link);

                            log.debug('New link: %s', JSON.stringify(link));

                        });
                    });

                    done();

                });

            }, function(err) {

                log.info('Created %d links.', links.length);
                done(err);

            });

        } else {
            log.warn('No linking rules found. Maybe it\'s up to plugins...');
            done();
        }

    },

    readContexts: function(options, templates, contexts, links, buffers, log, done) {

        var async = require('async'),
            cUtils = require('../concoctUtils'),
            _srcs = [];

        if (!options.contexts) {
            return done('Missing \'contexts\' field.');
        }

        function _readContextFiles(srcs, dict, done) {

            var fs = require('fs'),
                async = require('async');

            async.each(srcs, function(src, done) {

                fs.readFile(src, function(err, data) {

                    log.debug('Reading context file %s', src);

                    if (err) {
                        return done(format('File system error. %s', err));
                    }

                    try {

                        dict[src] = JSON.parse(data);

                    } catch (e) {
                        log.warn('Invalid format in context file %s.', src);
                    }

                    done();

                });

            }, done);

        };

        log.info('Reading context files...');

        async.series([

            function(next) {

                cUtils._buildSources(options.contexts, _srcs, function(err) {

                    if (!err) {
                        if (_srcs.length) {
                            log.info('Found %d context files.', _srcs.length);
                        } else {
                            log.warn('No context files found.');
                        }
                    }

                    next(err);

                });

            },

            function(next) {

                _readContextFiles(_srcs, contexts, next);

            }

        ], done);

    },

    readTemplates: function(options, templates, contexts, links, buffers, log, done) {

        var async = require('async'),
            cUtils = require('../concoctUtils'),
            _srcs = [];

        if (!options.templates) {
            return done('Missing \'templates\' field.');
        }

        function _readTemplateFiles(srcs, dict, done) {

            var fs = require('fs'),
                async = require('async');

            async.each(srcs, function(src, done) {

                fs.readFile(src, function(err, data) {

                    log.debug('Reading template %s', src);

                    if (err) {
                        return done(format('File system error. %s', err));
                    }

                    dict[src] = data.toString();
                    done();

                });

            }, done);

        };

        log.info('Reading templates...');

        async.series([

            function(next) {

                cUtils._buildSources(options.templates, _srcs, function(err) {

                    if (!err) {
                        if (_srcs.length) {
                            log.info('Found %d templates.', _srcs.length);
                        } else {
                            log.warn('No templates found.');
                        }
                    }

                    next(err);

                });

            },

            function(next) {

                _readTemplateFiles(_srcs, templates, next);

            }

        ], done);

    }

}