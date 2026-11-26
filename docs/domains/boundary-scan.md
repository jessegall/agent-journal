# What the domain boundary scan cannot see

`tests/Architecture/DomainBoundaryTest.php` checks that every domain uses only its own code, `App\Domain`, `App\Core`,
code outside the project and the domains it declares, and that the core uses no domain. It reads class names from the
syntax tree, so it does not see:

- class names built at run time or read from config;
- relation chains on untyped models, morph alias lookups and raw SQL text, such as a `where` on `tasks.id` or a
  `select` of `tasks.*`;
- Blade views;
- the folders routes, config, bootstrap and database beyond the composition files and the root migrations rule;
- edits inside the listed starter-kit files beyond their domain names;
- a received event raised again through a copied variable or another method;
- a query built in another file and passed in;
- a string passed to `->dispatch()` on an injected dispatcher.

`tests/Architecture/CoreNamesNoDomainTest.php` covers the text the class scan misses.
