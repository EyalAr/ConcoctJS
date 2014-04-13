// This module exports a constructor.
// options (object) - an options object. required fields:
// 1. preTasks
// 2. postTasks
// 3. plugins
module.exports = function(options) {

    var async = require('async'),
        log = {
            info: require('debug')('concoct:info'),
            debug: require('debug')('concoct:debug'),
            warn: require('debug')('concoct:warn'),
            error: require('debug')('concoct:error')
        };

    // The constructed object has one public method:
    this.concoct = concuct;

    var _plugins = [],
        _preTasks = [],
        _postTasks = [],
        _options = typeof options == 'object' ? options : {},
        _templates = [],
        _contexts = [];

    // Plug a new plugin handler which will be run (in order) during
    // the concoction process.
    // Arguments:
    // 1. name (string)- the name of the plugin.
    // 2. handler (function) - the plugin's handler function receives
    //    five arguments - handler(params, options, templates, data, done)
    //      1. params - The plugin's parameters (see later).
    //      2. options - Concoct's options object.
    //      3. templates - a {name: ..., content: ...} objects array of
    //         templates. The 'content' field is the template's raw content
    //         (a Buffer object).
    //      4. contexts - an objects array with information to be passed to
    //         templates. Each object has the form {template: ..., context: {}}.
    //         'template' corresponds to some template name, which should be
    //          rendered with the 'context' context.
    //      5. done - a callback which should be called when the plugin is done.
    //         Receives an optional 'err' argument to indicate a plugin error.
    // 3. params (object) - an object of parameters to be passed to the
    //    plugin's handler.
    function _plug(name, handler, params) {

        plugins.push({
            name: name,
            handler: handler,
            params: params
        });

        log.info('Plugged in \'%s\'.', name);
        log.debug('With params: %s', JSON.stringify(params));

    }

    // Similar behaviour to _plug
    function _registerPre(name, handler, params) {

        _preTasks.push({
            name: name,
            handler: handler,
            params: params
        });

        log.info('Registered pre-processing task \'%s\'.', name);
        log.debug('With params: %s', JSON.stringify(params));

    }

    // Similar behaviour to _plug
    function _registerPost(name, handler, params) {

        _postTasks.push({
            name: name,
            handler: handler,
            params: params
        });

        log.info('Registered post-processing task \'%s\'.', name);
        log.debug('With params: %s', JSON.stringify(params));

    }

    // Start the concoction process.
    // 1. run all pre-processing tasks.
    // 2. run all plugins.
    // 3. run all post-processing tasks.
    function concoct() {

        info('Concocting...');

        var workflow = [];

        // TODO queue pre tasks

        // prepare the plugins:

        for (var i in plugins) {

            workflow.push(function(next) {

                log.info('Running %s plugin', plugins[i].name);

                plugins[i].handler(plugins[i].params, options, templates, contexts, next);

            });

        }

        // TODO queue post tasks

        // run the workflow:
        async.series(workflow, function(err) {

            if (err) {

                log.error('Concoction process stopped due to en error.');
                log.error('%s', err);

            } else {

                log.info('Done.');

            }

        });

    }

};