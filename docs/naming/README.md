# The names check

No name is written down as approved. One scan reads every name of the project fresh from the code (PHP classes,
members, parameters and variables; the frontend's names; the Go host's; the shell scripts' functions and variables;
and the file names) and refuses each that breaks a rule of `tools/refactoring/name-grammar.php` or holds a word of
`forbidden-words.txt`. Run it at every phase end, every plan end, or whenever asked; check 2 and
`NamesFollowTheRulesTest` run it too.

```sh
php tools/refactoring/name-faults.php                     # every name of the project
php tools/refactoring/name-faults.php app/Pipes           # only the names under a path
php tools/refactoring/name-words.php                      # every word the names use, most used first
php tools/refactoring/name-words.php --type=method        # the words of one kind of name
php tools/refactoring/name-words.php --since=<commit>     # only the words that are new since that commit
php tools/refactoring/name-faults.php rename report notify --verb --path=app             # list the renames
php tools/refactoring/name-faults.php rename report notify --verb --path=app --apply     # make them
```

A word that should never be used again goes into `forbidden-words.txt`; a verb that has a better word goes there as
`verb:<word>`; a bad shape of name goes into the grammar. Look over the words now and then with `name-words.php
--since` so nothing slips through.

The rename command renames from the syntax tree of each language, loading it once for the whole list: `move.php` for
PHP types, `rename-member.php` for PHP members and variables, `rename-go.php` (gopls) for Go and `rename-frontend.cjs`
(the TypeScript service with Vue's plugin) for .ts and .vue. Every PHP parse goes through one funnel
(`php-parse.php`) that stops a run the moment it would parse a file twice. Shell names are renamed by hand.

## What a name must be

- A class, interface or enum is a noun for what it is or the role it plays (`PipelineRunner`, `PageProvider`,
  `MessageSender`), never a verb phrase about what its implementer does (`RunsPipelines`, `ProvidesPages`), and never
  named for what will be done with it (`StepToRun` is a `PendingStep`). A contract
  that stands for one class takes that class's name; the class implements it through an alias (rule 43).
- A trait and an attribute keep verb names, since they say what the class using them does (`HasComments`,
  `#[RequiresRequestKey]`).
- An action, a listener, a pipe or a command middleware is named for the step it takes, in the imperative
  (`CheckCommandHandlers`, `ShowAccountsNotice`).
- A type is never an adjective or a state alone (`BuiltFresh`), and never a sentence (`ChangesWhatUsersSee`).
- An event says what happened, in a past form (`StopRequested`).
- A method that answers yes or no reads as a question (`isOpen`, `hasTests`, `allows`), and so does a boolean property,
  parameter or variable; one that changes something is a plain verb in the imperative (`close`, never `closes`); one
  that answers is named for its answer, never `get` first.
- An action that tells someone something happened notifies (`NotifyStop`); it does not report.
- A shell function is a short verb_noun (`fetch_commit`).
- No typos, no vague words (`data`, `info`, `handle` outside a handler, `process`, `manage`).

Whoever writes a name judges it before the commit, and the names check judges every name again at each phase end
(rules 44, 99, 100). `TypeNameTest` and the `type-name-is-noun` commandment fail on a type that opens with a verb.
Rename a type with `php tools/refactoring/move.php <Old> <New>` and a member with
`php tools/refactoring/rename-member.php`, so every reference follows.

## The text review

`reviewed-texts.txt` holds every text a user reads on screen that has been read and judged: a template's static text
and its label-like attributes (`title`, `label`, `placeholder`, `aria-label` and the like) in `.vue` files, a string a
script gives to a label-like key, and the strings a PHP method named for a screen text returns (`label()`,
`description()`, `title()`, a form request's `messages()`). Each line is the text alone.

```sh
php tools/refactoring/list-texts.php --check docs/naming/reviewed-texts.txt resources/js app
php tools/refactoring/list-texts.php --accept docs/naming/reviewed-texts.txt resources/js app
```

It runs wherever the name review runs: before each commit, before each worker merge, and at the end of each phase and
plan. Read each listed text aloud, as a person reading the screen would. A label is the short word a dashboard shows
(`Expired`, `Signed in`, `Make default`); an explanation is a plain sentence under it. Rewrite any text nobody would
say (`Its login expired` is `Expired`), then `--accept`.
