module.exports = {

    nameAnonymousBuffers: function(options, templates, contexts, links, buffers, log, done) {

        var resolve = require('path').resolve,
            cUtils = require('../concoctUtils');

        log.info('Naming anonymous buffers...');

        var bufferRoot = process.cwd();

        if (options.dest) {

            bufferRoot = resolve(bufferRoot, options.dest);

        } else {

            log.warn('No \'dest\' option specified. Using current working directory.');

        }

        buffers.forEach(function(buffer) {

            if (!buffer.path || typeof buffer.path !== 'string') {

                buffer.path = resolve(bufferRoot, cUtils._generateBufferName(buffer));

                log.debug('Named buffer \'%s\'.', buffer.path);

            }

        });

        done();

    }

}