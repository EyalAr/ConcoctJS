module.exports = function(params, templates, data, done) {
	params.called = true;
	params.templates = templates;
	done();
};