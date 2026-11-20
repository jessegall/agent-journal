---
name: type-name-is-sentence
description: A class, interface, enum or trait named with a sentence or clause, such as ChangesWhatUsersSee. Read this before naming a type, and when a type-name-is-sentence finding points here.
---

# A type name is a short name, never a sentence

A class, interface, enum or trait is a thing, so its name is a noun or a noun phrase: `StackTarget`,
`LinkTypeRegistry`, `PlanCard`, never a verb phrase (rule 43, the type-name-is-noun skill). A name with a
clause in it (`ChangesWhatUsersSee`, `RunsWhenTheAgentIsIdle`) is a sentence; it is long, hard to say and hides the
thing behind a description of it (rule 23).

## The fix

Name what the thing is, in a few words, and rename it with `php tools/refactoring/move.php <Old> <New>` so every
reference follows. Put the description in the class's one-line docblock instead.

## Worked example

```php
----------[ Bad ]----------

interface ChangesWhatUsersSee {}

----------[ Good ]----------

/**
 * A fact after which open pages refresh.
 */
interface UserInterfaceUpdater {}
```
