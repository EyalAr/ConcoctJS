module.exports = {

	readTemplates: function(options, templates, contexts, log, done) {

		var fs = require('fs'),
			srcs = [];

		if (!options.src){
			log.error('Missing \'src\' field.');
			return done('Missing \'src\' field.');
		}

		if (typeof options.src === 'string'){
			
		}

	}

}