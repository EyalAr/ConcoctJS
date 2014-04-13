module.exports = function(params, templates, data, done) {
    params.called = true;
    done();
};