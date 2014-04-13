module.exports = {

    readTemplates: function(options, templates, contexts, log, done) {

        var fs = require('fs'),
            resolve = require('path').resolve,
            async = require('async'),
            _srcs = [];

        if (!options.templates) {
            return done('Missing \'templates\' field.');
        }

        // takes a 'src' string and extends the 'srcs' array
        // with a list of files in 'src'.
        // if 'src' is a file path, just push it to 'srcs'.
        // if 'src' is a directory path, push all the files
        // in it to 'srcs'.
        // call 'done' callback when finished with an optional
        // 'err' argument.
        function _extendSources(src, srcs, done) {

            fs.stat(src, function(err, stats) {

                if (err) {
                    return done('File system error. ' + err);
                }

                if (!stats.isDirectory()) {

                    srcs.push(src);
                    done();

                } else {

                    fs.readdir(src, function(err, files) {

                        if (err) {
                            return done('File system error. ' + err);
                        }

                        async.each(files, function(file, done) {

                            fs.stat(resolve(src, file), function(err, stats) {

                                if (err) {
                                    return done('File system error. ' + err);
                                }

                                if (stats.isFile()) {
                                    srcs.push(resolve(src, file));
                                }

                                done();

                            });

                        }, done);

                    });

                }

            });

        };

        function _buildSources(src, srcs, done) {

            if (typeof src === 'string') {

                _extendSources(src, srcs, done);

            } else if (src instanceof Array) {

                async.each(src, function(src, done) {

                    _extendSources(src, srcs, done);

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

                    dict[src] = data;
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
                            log.warn('No templates found in %s', options.templates);
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