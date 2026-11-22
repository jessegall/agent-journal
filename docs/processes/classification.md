# Classification

Every part of a line is matched against the active command rules and gets its classes and its command type. A part
no rule knows is unknown, and an unknown part is never run.

## Classes

A rule gives each part one or more `CommandClass` values: `read`, `write`, `edit`, `delete`, `network`,
`process_control`, `privilege_change`, `version_control`, `package_install`, `verification`, `build` and
`journal_operation`. An actor's permissions allow or deny classes, and a denied pattern denies one exact command.

## Command types

`CommandType` says what the part is for: `ordinary`, `verification` (Tests and checks), `build`, `alias` or
`unknown`. Tests and checks and builds have a Full output requirement: their output is the result, so it must reach
the runner unhidden and a proven reader must read it (see [admission.md](admission.md)).

## Rules and scopes

A `CommandRule` (`app/Values/CommandRule.php`) names its program spellings, its subcommands, its argument
grammar (operands and the options it accepts), its classes, its purpose, its binding to an executable and, for a
check, its verification contracts. Rules come in three scopes (`ScopeType`):

| Scope | Where it comes from |
|---|---|
| `core` | `app/Processes/Rules`: `CheckRules`, `BuildRules` and the ordinary rules Core ships |
| `module` | A module's approved rule bundle (`ModuleRuleBundle`) |
| `project` | A rule the project's owner approved through the workflow |

A project rule may name the rule it `replaces`; that is how a project gives a core check a proven contract.
`ActiveRules` builds the registry from the startup bundles plus the project's approved revisions, and refuses a set
whose rules conflict (`rule-conflict`).

## Scripts and aliases

A part that runs a project script or a saved alias is resolved to what it runs (`AliasResolver`, `CommandAlias`);
an executable that cannot be resolved is refused with `unresolved-executable`.

## Proposals and review

A new rule is proposed against a command request, then revised, approved, rejected or withdrawn (`ProposalState`:
`draft`, `pending`, `approved`, `rejected`, `withdrawn`, `superseded`). Approval writes an immutable `RuleRevision`
and points the rule's `ClassificationRule` at it; retire and restore move that pointer.

| Command | Does |
|---|---|
| `command-type:explain --line` | Shows how a line is read and classified |
| `command-type:list` | Lists the project's rules |
| `command-type:propose <request>` | Proposes a rule for a held request |
| `command-type:revise <proposal>` | Saves a new revision of a proposal |
| `command-type:approve <proposal>` | The owner approves it |
| `command-type:reject <proposal> --reason` | The owner rejects it |
| `command-type:withdraw <proposal>` | Its author withdraws it |
| `command-type:retire <rule>`, `command-type:restore <rule>` | Stops or restarts an approved rule |
| `command-type:import <file>` | Imports rule proposals from a declaration file |
| `command-type:show <request>` | Shows a request and where it stands |

## Module bundles

A module ships its rules as a bundle; the owner approves the bundle once (`ApproveRuleBundle`) and its rules join
the registry in the `module` scope.

## Shipped readers

Core ships proven readers for the tools it knows (`app/Support/Rules/ShippedReaders.php`), each bound to the
version its samples came from (`app/Processes/Rules/Proofs/<tool>/<version>`). `process:install-shipped-readers`
approves them, as the owner, for every tool whose installed version in `composer.lock` or `package-lock.json`
matches; a tool at another version stays `reader-required`.
