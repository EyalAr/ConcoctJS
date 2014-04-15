# ConcoctJS
A content compiler on Node.js

ConcoctJS knows how to compile templates with some context and write the results to disk. Anything in the middle is up to plugins.

ConcoctJS works with any templating engine, as long as there is a plugin to handle it.
The contexts with which templates are compiled are simply JSON files; and they too can be modified by plugins. In fact, JSON files are not really needed, as contexts can be generated just by plugins.

Contexts are linked to templates using one of the following:

1. Linking rules.
2. Plugin(s).
3. Combination of (1) and (2).

ConcoctsJS workflow is simple:

1. Load templates and contexts from disk.
2. Link contexts to templates.
2. Run plugins.
3. Write compiled buffers to disk.

If no plugin is present to actually compile the templates, then all the buffers are just copies of the uncompiled templates.

The Concoct module exports a constructor which receives an `options` object with the following fields:

* templates
* contexts
* plugins
* linkingRules
* dest

The constructed object has only one public method - [`concoct()`](#concoct).

## Options

### `templates`

**Type:** String / Array
**Required:** yes

Tells concoct where to find templates.
Can be specified as a glob pattern string, or an array of such strings.

#### Example

```Javascript
{
    templates: [
        "article_templates/*.tpl",
        "static_templates/*.tpl",
        "other_templates/**/*.tpl"
    ]
}
```

### `contexts`

**Type:** String / Array
**Required:** yes

Tells concoct where to find contexts.
Works the same as the [`templates`](#templates) field (see above).

### `plugins`

**Type:** Array
**Required:** no

An array of 'plugin' objects.
See the section ['Plugins'](#plugins) below.

### linkingRules

**Type:** Object
**Required:** no

A collection of key:value pairs, which are used to associate contexts with templates. both 'key' and 'value' can be path glob pattens.
Linking rules are defined with a glob pattern matching dictionary. So from `x` templates and `y` contexts you can compile (at most) `x * y` files.

#### Examples

##### Compile all contexts in 'contexts' directory against all templates in 'templates' directory:

```Javascript
{
    "contexts/*.json": "templates/*.tpl"
}
```

##### Compile all contexts against the 'article.tpl' template:

```Javascript
{
    "contexts/*.json": "templates/article.tpl"
}
```

### `dest`

**Type:** String
**Required:** no

Destination directory to write the buffers.

## `concoct()`

The `concoct` method starts the concoction process.

## Plugins

A 'plugin' object contains the information needed by concoct to run the plugin.
It needs to have to following fields (all are optional)

1. name
2. handler
3. params

### `name`

**Type:** String

The name of the plugin as to be identified in Concoct's log messages.

### `handler`

**Type:** Function
**Arguments:** `params, templates, contexts, links, buffers, done`

The function Concoct calls when running the plugin.

### `params`

**Type:** Object

An object to be passed to the plugin's handler function.
