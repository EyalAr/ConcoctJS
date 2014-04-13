// This module exports a constructor.
// options (object) - an options object. required fields:
// . src (string / array) - templates directory path / list of template paths.
// . plugins
module.exports = function(options) {

    var async = require('async'),
        log = {
            info: require('debug')('concoct:info'),
            debug: require('debug')('concoct:debug'),
            warn: require('debug')('concoct:warn'),
            error: require('debug')('concoct:error')
        };

    // The constructed object has one public method:
    this.concoct = concoct;

    var _plugins = [],
        _preTasks = [],
        _postTasks = [],
        _options = typeof options == 'object' ? options : {},
        _templates = [],
        _contexts = [];

    options.plugins.forEach(function(plugin) {
        _plug(plugin.name, plugin.handler, plugin.params);
    });  

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
            name: name,
            handler: handler,
            params: params
        });

        log.info('Plugged in \'%s\'.', name);
        log.debug('With params: %s', JSON.stringify(params));

    }

    // Start the concoction process.
    // 1. run all pre-processing tasks.
    // 2. run all plugins.
    // 3. run all post-processing tasks.
    function concoct(next) {

        log.info('Concocting...');

        var workflow = [];

        // queue pre tasks:

        _preTasks.forEach(function(task) {

            workflow.push(function(next) {

                log.info('Running %s task', task.name);

                task.handler(task.params, _templates, _contexts, next);

            });

        });

        // prepare the plugins:

        _plugins.forEach(function(plugin) {

            workflow.push(function(next) {

                log.info('Running %s plugin', plugin.name);

                plugin.handler(plugin.params, _templates, _contexts, next);

            });

        });

        // queue post tasks:

        _postTasks.forEach(function(task) {

            workflow.push(function(next) {

                log.info('Running %s task', task.name);

                task.handler(task.params, _templates, _contexts, next);

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

            next(err);

        });

    }

};