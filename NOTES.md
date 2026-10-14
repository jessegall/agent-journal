# Version 4 notes

Working notes for the rewrite. Decisions taken, and what is still open. Update as we go.

## What version 4 is

The same product, rebuilt simple: one SQLite database, one `journal` package, one small
supervisor. `v3.bak/` is the old tree and is the guide, never imported.

## Decided

- **Layout**: Laravel-style inside one package, `src/journal/`: `models/`, `repositories/`,
  `db/`, `hooks/`, `features/`, `http/`, `console/`. One concept lives in one file.
- **Models are data only.** Frozen dataclasses. `Model` has id and timestamps; `Scoped(Model)`
  adds `environment_id`. Two levels of inheritance, no more.
- **Repositories do the SQL.** `Repository[M]` for CRUD, `ScopedRepository[S]` adds `in_()`.
  A model's own repository adds only its own queries. No ActiveRecord, no global connection.
- **One SQL funnel**: `db/connection.py`. Nothing else executes SQL.
- **Dependency injection** through `container.py`: constructors name what they need by type.
  No globals, no service locators in bodies.
- **Task, not to-do.** A task carries its own state, start, finish and log lines (`TaskLog`
  rows). The old split between to-do and work is gone.
- **Model events, Laravel style.** `journal/events/`: `Saving`, `Creating`/`Updating`, `Created`/
  `Updated`, `Saved`, `Deleting`, `Deleted`, each carrying the model. The repository fires them
  on the `Bus` at each step of a write; a `-ing` listener may refuse. Hooks arrive as
  `HookReceived`; listeners answer with a `Decision` and the receiver folds them into one.
- **Entries** are the append-only table of what happened (`Entry`, `Entries`); hooks and
  commands both write to it. The in-process word is event, the stored word is entry.
- **Supervisor** is its own package, `src/supervisor/`, stdlib only, never imports `journal`.
  It owns the agent's pty, keeps the journal server alive, and carries out instructions from
  a unix datagram socket: `Type`, `RestartAgent`, `RestartJournal`, `Stop`. Nothing else.
- **One class per file**, named after the class in snake_case. Enums included.
- Style: no clutter, small methods, no big if-chains (dispatch on type), docstrings one line
  and only for a non-obvious why.

- **Server**: one process, `journal serve`, started and kept alive by the supervisor. A
  `ThreadingHTTPServer`: each request on a thread. The hook is `hooks/hook.sh`, a curl to
  `/hooks/<agent>` with the body on stdin; it decides nothing and exits 0 when the server
  is away. The port is read from `.journal/port`.
- **Events are two families.** `events/models/` are the Laravel model events. `events/agent/`
  are what the agent did, one per hook kind: `SessionStarted`, `PromptSubmitted`,
  `ToolStarting`, `ToolFinished`, `Compacting`, `Idle`, `SessionEnded`, `SubagentStarted`,
  `SubagentEnded`. `hooks/translation.py` is the one table from hook kind to event. Features
  listen to agent events, never to raw hooks.
- **The agent is a state machine, and the state is the truth.** `models/agent.py` has a `state`
  column and a `data` dict the state fills (task id, plan id, sequence and step). One flat
  state at a time, no substates; what two states share is inherited, one level
  (`FollowingPlan(Working)`, `RunningSequence(Working)`). A state is a frozen dataclass in
  `agent/states/`, with a method per agent event named after it in snake_case; an event with
  no method changes nothing. Each state declares `allows`, the `Permission`s the agent has
  there. A method returns a `Transition`: the next state, nudges, an optional refusal.
  `agent/machine.py` is the one blocking listener on every agent event; commands move the
  agent too (`task start` -> Working). Starting states: Idle, Working, FollowingPlan,
  RunningSequence, Awaiting, Waiting, Halted, CatchingUp, AtMark, Subagent, Ended. The last
  five extend `Paused`, which holds `resume` (the state it left, serialised) and goes back
  with `back()`; a pause inside a pause nests in the data, so no stack is kept anywhere.
- **Settings, not states**: auto mode and the work mode (hands-on, orchestrator, solo). They
  change what a state allows or says. Liveness (alive, compacting now) is not a state either;
  the viewer derives it from the last event's time.
- **The runtime is the server process.** `agent/runtime.py` keeps three threads: HTTP, the
  `Deferred` worker and the `Clock`, which tells `Ticked` for every live agent every few
  seconds so a state can act on time (five quiet minutes, helpers back). The machine holds
  nothing between events; the agent row is the state.
- **Hooks are deferred by default.** A feature's `AgentListener` has `blocking = False`: the
  server records the entry, replies to the agent, then runs it on the one `Deferred` worker
  thread. A listener that must answer before the agent goes on (the write gate, a hold)
  declares `blocking = True`, and only a blocking listener's `Decision` reaches the agent.
  Never the other way round: a deferred listener cannot refuse.
- **Threads and SQLite**: WAL mode; one sqlite connection per thread for reads, one process
  lock for writes inside `Connection.transaction()`.

## Roots, in order

1. `Connection`, `Model`, `Repository`, `Schema`: fill them, with `Task` as the first table
   end to end through the CLI.
2. `Environment`, `Message`, `Question`, `Fact`, `Rule`, `Reminder`, `Report`, `Doc`, `Event`.
3. Hooks: `Hook.parse`, `Receiver`, `Decision`, the hook shell script, the write gate.
4. HTTP server and routes; then the viewer against it.
5. Supervisor bodies.
6. Features, one at a time, each as listeners.

## To settle later

- **Resume arguments per agent.** `RestartAgent` carries them; the journal builds them from the
  hook's session id. Claude: `claude --resume <session>`. Codex: `codex resume <id>`, to confirm.
  Where the journal stores the current session id per environment, and what happens when the
  agent is restarted before any hook has reported a session.
- **Who writes the hooks into `.claude/settings.json` and `.codex/hooks.json`**, and when they
  need an agent restart (an installed MCP server does; does a hook change?).
- **Which old features survive**, and in what order. First guess at the core: environments,
  tasks, messages, questions, memory, reports and docs, plans, the write gate, viewer, CLI.
  Candidates to drop or defer: helpers, tickets, boards, plugins, phone, sharing, hosting,
  Linear, Gmail, the avatar, the Chrome extension.
- **CLI and the database.** The server is the one writer. Decide whether `journal task ...` run
  by the agent posts to the server (consistent, one process) or opens the database itself
  (works with no server up). Leaning: post to the server, fall back to direct when it is away.
- **Live updates to the viewer**: long-poll or server-sent events off the same threaded server.
- **Context marks**: v3 nudged at 10/25/50/80% of the context window. Needs the context figure
  from the hook payload; decide whether it is a field on every agent event or its own event.
- **Hook timeout**: 5s in `hook.sh`; what a refusal looks like when the server is slow.
- **Where the database lives**: `.journal/journal.db`, and what else stays in `.journal/`
  (settings, runtime socket path, logs).
- **Migrations from v3** records: do we import the old file rows at all, or start empty.
- **Plans**: model shape (phases, checkpoints) once tasks stand.
- **State method injection**: a state method asks for rows by type (`task: Task`); decide
  whether the machine resolves them from the state's data before the call, or the state is
  handed repositories. Leaning: the machine resolves, so states stay pure.
- **Permissions vs the gate**: `allows` says what a state permits; the Idle refusal of a write
  is the first use. Decide which tools count as a write per provider (one table).
- **Viewer**: keep `v3.bak/src/web` as is and repoint its API client, or rebuild it smaller.
- **Install and upgrade**: `install.sh`, `install.py`, the `.pyz` build and the self-update
  loop are all old; decide the new install path before touching them.
- **Tests**: shape of the new suite. Old generated runs are gone with `v3.bak/tests`.
- Old root files still to deal with: `docker/`, `install.py`, `install.sh`, `pytest.ini`,
  `conftest.py`, `.coveragerc`, `plugins.json`, `.githooks/`, `.codex/agents/`.
