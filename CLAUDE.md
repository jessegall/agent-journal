# agent-journal

## Design philosophy

Version 4 is the same product as version 3, rebuilt simple. Every rule below exists because
version 3 broke it and paid for it. Read this before writing, and when a change fights one of
these, the change is wrong, not the rule.

**One concept, one place.** A thing is defined in one file and nowhere else. A model is its
file in `models/`; its SQL is its repository; the journal's conduct toward the agent in a state
is that state's listeners, and the engine keeps only what no state may change. If you are
about to write the same idea in a second place, you have found the one place it belongs and
should move it there.

**One class per file.** Every class, enum and dataclass has a file of its own, named after it
in snake_case. A module never holds two classes. Navigation is by file name alone.

**Models are data.** A model is a frozen dataclass. It never touches the database, the bus or
the clock. What it knows how to do is pure: `task.started(at)` returns a new task. Two levels
of inheritance at most: `Model`, then `Scoped`, then the model.

**Relations are rows.** Models declare no relations. A link between any two rows is a `Link`
with a kind. Nothing gets a foreign-key column to something else.

**Everything in the chat is a message.** Every bubble the chat shows is a row in the messages
table: the user's words, the agent's, its thoughts, a chat mark, a commit, a receipt. What kind it
is lives in its metadata, and who made it in its actor, the system for a mark. It is written where
its event happens, so fetching the chat is fetching the latest messages; the viewer never pieces a
bubble together from other rows.

**One funnel per kind of write.** SQL runs only in `Connection`. Rows are written only through
a repository, which stamps the actor and fires the model events. Lines reach the agent only
through the `Nudger`. The supervisor is reached only through `SupervisorLink`. Caching,
checks and logging live in the funnel, never at a call site.

**Every write names its actor.** `save(row, actor)` and `delete(row, actor)` take the actor; a
request and a command know theirs. Nothing is written anonymously, so a shared journal with
many users needs no change to the base.

**The state is the truth.** What an agent is doing is a stack of states on its row, `Idle` at the
floor and the state in hand on top. A pause is a state pushed over the work and popped when what
it waits for comes, so going back is a pop, never a value that says where to go. What the agent
owes the journal, a skill to read, the look at what is in flight, a decision at a context mark, is
a fact beside the stack on the same row, never a state over it. A state is a class with a listener
per moment: a method named `on_<moment>`, bound by the event type it annotates,
`on_question_answered(self, event: QuestionAnswered, settings)`. Only `on_` methods are listeners.
Every listener whose type matches the event runs, the state's own first, and their answers merge:
nudges in order, the first refusal wins, one push or pop per event and a second refused. A listener
answers `none`, `swap`, `push`, `pop`, `forward` or `refuse`, and nothing else moves the agent. No
`if state ==`, no `if event.kind ==`: dispatch is by class and by type. One `BaseState` is the
parent of every state and every feature's state extends it directly. Only the top of the stack
hears an event; a state beneath catches up in `on_resume(data, settings)`, which may pop it.
The lifecycle hooks `on_push`, `on_suspend`, `on_resume` and `on_pop` answer nudges, and `on_push`
may refuse the push. Every push and pop is an entry in the trail, shown under the
figure on the Home page. Counts and times a state keeps are its fields and go with it when it is
popped.

**Features bring their states; the engine knows no feature.** A feature owns its states, its
nudges, its options, its recording listeners and its commands. Its conduct toward the agent in
every state is a mixin extending `Conduct`: `on_` methods named for their event alone,
`on_tool_starting`, and nothing else, folded into the base state at boot. The engine holds
the state machine, the base state, `Wait`, `Compacting`, `Ended`, the nudger, the clock and the
runtime, and imports nothing from `features/`. The state machine is reached by the engine alone
and by `journal panic`, which pushes, pops or resets the stack from outside and is always allowed;
the custom rule `StateMachineOutsideEngineDetector` flags any other use.

**Only a state moves the agent.** A command writes rows. A model names the event its change
means, `task.started(at)` carries `TaskStarted` through `Model.with_event`, and refuses a change
it cannot make before anything is written. The repository dispatches the event on save to every
live agent of the row's environment, and the top of each stack answers it. No state hears
`Updated` or reads a row as it was before. The facts a state needs about the environment's rows
travel on the event as its `data`, a `FeatureData` of one frozen part per feature read by `data.of(Tasks)`,
built by the state machine for the agent it asks; the options travel as `Settings`, a frozen
value of what the user set. A state never asks a repository or a clock: every event carries `at`.

**One line has one decider.** Nothing speaks to the agent from outside a state. A line is said
by the state or the conduct whose listener answered the event; the first hold of an event wins
and a later one is recorded unanswered. A nudge is one class, `Nudge.create(**values)`, and its
name says what the line does. Every line and every move has one decider, and the record names it.

**Conduct is a state's; safety is the engine's.** The engine does what the journal cannot work
without: delivering the user's messages, running commands, holding every tool while the context
compacts, ending the session. Everything else the journal says to the agent or holds it for, when
it reminds, what it says, when it blocks a stop, is a listener on a state or on a feature's
conduct, and the numbers it reads are the Settings page's. What the agent owes the journal before
it may write or stop is set as a fact on its row by a feature's recording listener and held by the
feature's conduct; the events `SkillRead`, `OverviewRead` and `MarkDecided` pay the debt.

**Hooks decide nothing; listeners are deferred unless they say otherwise.** The hook script
posts and prints. The server records the entry, asks the state machine, which answers with the
hold or the lines, replies, then runs the recording listeners on one worker thread. A listener
that must answer before the agent goes on declares `blocking = True`; a deferred one can never
refuse, by construction.

**Dependencies are declared in constructors.** A class names what it needs by type in
`__init__`, and the container builds it once. No globals, no module-level state, no service
locator in a body. The server resolves the whole graph at boot; the CLI builds only what one
command needs. If the container reports a cycle, the design has one: fix the design.

**No clutter.** A docstring is one line saying what the thing is now, only when the name
does not already say it. No comments that narrate history. No `# noqa` where the import can
be ordered. No `try/except` that swallows. No `X | None` on a value the design always has.
No boolean parameter that selects a behaviour: write two methods. A method body is short
enough to read at a glance, and a function with a big `if` is two functions.

**Tests are fast and few.** The suite runs in a dozen seconds, against a temp database and a
real server on a free port, with no mocks and no subprocesses. It covers the core, not every
model and feature. A test that needs a process, a browser or the network goes in a file that
says so on its first line and is not in the default run.

**Shell is for posting.** The hook script and the `journal` shim are a few lines of shell that
curl the server; no Python starts per hook or per command when the server is up.

**Plain English, never poetry.** Every name, title, label, heading, notice and line of this
project says literally what the thing is or does, in ordinary words: "Has unread messages?",
"Run order", "Context reached the next mark?". Never a riddle ("Something owed?"), a sentence
where a noun belongs ("Runs in this order"), or a placeholder where the value is known ("N or
more" on a card whose number is set). If a reader has to work out what a label means, the label
is wrong.

**Notes before memory.** NOTES.md holds what is decided and what is still open; update it
when either changes, so the next session starts from the record and not from recall.

## Tests

`pytest` runs `tests/` in a dozen seconds: one file per phase of the rewrite, a temp database,
real HTTP on a free port, no mocks and no subprocesses. Tests cover the core only: data,
CLI, server, hooks, engine. No tests on single models or features until the core stands.
Run the whole suite after every change; it is cheap.

## Layout

`src/journal/` is the package: `models/` (data only), `repositories/` (the SQL), `db/`,
`events/` (`models/` and `agent/`), `engine/` (the stack of states), `features/` (states, conduct,
nudges, listeners, commands per subject), `hooks/`, `http/`, `console/`, `providers/`, `launcher/` (the
picker and the launch file a supervisor starts from). `src/supervisor/` is a separate stdlib-only package that
knows no journal concept: it runs the processes it is handed and answers its protocol. NOTES.md holds the decisions and what is still open.

@AGENTS.md

## Working here as Claude Code

The briefing above is the canon, shared with every agent. These are the parts of it
that have a specific name in this harness:

- **Load a skill with the Skill tool**, by the exact id in the briefing's bullets —
  e.g. `commandments-backend-absence`. The published skills are linked into
  `.claude/skills/`, so they also autocomplete as `/`-commands.

**The disciplines here are ENFORCED, not just written down.** The agent journal's
code-commandments plugin judges what you change and raises each sin in the chat; the
package's own hooks step aside. That is a property of this agent alone — under an
agent with no hook protocol the same disciplines are documents you are asked to follow,
and nothing checks that you did.
<!-- END: code-commandments skills -->
