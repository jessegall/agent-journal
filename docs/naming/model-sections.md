# Model sections

An Eloquent model's methods sit in marked sections, in this order, and `tests/Architecture/ModelSectionsTest.php`
holds them (`tools/refactoring/model-sections.php` lists every fault and sorts with `--fix`):

Constructors, Mutations, Predicates, Transformers, Answers, Accessors, Relations, Asserts, Internals, Queries and
Scopes.

- A yes or no answer sits in Predicates, an object in Transformers, a scalar no accessor can give in Answers, and
  an accessor (returning `Attribute`) only in Accessors.
- A constructor is named `create`, or `createFor` and what it is made from when the model has several. A row builder
  only one constructor uses is inlined into it (user messages 22052 and 22060).
- A static of Queries starts with `find` for the model, none or a list of it, `resolve` for a value, `count` for a
  count, and `is`, `has` or `can` for a yes or no, and makes no row. A constructor or mutation reads through them and
  never ends a query itself.
