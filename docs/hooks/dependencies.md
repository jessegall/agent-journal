# Hooks: the core and the domain dependencies

Plan 2 built the agent stack state machine of doc 3. Since task 96 it lives in the core, `app/Core`, with the agent and session context (`app/Core/Agents`) and the links every model uses (`app/Core/Links`). The core is a foundation under the domains, not a domain: every domain and every module installed later, ours, a paid one or a third party, uses it without declaring it, registers its own state types, pushes its own states and adds context. The core names no domain or module; `tests/Architecture/DomainBoundaryTest.php` scans `app/Core` and fails on any domain name in it.

Question 10 had approved edges from the domains to Hooks, Agents and Links. With those three in the core the edges are gone, and the declared edges are below. Rule 9 still holds: a domain declares a new required domain only after the user approves it. `tests/Unit/Domains/DomainClassesTest.php` lists every domain's requirements and pins its export list.

## Declared dependencies

| Domain | Requires | Why | Status |
|---|---|---|---|
| Plans | Tasks | a plan's phases hold tasks | approved (plan 1) |
| Web | Access | the signed-in viewer shared with every page and the user middleware | approved (question 13) |
| Web | Plans | the plans page reads plans and starts them | approved (question 13) |
| Web | Chat | Home's chat pane reads conversations and sends messages | approved (question 13) |
| Web | Rules | the rules page reads rules and approves or denies proposed ones | approved (question 13) |

The core's own needs from a domain go through contracts the core owns: Processes fills the core's `ShellCommandParser` with its shell parser.

## Owner stores the plan had to create

No owner store existed for the subjects the states are about, so plan 2 built the first, minimal one of each in its own domain, holding only what the stack needs. Later plans extend these stores; they do not add second ones.

| Domain | Store | Built in |
|---|---|---|
| Tasks | `tasks`, `Task`: title, state, run number, the agent and session working on it | task 62 |
| Chat | `messages`, `Message`: body, state, the agent and session that owe an answer | task 63 |
| Sequences | `sequence_runs`, `SequenceRun`: steps, current step, state, the agent and session | task 64 |
| Processes | `ShellParser`: the shell parser and the command catalog; `command_aliases`, `CommandAlias` | tasks 65, 91, 175 |
| Core (Agents) | `agents`, `agent_sessions`, `launch_credentials` and the launch, loss and child operations | tasks 57, 70, 72 |
| Memory | `memories`, `memory_compactions`: weights faded once per compaction | task 71 |
| Rules | `rules`, `Rule`: text and state | task 71 |
| Core (Links) | `links`, `Link`, `Linkable` | task 84 |

## Owner work still missing

| Missing | Owner and files | Follow-up |
|---|---|---|
| Starting a program with the relay environment (JOURNAL_URL, JOURNAL_LAUNCH_TOKEN, JOURNAL_ROLE, JOURNAL_BYPASS_LOG) | the host that launches programs; `bin/journal-hook` and `hooks:relay` exist (task 88) | not planned yet |
| Agent scoping (rule 4) on the new task, message, sequence, memory and rule stores | Tasks, Chat, Sequences, Memory, Rules models | task 92 |
| A full hook call and a lock wait measured on the live Octane app | Hooks; `docs/hooks/program-capabilities.md` | task 93 |

## Core's public surface (plan 5, tasks 156 and 163; plan 6)

`app/Core/CoreApi.php` lists 127 Core types one by one; the rest of Core is private, whatever folder a class sits in. By area:

- **Actors** (7): `ActorContext`, `ActorContextMissing`, `ActorIdentity`, `ActorType`, `AgentActorRequired`, `InvalidActorText`, `UserActorRequired`.
- **Agents** (10): `AgentLabel`, `AgentNotAvailable`, `AgentReader`, `AgentReply`, `AgentRequestFailed`, `AgentRequestSender`, `AgentRetirement`, `AgentRetirementDenied`, `SessionOption`, `SessionReader`.
- **Assignments** (43): the contracts `AssignmentWriter`, `AssignmentReader`, `AssigneeReader`, `AssignmentTransaction`, `AssignableProvider`, `AssigneeProvider` and `AssignmentRegistration`; the values `RecordIdentity`, `Assignment`, `AssignmentReference`, `AssignmentGroup`, `AssignmentChange`, `AssignmentOutcome`, `AssignmentResult`, `AssignmentSet`, `AssignmentHolder`, `AssignmentHolders`, `AssigneeName`, `AssigneeList`, `AssigneeRegistration`, `Page`, `NumberedPage`, `RecordIds`, `AssignmentData` and `RecordHolderData`; the enums `AssignmentOutcomeType` and `AssignmentReason`; the fact `AssignmentsChanged`; the trait `AssignableListing`; and their exceptions (`AssignmentConflict`, `AssignmentDenied`, `AssignmentRootFinished`, `AssignmentGroupTooLarge`, `RecordUnavailable`, `AssigneeUnavailable`, `AssignmentTypeUnavailable`, `InvalidAssignmentIdentity`, `InvalidAssignmentPage`, `AssignmentRetryExhausted`, `AssignmentTransactionRequired`, `AssignmentProviderInvalid`, `AssignmentTypeRepeated`, `AssigneeTypeRepeated`).
- **Contracts** (5): `Actor`, `Assignable`, `Assignee`, `CurrentActor`, `CurrentActorSetter`.
- **Hooks** (57): `AgentStack`, `AgentState`, `Answer`, `AnswerType`, `CommandEffect`, `CommandType`, `CommandPart`, `CompactionDetails`, `ContextCompacted`, `ContextWasCompacted`, `Decision`, `FileChange`, `FileChanges`, `FileEditRequested`, `FileOperation`, `HookAnswerer`, `HookIdentity`, `HookInput`, `NoSubject`, `BelongsToOneAgent`, `ParseOutcome`, `PartJoin`, `PromptDetails`, `PromptSubmitted`, `ReminderContribution`, `SessionEndDetails`, `SessionEndReason`, `SessionEnded`, `SessionStartDetails`, `SessionStartSource`, `SessionStarted`, `ShellCommand`, `ShellCommandParser`, `ShellCommandRequested`, `ShellDialect`, `StackEditor`, `StackLockTimedOut`, `StackTarget`, `StackTargetRefused`, `StackTransactionRequired`, `StackTransactionRunner`, `StackTransition`, `StateReference`, `StateRegistration`, `StateSubjectMissing`, `StateType`, `StateTypeRepeated`, `StateTypesFrozen`, `StateTypesRequested`, `StopDetails`, `StopRequested`, `SubjectReference`, `ToolFinished`, `ToolOutcome`, `ToolResult`, `TransitionType`, `UserStack`.
- **Links** (5): `LinkAccess`, `LinkTypeRenames`, `LinkTypes`, `Linkable`, `UnknownLinkType`.

`CurrentActorSetter` is for the authentication sites only (below); `LinkTypes` and `LinkTypeRenames` for owner providers and owner migrations; `AssignmentRegistration` for the composition sites only (below). Domain exports: Tasks 16, Plans 16, Chat 9, Rules 11, Access 0; Memory, Processes, Profiles, Reminders and Sequences export nothing. Web is part of Core since task 226 (`app/Core/Web`) and requires no domain: Chat, Plans and Rules declare their own pages with Core's page vocabulary (`App\Core\Ui`), and Access fills Core's `CurrentUserReader` and `JournalAccessPolicy`.

## Assignments: one holder per record (plan 6, doc 13)

Core owns the `assignments` table and is the only code that reads or writes it. A record has at most one holder, a user or an agent; giving it to another writes a new row, so an `AssignmentReference` (the row id and the holder) names exactly one assignment and a stale reference is refused even when the same holder came back.

- **Who supplies what.** An owner makes its model `Assignable` (a stable link alias and id, never a class name) and supplies an `AssignableProvider` for each alias: whether the caller may see and assign a record (under a key-share lock), which of a batch the caller may see, and which are finished. Tasks supplies `tasks.task`, Plans `plans.plan` and `plans.phase`, and the Notes fixture shows a module outside `app` doing the same. An owner of an actor type supplies an `AssigneeProvider` (eligibility and names): Access for users, Core's Agents area for agents.
- **Registration is composition.** A domain declares its providers through `ProvidesAssignables` and `ProvidesAssignees` on its descriptor; `DomainRegistry` and Core's own providers register them through `AssignmentRegistration` while the application boots. No other file may name `AssignmentRegistration` or `AssignmentRegistry` (`BindingRulesTest`). A type nobody registered is unavailable to typed reads, while retirement still releases its rows.
- **Lifetimes.** Readers, the writer and the providers are scoped to the request, since each acts for the request's actor; nothing holds an actor beyond it. The writer runs each command in its own repeatable-read transaction, retried up to three times on a serialization failure or deadlock, and refuses to join any other type of transaction.
- **Values only.** Every public signature passes `RecordIdentity`, `ActorIdentity`, references, results and pages; a missing holder is an `Option`, never a null. Models, rows and the store stay private.
- **Domain edges unchanged.** Assignments added no domain requirement. Plans reaches tasks only through Tasks' exported `TaskAssignmentReader`; Core names no domain.

## How the boundary is checked (plan 5, phase 26)

Doc 10 revision 2 is the design. The architecture suite (`tests/Architecture`, run by `composer test` and so by `composer ci:check` in CI) enforces it on `app/Domain` and `app/Core`, and on any module registered beside the domains.

- **Names** (`DomainBoundaryTest`). A domain names its own code, Core's listed types, code outside the project, and of a domain it requires only what that domain's `exports()` lists. A descriptor may name the descriptors it requires, in its own Domain class only. Core names no domain. Imports, types, `::class`, `new`, static calls, attributes, docblock types and class-name strings are read; names built at run time are not.
- **Composition files** (`DomainBoundaryTest`). Outside the domains, exactly five files may name domain or Core classes, and only for what they compose: `bootstrap/domains.php` the descriptors, `bootstrap/providers.php` the providers, `bootstrap/app.php` the middleware, `config/auth.php` the user model and `database/seeders/DatabaseSeeder.php` the owners' seeders.
- **Public signatures** (`PublicContractTest`). Every export exists and is an interface, an enum, a final immutable value (Data included) or an exception in its owner's `Exceptions` folder; Core may also publish traits, abstract bases and its one Eloquent adapter, `LinkAccess`. Models and services are never exported. The public methods, properties and promoted constructor parameters of an export, with their docblocks and those of its project parents, show only the owner's own exports, Core's list and framework types: never another domain's value, even a required one. A leak names the member, such as `PlanCard::__construct()`.
- **Tables** (`DomainTableBoundaryTest`). A table belongs to the domain or Core whose migrations create it, and only that owner reads, joins, keys or changes it, also when another domain requires the owner. Core's areas own `agents`, `agent_sessions`, `launch_credentials`, `launch_bypasses`, `agent_stacks`, `hook_calls`, `links` and `assignments`. Raw SQL text and table names built at run time are not read.
- **Events** (`DomainEventRulesTest`, `DomainEventCallTest`). Another owner's event is named only in a listener, to hear it, and only from a domain that requires the owner; it is raised only by its owner, and a domain never raises a Core event or extension request. The `eloquent.booted` wiring in `HooksServiceProvider` is a framework call, not a named event.
- **Bindings** (`BindingRulesTest`). `#[Bind]`, `#[Scoped]`, `#[Singleton]` and class-string `bind`, `scoped` and `singleton` calls in providers are read: the target implements what it is bound to and belongs to the binding owner, and only Core's public contracts are filled by another owner (Processes fills `ShellCommandParser`, over Core's explicit `bindIf` fallback `MissingShellParser`). A singleton that reaches a per-request service through its constructor fails. Closures in providers are not judged.
- **Who acts.** Only `ActorStore`, its two contracts, `CoreApi`, `AuthenticateAgent`, `AuthenticateUser` and `ActorsServiceProvider` name `CurrentActorSetter` or `ActorStore`; tests may arrange an actor.
- **Registered modules** (`RegisteredModuleTest`). `tests/Fixtures/Modules/Notes` is a module outside `app` with its own descriptor, contract, value, private reader, provider, migration and listener. Registered beside the real domains, it is discovered like a domain (listener folder, migrations) and judged by every check above in both directions; its provider is registered by the module itself.

Not checked, and so not promised: names, tables or events built at run time, a query built in one file and run in another, closures bound in providers, and changes to the container at run time. Deferred by doc 10's decisions: a command bus, a separate store per owner, an outbox for facts, a supplier registry and a cross-owner link router.

## Cycles between areas (task 221, question 26)

Each Core area (`App\Core\Agents`, `App\Core\Hooks` and the others), each domain and the domain foundation is one unit, and `tests/Architecture/AreaCycleTest.php` fails on any group of units that reach each other, directly or through others. Type folders inside one area (Contracts, Support, Enums) are filing, not layers, so the per-folder `php/NamespaceCycleDetector` is switched off in `.commandments/config.json`. The signed client that the CLI uses to send agent requests is its own area, `App\Core\AgentRequests`, below Agents, Hooks and Assignments; Agents owns `AgentRole`; Assignments owns `AgentAuthority`, which Agents fills.
