module.exports = function(params, templates, contexts, done) {
    params.called = true;
    params.templates = templates;
    done();
};