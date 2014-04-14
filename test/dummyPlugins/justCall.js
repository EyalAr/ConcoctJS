module.exports = function(params, templates, contexts, links, done) {
    params.called = true;
    done();
};