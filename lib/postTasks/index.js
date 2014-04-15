module.exports = {

    nameAnonymousBuffers: function(options, templates, contexts, links, buffers, log, done) {

        var cUtils = require('../concoctUtils'),
            join = cUtils.join,
            rel = cUtils.rel;

        log.info('Naming anonymous buffers...');

        var bufferRoot;

        if (options.dest) {

            bufferRoot = rel(options.dest);

        } else {

            bufferRoot = './';
            log.warn('No \'dest\' option specified. Using current working directory.');

        }

        buffers.forEach(function(buffer) {

            if (!buffer.path || typeof buffer.path !== 'string') {

                buffer.path = join(bufferRoot, cUtils._generateBufferName(buffer));

                log.debug('Named buffer \'%s\'.', buffer.path);

            }

        });

        done();

    },

    writeBuffers: function(options, templates, contexts, links, buffers, log, done) {

        var fs = require('fs'),
            async = require('async'),
            dir = require('../concoctUtils').dir;

        async.each(buffers, function(buffer, done) {

            if (buffer.path && typeof buffer.path === 'string') {

                log.info('Writing %s', buffer.path);

                fs.writeFile(buffer.path, buffer.content, function(err) {

                    if (err) {
                        if (err.code === "ENOENT") {
                            log.error('Failed to write \'%s\'. Directory \'%s\' does not exist.', buffer.path, dir(buffer.path));
                        } else {
                            log.error('Failed to write \'%s\'. %s', buffer.path, err);
                        }
                    }

                    done();

                });

            } else {

                log.warn('Invalid path \'%s\'. Skipping.', buffer.path);
                done();

            }

        }, done);

    }

}