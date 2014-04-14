# ConcoctJS
A content compiler on Node.js

ConcoctJS knows how to compile templates with some context and write the results to disk. Anything in the middle is up to plugins.

I use ConcoctJS, with some additional plugins, to generate my static blogs. You can use it for whatever you want.

ConcoctJS works with any templating engine, as long as there is a plugin to handle it.
The contexts with which templates are compiled are simply JSON files; and they too can be modified by plugins.
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

## Linking rules

Linking rules are defined with a glob pattern matching dictionary. So from `x` templates and `y` contexts you can compile (at most) `x * y` files.

### Examples

#### Compile all contexts in 'contexts' directory against all templates in 'templates' directory:

    #!Javascript
    {
        "contexts/*.json": "templates/*.tpl"
    }

#### Compile all contexts against the 'article.tpl' template:

    #!Javascript
    {
        "contexts/*.json": "templates/article.tpl"
    }