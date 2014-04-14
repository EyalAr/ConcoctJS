module.exports = {

    _generateBufferName: function(buffer) {

        var format = require('util').format,
            base = require('path').basename,
            ext = require('path').extname;

        var tName = base(buffer.link.templatePath, ext(buffer.link.templatePath)),
            cName = base(buffer.link.contextPath, ext(buffer.link.contextPath));

        return format('%s (%s)', tName, cName);

    },

    // takes a glob 'pattern' string and extends the 'srcs' array
    // with a list of files matching pattern.
    // call 'done' callback when finished with an optional
    // 'err' argument.
    _extendSources: function(pattern, srcs, done) {

        var resolve = require('path').resolve,
            glob = require('glob');

        glob(pattern, function(err, list) {

            if (err) {
                return done('Pattern matching error. ' + err);
            }

            list.forEach(function(file) {

                srcs.push(resolve(process.cwd(), file));

            });

            done();

        });

    },

    _buildSources: function(src, srcs, done) {

        var that = this,
            async = require('async');

        if (typeof src === 'string') {

            that._extendSources(src, srcs, done);

        } else if (src instanceof Array) {

            async.each(src, function(src, done) {

                that._buildSources(src, srcs, done);

            }, done);

        } else {

            done('A source field must be string or array. Got ' + typeof src);

        }

    }

};