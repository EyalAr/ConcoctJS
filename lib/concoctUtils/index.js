module.exports = {

    // takes a glob 'pattern' string and extends the 'srcs' array
    // with a list of files matching pattern.
    // call 'done' callback when finished with an optional
    // 'err' argument.
    _extendSources: function(pattern, srcs, done) {

        var resolve = require('path').resolve,
            glob = require('glob'),
            async = require('async');

        glob(pattern, function(err, list) {

            if (err) {
                return done('Pattern matching error. ' + err);
            }

            list.forEach(function(file) {

                srcs.push(resolve(process.cwd(), file));

            });

            done();

        });

    }

};