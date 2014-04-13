module.exports = {

    initBuffers: function(options, templates, contexts, buffers, log, done) {

    },

    readContexts: function(options, templates, contexts, buffers, log, done) {

        var fs = require('fs'),
            resolve = require('path').resolve,
            async = require('async'),
            cUtils = require('../concoctUtils'),
            _srcs = [];

        if (!options.contexts) {
            return done('Missing \'contexts\' field.');
        }

        function _buildSources(src, srcs, done) {

            if (typeof src === 'string') {

                cUtils._extendSources(src, srcs, done);

            } else if (src instanceof Array) {

                async.each(src, function(src, done) {

                    cUtils._extendSources(src, srcs, done);

                }, done);

            } else {

                done('\'contexts\' field must be string or array. Got ' + typeof src);

            }

        };

        function _readContextFiles(srcs, dict, done) {

            async.each(srcs, function(src, done) {

                fs.readFile(src, function(err, data) {

                    log.debug('Reading context file %s', src);

                    if (err) {
                        return done('File system error. ' + err);
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

        async.series([

            function(next) {

                log.info('Reading context files...');

                _buildSources(options.contexts, _srcs, function(err) {

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

    readTemplates: function(options, templates, contexts, buffers, log, done) {

        var fs = require('fs'),
            resolve = require('path').resolve,
            async = require('async'),
            cUtils = require('../concoctUtils'),
            _srcs = [];

        if (!options.templates) {
            return done('Missing \'templates\' field.');
        }

        function _buildSources(src, srcs, done) {

            if (typeof src === 'string') {

                cUtils._extendSources(src, srcs, done);

            } else if (src instanceof Array) {

                async.each(src, function(src, done) {

                    cUtils._extendSources(src, srcs, done);

                }, done);

            } else {

                done('\'templates\' field must be string or array. Got ' + typeof src);

            }

        };

        function _readTemplateFiles(srcs, dict, done) {

            async.each(srcs, function(src, done) {

                fs.readFile(src, function(err, data) {

                    log.debug('Reading template %s', src);

                    if (err) {
                        return done('File system error. ' + err);
                    }

                    dict[src] = data.toString();
                    done();

                });

            }, done);

        };

        async.series([

            function(next) {

                log.info('Reading templates...');

                _buildSources(options.templates, _srcs, function(err) {

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