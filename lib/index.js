// This module exports a constructor.
// options (object) - an options object. fields:
// 1. templates (string / array, required):
//    templates directory path / list of paths.
//    can be speficied as glob patterns.
// 2. contexts (string / array, required):
//    contexts directory path / list of paths.
//    can be speficied as glob patterns.
// 3. plugins (array, optional):
//    An array of plugin objects. A plugin object has the (optional) fields:
//      1. name (string): name of plugin.
//      2. handler (function)
//      3. params (object): a params object to be passed to the plugin.
// 4. linkingRules (object, optional):
//    A collection of key:value pairs, which are used to associate contexts
//    with templates. both 'key' and 'value' are path glob pattens.
// 5. dest (string, optional): destination directory to write the buffers.
module.exports = function(options) {

    var async = require('async'),
        preTasks = require('./preTasks'),
        postTasks = require('./postTasks'),
        noop = function() {},
        log = {
            info: require('debug')('concoct:info'),
            debug: require('debug')('concoct:debug'),
            warn: require('debug')('concoct:warn'),
            error: require('debug')('concoct:error')
        };

    // The constructed object has one public method:
    this.concoct = concoct;

    var _plugins = [],
        _preTasks = [
            preTasks.readTemplates,
            preTasks.readContexts,
            preTasks.initLinks,
            preTasks.initBuffers
        ],
        _postTasks = [
            postTasks.nameAnonymousBuffers,
            postTasks.writeBuffers
        ],
        _options = options && typeof options == 'object' ? options : {},
        _templates = {},
        _contexts = {},
        _links = [],
        _buffers = [];

    if (_options.plugins instanceof Array) {

        _options.plugins.forEach(function(plugin) {
            if (plugin && typeof plugin === 'object') {
                _plug(plugin.name, plugin.handler, plugin.params);
            } else {
                log.warn('Ignoring plugin %s.', plugin);
            }
        });

    } else if (!_options.plugins) {
        log.warn('No plugins speficied.');
    } else {
        log.warn('\'plugins\' field is ignored because it\'s not an array.');
    }

    // Plug a new plugin handler which will be run (in order) during
    // the concoction process.
    // Arguments:
    // 1. name (string)- the name of the plugin.
    // 2. handler (function) - the plugin's handler function receives
    //    four arguments - handler(params, templates, data, done)
    //      1. params - The plugin's parameters (see later).
    //      2. templates - a {name: ..., content: ...} objects array of
    //         templates. The 'content' field is the template's raw content
    //         (a Buffer object).
    //      3. contexts - an objects array with information to be passed to
    //         templates. Each object has the form {template: ..., context: {}}.
    //         'template' corresponds to some template name, which should be
    //          rendered with the 'context' context.
    //      4. done - a callback which should be called when the plugin is done.
    //         Receives an optional 'err' argument to indicate a plugin error.
    // 3. params (object) - an object of parameters to be passed to the
    //    plugin's handler.
    function _plug(name, handler, params) {

        _plugins.push({
            name: name ? name : 'anonymous plugin',
            handler: handler ? handler : noop,
            params: params ? params : {}
        });

        log.info('Plugged in \'%s\'.', name);
        log.debug('With params: %s', JSON.stringify(params));

    }

    // Start the concoction process.
    // 1. run all pre-processing tasks.
    // 2. run all plugins.
    // 3. run all post-processing tasks.
    // 'next' is an optional callback which receives an optional 'err'.
    function concoct(next) {

        log.info('Concocting...');

        var workflow = [];

        // queue pre tasks:

        _preTasks.forEach(function(task) {

            workflow.push(function(next) {

                task(_options, _templates, _contexts, _links, _buffers, log, next);

            });

        });

        // prepare the plugins:

        _plugins.forEach(function(plugin) {

            workflow.push(function(next) {

                log.info('Running %s plugin', plugin.name);

                plugin.handler(plugin.params, _templates, _contexts, _links, _buffers, next);

            });

        });

        // queue post tasks:

        _postTasks.forEach(function(task) {

            workflow.push(function(next) {

                task(_options, _templates, _contexts, _links, _buffers, log, next);

            });

        });

        // run the workflow:
        async.series(workflow, function(err) {

            if (err) {

                log.error('Concoction process stopped due to en error.');
                log.error('%s', err);

            } else {

                log.info('Done.');

            }

            if (next) {
                next(err);
            }

        });

    }

};