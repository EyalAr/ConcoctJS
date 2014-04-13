# ConcoctJS
A content compiler on Node.js

ConcoctJS knows compile templates with some context and write the results to disk. Anything in the middle is up to plugins.

I use ConcoctJS, with some additional plugins, to generate my static blogs. You can use it for whatever you want.

ConcoctJS works with any templating engine, as long as there is a plugin to handle it.
The contexts with which templates are compiled are simply JSON files; and they too can be modified by plugins.

ConcoctsJS workflow is simple:
1. Load templates and contexts from disk.
2. Run plugins.
3. Write compiled templates.
