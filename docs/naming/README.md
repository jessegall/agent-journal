# The name review

`reviewed-names.txt` holds every name declared in `app`, `domain/*/src` and `tests/Architecture/Support` that has
been read and judged. It includes classes, interfaces, enums, traits, methods, properties, constants, enum cases,
parameters and local variables. Each line has the declaration type and name. Check 2 runs the same command every hour.

```sh
php tools/refactoring/list-names.php --check docs/naming/reviewed-names.txt app domain/*/src tests/Architecture/Support
php tools/refactoring/list-names.php --accept docs/naming/reviewed-names.txt app domain/*/src tests/Architecture/Support
```

`--check` lists the names not yet reviewed. `--accept` writes the list from the names declared now, which also drops
the names of renamed and removed code; run it only once every name `--check` listed has been read and passes.

## What a name must be

- A class, interface or enum is a noun for what it is or the role it plays (`PipelineRunner`, `PageProvider`,
  `MessageSender`), never a verb phrase about what its implementer does (`RunsPipelines`, `ProvidesPages`). A contract
  that stands for one class takes that class's name; the class implements it through an alias (rule 43).
- A trait and an attribute keep verb names, since they say what the class using them does (`HasComments`,
  `#[RequiresRequestKey]`).
- An action, a listener, a pipe or a command middleware is named for the step it takes, in the imperative
  (`CheckCommandHandlers`, `ShowAccountsNotice`).
- A type is never an adjective or a state alone (`BuiltFresh`), and never a sentence (`ChangesWhatUsersSee`).
- A method that answers yes or no reads as a question (`isOpen`, `hasTests`); one that changes something is a plain
  verb; one that answers is named for its answer.
- No typos, no vague words (`data`, `info`, `handle` outside a handler, `process`, `manage`).

Whoever writes a name judges it before the commit, and the main agent judges every name a worker brings in before the
merge (rule 44). `TypeNameTest` and the `type-name-is-noun` commandment fail on a type that opens with a verb.
Rename a type with `php tools/refactoring/move.php <Old> <New>` and a member with
`php tools/refactoring/rename-member.php`, so every reference follows.
