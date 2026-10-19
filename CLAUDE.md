# agent-journal

## Design philosophy

Version 4 is the same product as version 3, rebuilt simple. Every rule below exists because
version 3 broke it and paid for it. Read this before writing, and when a change fights one of
these, the change is wrong, not the rule.

**One concept, one place.** A thing is defined in one file and nowhere else. A model is its
file in `models/`; its SQL is its repository; the journal's conduct toward the agent in a state
is that state's workflow, and the engine keeps only what no workflow may change. If you are
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

**Every write names its actor.** `save(row, by)` and `delete(row, by)` take the actor; a
request and a command know theirs. Nothing is written anonymously, so a shared journal with
many users needs no change to the base.

**The state is the truth.** What an agent is doing is its row's state column, one flat state
at a time, no substates; what it owes the journal, a skill to read, the look at what is in
flight, a decision at a context mark, is a fact beside it on the same row, never a state over
it. A state is a class with a method per event, named after the event. No `if state ==`, no
`if event.kind ==`: dispatch is by class and by method name. What two states share is
inherited, one level. Going back from a pause is data (`resume`), not a stack: the pauses are
the waits, on a worker, on a question, on something outside, on being stuck, and a sequence.

**Features bring their states; the engine knows no feature.** A feature owns its states, its
nudges, its state-free listeners, its commands, and the checks and actions a workflow may name;
the chart's catalogue gathers them from the features and defines none itself. The engine holds the machine, the base
state, `Paused`, the nudger, the clock and the runtime, and imports nothing from `features/`.
A state names a feature's nudge as data; a feature moves the agent through `machine.move`.
A trigger's workflows run in the order the user sets, the locked ones first; a workflow bound
to a state runs while the agent is in it, one bound to none always.

**One line has one decider.** A line is said by a workflow or by the engine, never both; the
first hold of an event wins and a later one is recorded unanswered; one move per event, a
second refused. Every line and every move has one decider, and the record names it.

**Workflows drive the agent; the engine keeps it safe.** The engine does what the journal cannot
work without: delivering the user's messages, running commands, moving the agent when a task starts
or a session ends, keeping a tally. A workflow is the journal's conduct toward the agent, the part
a user would want to shape: when it reminds, what it says, what it holds, when it blocks a stop. The
test is not "does this touch the agent" but "would a user ever want it different, or want to watch
it happen". Delivering a message fails that test, so it is the engine's; the reminder every third
tool use passes it, so it is a workflow. A workflow is also where a user sees how the journal
drives the agent: the canvas shows what it does and why, a run lights the path it took, and Recent
runs says what was said. Engine behaviour lives in the engine and never appears on the canvas, not as a node
and not as a note; a workflow is drawn on the canvas, in the user's order, and can be edited.

**One subject per workflow.** A workflow is about one thing: the inbox, the start block, the voice, a
task's log, a plan's next step. Never a chain of subjects drawn as one workflow because they happen
at the same event; each is its own workflow in the event's run order, and Run no later workflows is the only thing
that keeps a later one from running. What the agent owes the journal before it may write or stop,
the journal skill, the look at what is in flight, a decision at a context mark, is the engine's:
each feature sets its own debt and holds a write and a stop on it through listeners, and no node on the canvas carries it.

**Hooks decide nothing; listeners are deferred unless they say otherwise.** The hook script
posts and prints. The server records the entry, runs the blocking listeners, replies, then
runs the rest on one worker thread. A listener that must answer before the agent goes on
declares `blocking = True`; a deferred one can never refuse, by construction.

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
`events/` (`models/` and `agent/`), `engine/` (the state machine), `features/` (states,
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
