module.exports = function(params, templates, contexts, links, buffers, done) {
    params.called = true;
    params.contexts = contexts;
    done();
};