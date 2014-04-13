module.exports = {

	// takes a 'src' string and extends the 'srcs' array
	// with a list of files in 'src'.
	// if 'src' is a file path, just push it to 'srcs'.
	// if 'src' is a directory path, push all the files
	// in it to 'srcs'.
	// call 'done' callback when finished with an optional
	// 'err' argument.
	_extendSources: function(src, srcs, done) {

		var async = require('async');

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

};