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
- **Every write names its actor.** `Actor` is system, agent (by session) or user (by id),
  stored as one `kind:id` stamp. `Model` carries `created_by` and `updated_by`; `Entry`
  carries `actor`; every `ModelEvent` carries `by`. `Repository.save(row, by)` and
  `delete(row, by)` take it explicitly, so nothing is written anonymously. A `Request` knows
  its actor (`http/identity.py` reads it: the hook's agent, the viewer's user token, or the one
  local user), and a `Command.run(args, by)` gets it from the console (`JOURNAL_SESSION` means
  the agent, else the local user). `User` is a model from the start, so a shared journal with
  many users needs no change to the base.
- **Relations are rows, never columns.** `Link` joins any two rows by `Ref` (type and id)
  with a `kind` that says what it means. Models declare no relations. `Links` checks both
  ends exist on save; `UnlinkDeleted` removes a deleted row's links.
- **Repositories own the queries.** `Repository[M]` for CRUD, `ScopedRepository[S]` adds `in_()`.
  A model's own repository adds only its own queries. No ActiveRecord, no global connection.
- **One SQL funnel**: `db/connection.py`. Nothing else executes SQL.
- **A query is composed, never written (2026-10-21, task 1136).** A repository builds each read and
  write with `db/query.py`, `self.query().filter(state=...).order_descending("id").limit(n)`, and hands
  it to `selected`, `counted`, `maximum`, `repeated` or `purged`; the builder renders the text and the
  connection runs it. A column the table lacks raises `UnknownColumn` as it is named; `data->key` is a
  JSON path. The methods are `filter_*`, not Laravel's `where_*`, because the naming rules ban `where`,
  `in` and `by`. `SqlOutsideDatabaseLayerDetector` flags SQL text outside `src/journal/db/`.
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
- **Supervisor** is its own package, `src/supervisor/`, stdlib only, never imports `journal`: since plan 8 a thin process host started from a launch file the journal writes (see The thin supervisor).
  It owns the agent's pty, keeps the journal server alive, and carries out instructions from
  a unix datagram socket: `Type`, `RestartAgent`, `RestartJournal`, `Stop`. Nothing else.
- **One class per file**, named after the class in snake_case. Enums included.
- Style: no clutter, small methods, no big if-chains (dispatch on type), docstrings one line
  and only for a non-obvious why.

- **Server**: one process, `journal serve`, started and kept alive by the supervisor. A
  `ThreadingHTTPServer`: each request on a thread. The hook is `hooks/hook.sh`, a curl to
  `/hooks/<agent>` with the body on stdin; it decides nothing and exits 0 when the server
  is away. The port is read from `.journal/port`. The server takes the port this project had
  last, else the first free one from 8420 to 8439, so journals of many projects run side by
  side; `JOURNAL_PORT` names one exact port and `0` any free one. The `journal` shim runs the
  package itself when the port file names a server that no longer answers.
- **The schema follows the models.** `Schema.create` makes each table from the model's fields
  and adds a column a model gained since the table was made (`ALTER TABLE ADD COLUMN`);
  nothing is dropped or renamed by itself. Numbered migrations are for the rest.
- **Events are two families.** `events/models/` are the Laravel model events. `events/agent/`
  are what the agent did, one per hook kind: `SessionStarted`, `PromptSubmitted`,
  `ToolStarting`, `ToolFinished`, `Compacting`, `Idle`, `SessionEnded`, `SubagentStarted`,
  `SubagentEnded`. `hooks/translation.py` is the one table from hook kind to event. Features
  listen to agent events, never to raw hooks.
- **The agent is a state machine, and the state is the truth.** `models/agent.py` has a `state`
  column and a `data` dict the state fills (task id, plan id, sequence and step). One flat
  state at a time, no substates; what two states share is inherited, one level
  (`FollowingPlan(Working)`, `RunningSequence(Working)`). A state is a frozen dataclass in
  `engine/states/`, with a method per agent event named after it in snake_case; an event with
  no method changes nothing. Each state declares `allows`, the `Permission`s the agent has
  there. A method returns a `Transition`: the next state, nudges, an optional refusal.
  `engine/machine.py` is the one blocking listener on every agent event; commands move the
  agent too (`task start` -> Working). Starting states: Idle, Working, FollowingPlan,
  RunningSequence, Awaiting, Waiting, Stuck, CatchingUp, AtMark, Subagent, Ended. The last
  five extend `Paused`, which holds `resume` (the state it left, serialised) and goes back
  with `back()`; a pause inside a pause nests in the data, so no stack is kept anywhere.
- **A span a state waits out is a `Timeout`** (`support/timeout.py`): `Timeout.minutes(15)`,
  `.seconds(30)`, `.tool_uses(25)`, `.edits(50)`, `.marks(1)`, started or reset at a moment the
  event carries (its time, its tool-use count, a count of edits or context marks) and asked
  `is_elapsed` at a later one. A state keeps one as a field (Awaiting's next-task delay and
  check reminder), stored as a dict in its row's data and restored by its field's type.
- **Settings, not states**: auto mode and the work mode (hands-on, orchestrator, solo). They
  change what a state allows or says. Liveness (alive, compacting now) is not a state either;
  the viewer derives it from the last event's time.
- **The runtime is the server process.** `runtime.py` keeps three threads: HTTP, the
  `Deferred` worker and the `JobRunner`. Every background poller is a `Job` with a
  `tick(time)` and its own `interval_seconds`, registered with the runner, never a thread or
  wait loop of its own: the `Clock`, which tells `Ticked` for every live agent every five
  seconds so a state can act on time, the `MenuWatcher`, and each feature's `jobs`. A tick
  that raises is logged and the job ticked at its next turn; one over a second is logged and
  told on the bus as `SlowTick`, which the faults feature says to the agent when the
  Developer setting asks. The machine holds nothing between events; the agent row is the
  state.
- **Hooks are deferred by default.** A feature's `AgentListener` has `blocking = False`: the
  server records the entry, replies to the agent, then runs it on the one `Deferred` worker
  thread. A listener that must answer before the agent goes on (the write gate, a hold)
  declares `blocking = True`, and only a blocking listener's `Decision` reaches the agent.
  Never the other way round: a deferred listener cannot refuse.
- **Threads and SQLite**: WAL mode; one sqlite connection per thread for reads, one process
  lock for writes inside `Connection.transaction()`.

- **Features register states; features depend on the engine, never the reverse.** The engine
  holds `AgentState`, `Paused`, `Transition`, `Machine`, `Nudger`, the catalogue and the
  generic `Ended` and `Subagent`. Every other state lives in its feature's `states/` folder:
  tasks (Idle, Working, Stuck), plans (FollowingPlan), helpers
  (Awaiting), questions (Waiting), memory (AtMark), briefing (CatchingUp). A feature off
  takes its states out of the catalogue; an agent found in one goes back to Idle.
- **A feature lives beside the states.** It owns its states, its nudges (declared `Nudge`
  constants with templates), its state-free listeners, its commands and its settings.
  `features/standard.py` lists what ships.
- **Who decides a nudge**: the state decides when (naming a nudge in its `Transition`), the
  feature decides what and whether (words and switch). A state-independent line is decided
  by a listener. One line, one decider. A state talks to a feature only by naming its nudge;
  a feature talks to the state only through `machine.move`. A state never owns a line: it names a feature's
  nudge in its `Transition` (`Tasks.CARRY_ON.about(task_id)`). A switched-off feature's nudges
  are silent wherever a state names them, so no state checks a switch.
- **A nudge is not a model.** It is a declaration on a feature (name, template) and, once
  said, an `Entry` of kind `nudge` in the same timeline as the hook that caused it. The
  `Nudger` in `engine/` renders it, queries the entries to drop a repeat, writes the entry
  and delivers. Readings nudges are not stored: the state says them again and dedupe
  decides. No nudge page, no nudge commands; wording is a feature setting if ever needed.
- **Delivery**: a nudge born in a transition rides back in the hook's answer (context, or the
  Stop hook's carry-on); one born later (clock, deferred) is typed in through the supervisor.
- **Not ported: boards, kanban, tickets, hosting.** The board is re-envisioned later.

- **Providers.** `providers/`: `Provider` answers four questions about Claude or Codex and no
  more: the transcript path, the resume arguments, which tools write, and how to wire the
  hook into its settings file. `TranscriptReader` yields `Turn`s from the conversation file.
- **The agent's chat** arrives as `TurnWritten` (from the MessageDisplay hook, or the
  transcript); message tags are a listener on it.
- **Settings** are rows: `Setting(key, value)` per environment, with environment 0 the
  project's, laid over. The `Registry` reads switches from `Settings`.
- **Context** comes from Claude's statusline (`hooks/status.sh` writes one file per session);
  `ContextFile` reads it and `Translation` puts it on every `AgentEvent.context`.

- **Instructions files.** The journal injects its law and its briefing only into AGENTS.md,
  between its own markers; CLAUDE.md imports it with `@AGENTS.md` and carries the project's
  own design philosophy, which the journal never writes and never injects anywhere: it is
  for developing the journal itself, not for any project the journal is installed in.

## Done so far, beyond the core

- tasks: Idle, Working, Stuck; task and halt commands; still-open after a quiet quarter hour;
  the same check three times; done names the next open task.
- plans: Plan with tasks linked `in_plan`; plan create/add/start/park/show/list;
  FollowingPlan starts the next task when one is done and ends the plan after the last.
  Deferred: phases, checkpoints, review reports, approval.
- messages: message send/list/read; unread user messages put before the agent at start,
  prompt and stop; every agent turn recorded as a message; `[!reply:N]` answers and reads N.
- questions: question ask/answer/list; Waiting leaves and returns; a prompt answers in place;
  the answer is typed in through the supervisor.
- memory: fact, rule, reminder, nothing; AtMark at 25/50/80 percent.
- briefing: ready, rules, facts, reminders at every session start.
- A compaction hook carries nothing to the agent (Claude reads no context on PreCompact), so
  no state says anything on Compacting; the context marks ask before it. LOG_FIRST is gone.
- Deferred from tasks: work put off in words (needs a text heuristic), closed by commit
  trailer, auto mode's carry-on timing.

## Decisions taken while building the features

- A feature's listeners go on the bus wrapped in `Switched`, which runs the inner listener only
  where its feature is on; so a switched-off feature has no listener running, by construction.
- **The environment is a scope (2026-10-16, task 191).** `repositories/scope.py` holds the
  environment of the thread of work in a contextvar; a scoped repository reads it, so its reads
  take no environment (`messages.unread()`, `tasks.in_state(TaskState.PARKED)`) and refuse with
  `Unscoped` when none is set, and a new row that names no environment is placed in it (entries
  and settings name their own: 0 is the project's). It is set where work enters: the router
  (the header's environment, looked up at the first read that needs it), the hook receiver, the
  console's run, the worker thread and the deferred worker (each piece in the scope it was added
  in). What crosses environments sets it per environment through the same object: the clock per
  agent, `Switched` per event (a feature's listener runs in its event's environment, 0 for an
  event in none), the nudger and `Turn` per agent, the viewer's summary per environment, a chart
  trial in the environment it names. `find` and `all` stay unscoped. The engine's own calls that
  take an environment id (`machine.move`, `SupervisorLink`, `Cards`) keep it: they are not reads.
- The machine fires `StateEntered(session, environment_id, left, entered)` on the bus whenever
  an agent's state name changes, by event or by command. It is a plain Event, not an AgentEvent,
  since no hook reported it. Skills are required on it; nothing listens to Agent `Updated` for
  state changes, since a row can change for other reasons.
- A `Skill` names the states it is `required_in`; Idle requires nothing, so a fresh session
  reads the journal skill only. A keyword in a prompt requires that skill too.
- The console appends `created: task 3 "title", link 7` to every command's output, listing every
  row created while it ran that the system did not make itself, by the command or by what its
  events caused; `Creations` is a bus listener with a per-run list.
- A command's dispatcher is `perform`, so a verb may be any word, `run` included. A state's
  fields never shadow its methods (`on` is the method; Awaiting holds `workers`).
- Skills, triggers, checks, the shell runner and etiquette are built; the feature table is complete.
  A check runs `subprocess` in the project root with a ten-minute cap, on demand or on the
  clock; the clock also dispatches a journal-wide `ClockTicked`.

## Skills (built as proposed)

A skill is a feature's teaching: each feature declares one `Skill` (name, body, keywords, the
states it is needed in). The skills feature writes them from the registry into
`.claude/skills/journal-<name>/SKILL.md` and `.agents/skills/` at install and upgrade, so the
project never hand-holds them. Loading is forced by the engine, not left to the agent's loader:
- `SessionStarted`: the `journal` skill is required, plus the skill of the state the agent is
  in (resumed Working needs tasks).
- Entering a state (Agent `Updated` with a new state): that state's feature's skill is
  required if not loaded this window.
- `PromptSubmitted` naming a skill's keyword: that skill is required.
- Required means a `LoadingSkill` paused state: writes are held and the agent is told
  "load X before anything else"; a `ToolFinished` that read that SKILL.md lifts it. Loaded
  skills live on the agent row (`skills_loaded`, with the file hash) so a changed skill is
  stale and required again, and a new window (compaction) clears the list.

## v3 features, sorted

Became states: work_tracking (Idle, Working), awaited (Awaiting), catching_up (CatchingUp),
memory_checkpoints (AtMark), plans' flow (FollowingPlan),
ask_questions' hold (Waiting), halt (Stuck), subagent tracking (Subagent).

Features to port first, with what they fold in and what they say:
- briefing: session_briefing, recital, skill_loading required. Ready on env, rules in force, facts, reminders, load these skills.
- memory: facts, rules, reminders, memory_checkpoints, rules review. Keyword whispers, rule review, moves the agent to AtMark.
- tasks: work_tracking's rest, put_off_work, close_from_commits. Carry on, still open, unlogged, next, deferred in words, commit closed rows, same check N times.
- messages: messages, acknowledgements, message_buttons, message_todos. Inbox, answer before anything, reaction only, paragraphs, bare numbers.
- questions: ask_questions. Answered so act, waited a day, choices in prose.
- plans: plans. Started, phases, to-dos, ready, reviewed, approved, parked.
- sequences: sequences. Next step, step stalled.
- workers (was helpers): helpers, helper_worktrees, awaited's lines. A subagent only reads; a worker writes, in a worktree of its own. Reported, stopped, refused, idle, quiet, worktree behind.
- laws: journal_laws. Refuse a dispatch without model or job, long read refused, large result.
- skills: skill_loading. None loaded, stale, required.
- triggers: triggers. Nudge, instruct, held, denied.
- checks: checks. Failed, failing again.
- commands: long_commands, heavy_runs. Held, moved to background, forgotten after.
- etiquette: chat_etiquette, form_of_address, command_tags. Voice, shop talk, tag hint, tag refused.

Settings, not features: work_modes, auto mode, permission_prompts routing.
Server-side, no nudges: updates, archive (auto_archive, runtime_cleanup, revisions, kept_rows), sessions liveness (agent_sessions, starting_agents).
Later: suggestions, templates, dumps, collections, attachment_descriptions, record_audit, source_links, git (git_actions, pull_requests, worktrees, file_feed), sharing, phone, connection, plugins, secrets, linear, gmail.
Viewer only: status_bar, open_viewer, family_tree, terminal, thinking, history_searches, report_dock, avatar, figure_floors, agent_profiles, organization, critique, session_recording, browser_control, dev_faults.
Dropped: boards, kanban, tickets, hosting.

## To a version you can test in a browser (decided 2026-10-15, in this order)

A. **Providers answer hooks in their own shape.** Claude ignores `additionalContext` on Stop
   and reads exit 2 with stderr as "do not stop, here is why"; so on Stop a nudge is a refusal
   of the stop, and on SessionStart, UserPromptSubmit, PreToolUse and PostToolUse it is
   `hookSpecificOutput.additionalContext`. `Provider.answer(kind, decision)` shapes the
   Response; Codex uses the same JSON shape. Claude's hook block goes into
   `.claude/settings.json` with the statusline; Codex's into `.codex/hooks.json`.
   Resume: `claude --resume <session>`, `codex resume <session>`. Transcripts:
   `~/.claude/projects/<cwd with non-alphanumerics as ->/<session>.jsonl`,
   `~/.codex/sessions/**/rollout-*-<session>.jsonl`.
B. **`journal setup`**: makes `.journal/`, wires both providers' hooks where their folder
   exists (Claude always), writes the skills, writes the law block into AGENTS.md and the
   `@AGENTS.md` line into CLAUDE.md, and puts a `journal` shim in `~/.local/bin`. The shim
   finds the root by walking up to a `.journal`.
C. **Who ran a command.** An agent's shell has no session id. The shim sends `agent: true`
   when `CLAUDECODE` or `CODEX_SANDBOX` is in its environment, and the server attributes the
   command to the environment's live agent (the latest session not ended). A terminal is the
   local user.
D. **Supervisor bodies** and `journal claude|codex [args]` in the entry point. The supervisor
   sets `AGENT_JOURNAL_ACTIVE=1`, `JOURNAL_ENV`, `JOURNAL_ROOT` and `JOURNAL_INBOX` for both
   the agent and the server it starts with `journal.py serve`.
E. **One API, `/journal`** (task 719, 2026-10-19): the viewer, the share page, a plugin's
   program and the shim all speak it; `/api` and `src/journal/http/v3` are gone. Each resource
   has one controller and is answered as its model's own fields with `table` first and a few
   named additions (a task's `plan_id` and `worker_id`, a message's `filed`, `comments_on` and
   `mentions`, a plan's outline, an agent's activity). One list protocol for every table:
   `GET /journal/<table>?limit&before&after&since&ids&closed` answers `{rows, more, counts}`.
   Acts are `POST /journal/<table>/<id>/<act>`, named as the controller's method. Rows are
   named by their table everywhere (`tasks:12`). The viewer marks itself with
   `X-Journal-Viewer: 1`. `tests/test_server.py::test_every_route_the_viewer_names_is_served_and_version_threes_api_is_gone`
   reads every path the viewer names and fails on one no route serves.
F. **The viewer reads version 4's rows**: its catalogue of tables (titles, icons, where each is
   listed) is its own (`src/web/src/domain/tables.js`), the manifest holds only the journal's
   facts and the features with their options; `domain/row.js` reads what every row answers alike
   (title, body, closed, times as ISO strings); `domain/acts.js` names what each table offers.
   Deleted with version 3's API, having no version 4 server (the phone came back in 4.2.0): the board and tickets,
   the organisation, the hub of journals, hosting and members, the browser extension,
   suggestions, collections, update reports, layout links, agent pause and
   appoint, agent hooks, work modes, priorities, the plugin services panel, replies on shares.
   Document revisions came back in task 1227, as version 3 kept them (report 35): a DocRevision row per
   revision, linked to its document by a `revision_of` Link, written by the docs feature's DocRevisionRecord on
   every save that changes the text; a save within `docs.revision_window` minutes (30) of the last folds into the
   open revision with its change noted section by section, a later one opens the next; `journal doc revisions`,
   `revision` and `keep`, `GET /journal/docs/{id}/revisions` and `POST .../keep`, and the strip and section diff above
   a document. No restore, as in version 3; the phone and the share page do not show revisions yet.
D2. **The boot menu** is version 3's, rebuilt in the supervisor and moved to the journal's launcher (`src/journal/launcher`) in plan 8: a banner, then one question
   at a time under it, moved through with ↑ ↓ (or j k), a number to jump, Enter to pick and
   Esc to leave; the space under the banner is cleared before each question. It asks which
   environment (badges: agent working, last used; or a new name), whether to carry on the last
   conversation (then the other questions take last time's answers, as version 3 did), whether
   to run without permission prompts (`--dangerously-skip-permissions` for Claude, the bypass
   flag for Codex) and whether to set aside the hooks that are not the journal's for the run,
   asked every time as an opt-in, listing the files found to hold any (version 3's clean slate: `OtherHooks` copies each
   file to `.journal/runtime/set-aside`, leaves only the journal's blocks, and puts the hooks
   key back when the agent exits, keeping edits made to the rest of the file meanwhile; a run
   that died is put back at the next launch; the journal's own hook is known by the one path
   `journal/hooks/hook.sh`, so version 3's hook.sh counts as somebody else's). The journal's
   own hooks always run. The answers
   to the last two are remembered in `.journal/launch.json` as the next defaults. The
   environment screen deletes with x: on the environment under the cursor, after a confirmation,
   it goes with everything recorded in it (`journal environment delete <name>`, which is
   `Environments.wipe`: every scoped table's rows in one transaction, then the row); one an
   agent is working stays. `--env`, `--new`, `--skip`, `--aside`, `--yes` and `--no-open`
   answer it without asking; without a terminal the same questions are numbered lines. The
   supervisor stays stdlib-only: it asks `journal.py environment json` for the list. Not carried
   over from version 3: taking over an environment another agent holds (version 4 has no
   eviction) and filling the chat from an unseen conversation's transcript.
   Once the agent starts the screen is cleared and the agent has it whole but for one line at
   the top (`Header`): the package on the left, project and environment centred, the viewer's
   URL on the right once the journal answers. The agent runs in a scroll region under it with
   one row less, and its clear-screen and home moves are rewritten to the row under the line.
E2. **Pagination.** Every index endpoint answers a page, newest first: `?limit=` (default
   50, at most 500) and `?before=<id>` for older rows. `Repository.page(limit, before,
   **fields)` is the one query. The viewer asks for a page and offers "Older".
F2. **The built viewer is committed** in `src/web/dist`, so `journal setup` and `journal serve`
   work from a clone without node; `npm run build` in `src/web` refreshes it.
G. **Run it for real**: `journal setup` in a scratch project, `journal claude`, the viewer in
   a browser, fix what breaks.

## Where it stands (2026-10-15, later)

The journal's lines about messages are short and name numbers, never words: `new message 4`
(typed at once through the supervisor, `InboxOnArrival`), `new messages 4, 5, 6`, or past three
`7 messages unread: journal message unread`; the same forms at start, at a prompt and at a stop
(`Messages.inbox`). The words and the reply hint (`reply with [!reply:N] in your turn`) reach
the agent from `journal message read <n>` or `journal message unread`, which mark them read.
Every line the journal types starts with `[journal] `, put on in `SupervisorLink.type`, the one
funnel, and law L6 says what the mark means. The supervisor types the line and presses Enter
half a second after the line has reached the terminal (`Terminal.ENTER_AFTER`), and every piece,
a key, a line, an Enter, goes in a write of its own: read together, Claude takes them for a paste
and keeps the line in its input, as version 3 found and as the box showed on 2026-10-16 when the
Enter was counted from the queueing and went in behind a line still waiting for a slow reader.
Seen on the first dogfood run: two messages from the chat reached the journal and nobody told
the terminal.

Version 3's viewer runs whole on version 4's server, checked page by page in a browser with
no console errors: Home (chat with replies as comments, commit badges, the status line, the
avatar), Tasks, Plans, Documents, Sequences, Triggers, Checks, Code, Collections, Resources,
Settings (version 3's full tree, feature switches live), Journals, Agents. A real Claude
session through the hooks replied in the chosen voice, wrote, committed, and the chat showed
it all. The boot menu is version 3's arrow-key picker and opens the viewer once the port
answers. A session driven through a pseudo-terminal passed the menu, started Claude with the
hooks, and the journal recorded the session start, the briefing nudges and the session end.

Found on the first real run here (2026-10-15 morning): the viewer's message post crashed with
"table messages has no column named idempotency", because the database here was made by an
earlier build and the schema never added columns; fixed by the schema adding them. The port
was fixed at 8420 for every project; fixed by the range.

## Where it stood before the viewer decision

Done and run for real: setup, the server, the hooks with a real Claude session (briefing, inbox,
skill hold, gate, chat recorded with reply tags, task started from inside the agent), the
viewer in a browser with the avatar on the chat's bubbles, voices, profiles, pagination.
The supervisor is proven with a shell agent in a pty; `journal claude` interactively is the
first thing to try by hand.

Still to do, in rough order:
- Workers spawn from the journal itself (`worker_runner.py`), outside the supervisor and its protocol.
- Resume after a restart of the agent is tried live (plan 8, task 453): it comes back on the same conversation. Codex runs on
  the thin supervisor, but its hooks did not reach the journal in a fresh project, so its resume is untried (task 461).
- The context figure needs Claude's statusline, which runs only interactively; untested.
- Reports and docs have models and routes but no page; no page for workers, checks, sequences,
  triggers; no hub of journals; no sharing; no plugins.
- Memory keyword whispers and the rule review; put-off-work; closed-by-commit; auto mode and
  work mode settings; permission prompts routed to the viewer.
- Panes read from the entries: file edits and the terminal.
- Chat marks drawn today: commit badges (from the git feature's entries), skills loaded; not yet: subagent marks, thoughts, whispers, test-run cards, reactions.
- Install from a clone or a release (`install.sh`), upgrade and migrations; the `.pyz` build.
- `v3.bak/` can go once nothing is left to read from it.
- A message is one shape whoever wrote it: GET /journal/messages serves the user's and the agent's
  alike, and the chat draws a reply with a one-line quote of what it answers. A comment is a message
  linked to its row as comments_on, listed under it by GET /journal/comments.
- The work mode (Builder, Orchestrator, Solo) is the workers feature's `workers.mode` option,
  set by `POST /journal/mode` from the plan bar; nothing in the journal reads it yet, as under
  version 3's last route. The pause button moves the agent into the pausing feature's
  `paused` state (`POST /journal/agents/<id>/pause` and `/resume`): every tool call is
  refused until the user resumes it or writes to it.
- Open: a worker's transcript has a route but no pane in the viewer; an automatic update's
  "Not now" has no route to cancel it; the context control no longer says when the
  conversation was last compacted.

## The plan

Each phase ends with something that runs. Phases 1 to 5 are done and proven by `tests/`
(`pytest`, about a second). The CLI goes through the server since phase 2.

1. **Data.** `Connection`, `Schema`, `Migrator`, `Model`, `Repository`, `ScopedRepository`,
   `Actor`, `Link`, `Links`. The model events fire. Proof: a test creates, links, updates and
   deletes a task in a temp database and sees every event with its actor.
2. **CLI.** `Container`, `Console`, `Command`, `TaskCommand`; `Environment`, `Message`,
   `Question`, `Fact`, `Rule`, `Reminder`, `Report`, `Doc`, `Entry` and their repositories.
   Proof: `journal task create/start/log/done/list` against `.journal/journal.db`.
3. **Server.** `Server`, `Handler`, `Router`, `Request`, `Response`, `Identity`, the task
   routes, `journal serve`. Proof: curl creates and lists tasks.
4. **Hooks.** `hook.sh`, `Hook.parse`, `Translation`, `Receiver`, `Deferred`, `Decision`,
   `Entries`. Proof: a posted PreToolUse lands as an entry and answers 200.
5. **Engine.** `Machine`, `StatesCatalogue`, `Transition`, `Nudger`, `SupervisorLink`,
   `Clock`, `Runtime`; the tasks feature's Idle and Working with their nudges. Proof: a
   write in Idle answers 409 with DECLARE; after `task start`, Idle on Stop says CARRY_ON.
6. **Supervisor.** `Terminal`, `Inbox`, `JournalProcess`, `Supervisor`, `Launch`; the four
   instructions. Proof: `journal claude` runs Claude under it, a typed line arrives, a
   restart resumes.
7. **Features, one at a time**, each with its states, listeners and nudges, and the
   settings page entry: briefing, memory, messages, questions, plans, sequences, helpers,
   laws, skills, triggers, checks, commands, etiquette.
8. **Viewer.** Read `v3.bak/src/web/src/api/client.js` for the endpoint list; serve the
   viewer; add routes until it is whole; then the phone.
9. **Install and upgrade**, docs, the generated skills, migrations from v3 if any.

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
- **Users on a shared journal**: how a user token is issued and checked, and whether
  environments are shared per user. `Identity` is the one place to grow.
- **Subagent sessions**: a Claude subagent's hooks carry the parent's session id with an
  agent id; today a new session id lands in Idle and would be refused writes. Decide how a
  subagent is told apart (SubagentStarted carries its id) and put it in the Subagent state.
- **Hook output per provider**: today a nudge rides back as `additionalContext` for every
  hook; Claude's Stop hook needs `{"decision": "block", "reason": ...}` to make the agent
  carry on, and PreToolUse context is shown to the user, not the agent. The provider should
  shape `Decision.as_hook_output` per hook kind.
- **Permissions**: `allows` is declared on every state; since the work command went (2026-10-16) nothing refuses a write for lack of a task, and `allows` has no user.
  The gate should read `allows` generically (a tool that writes needs WRITE_FILES) so a new
  state cannot forget to refuse.
- **Hook timeout**: 5s in `hook.sh`; what a refusal looks like when the server is slow.
- **Where the database lives**: `.journal/journal.db`, and what else stays in `.journal/`
  (settings, runtime socket path, logs).
- **Links left by a wiped environment**: `Environments.wipe` deletes the scoped rows but a link
  whose refs pointed at them is only removed if the link row itself was in the environment.
- **Migrations from v3** records: decided 2026-10-19 (task 605): start empty, and bring in version 3's documents with `journal doc import <its project/doc folder>`, once; a doc already titled here is left. Other records stay in version 3.
- **Plans**: model shape (phases, checkpoints) once tasks stand.
- **State method injection**: a state method asks for rows by type (`task: Task`); decide
  whether the machine resolves them from the state's data before the call, or the state is
  handed repositories. Leaning: the machine resolves, so states stay pure.
- **Permissions vs the gate**: `allows` says what a state permits; the Idle refusal of a write
  is the first use. Decide which tools count as a write per provider (one table).
- **Viewer**: keep `v3.bak/src/web` as is and repoint its API client, or rebuild it smaller.
- **Install and upgrade**: `install.sh`, `install.py`, the `.pyz` build and the self-update
  loop are all old; decide the new install path before touching them.
- **Tests**: pytest, `tests/`, one file per phase proof, a temp database fixture, no mocks,
  core only; no tests on single models or features until the core stands.
- Old root files still to deal with: `docker/`, `install.py`, `install.sh`, `pytest.ini`,
  `conftest.py`, `.coveragerc`, `plugins.json`, `.githooks/`, `.codex/agents/`.

- **docs/messaging-and-chat-marks.md** holds the requirements for the chat, read from version 3 on 2026-10-15: your messages, the agent's words, tags, replies, reactions, marks, etiquette, and what version 4 still lacks.
- **Messaging, second batch (2026-10-15).** The whole turn is gathered in the hook layer
  (`TurnGatherer` under `Translation`): every `TurnWritten` carries the text so far and its delta, so
  the recorder and the etiquette listener read the same whole on the final one. Reactions are a model
  (`Reaction`: face, author) linked to the message by a `reacts` link, toggled by `journal message react`
  and the viewer; the user's face is typed to the live agent on the link's creation; a turn that is only
  a face is not posted. A turn answering a `[journal]` prompt with no file written since is kept as an
  acknowledgement (a column on the message) and hidden by the viewer's default. Em dashes and
  run-together paragraphs are nudged. Subagent marks come from the Agent tool's start and finish in the
  agent shaper. Found on the way: `UnlinkDeleted` existed and was never registered; it is now.
- **The agent introduces itself (2026-10-15).** On a fresh conversation (`SessionStarted.source ==
  "startup"`, never on resume, clear or compact) the voices feature types `introduce yourself to the
  user in the chat` four seconds after the start hook, when Claude's prompt is up. Typed lines now carry
  `after` seconds and go in one at a time in the order sent (`Terminal.type(line, after)`, `pump`).
- **Messaging, third batch (2026-10-15).** `Tags` (messages feature) reads every command tag at a
  line's start; `RunTags` runs the command each stands for through the console with the turn's words
  as its text (`todo`, `log`, `end`, `fact`, `rule`, `reminder`), and a refusal is typed back. The
  recorder strips every tag and keeps a `log` turn out of the chat. `Cards` (engine) is the one funnel
  for marks in the chat: a check run, a trigger met, a question answered, a skill loaded, a halt.
  Each is a message of author `system`, its label the text and its kind, icon, tone, detail, row and
  session on `Message.data`, so `/api/<env>/message` serves the whole chat in one stream by number. The console
  now answers a missing row or a refusal with code 1 and the reason instead of raising.
- **A deferred failure never stops the worker.** `Deferred._work` logs a failing piece of work to the
  server log and runs the next; before, one exception ended the thread and every later deferred listener
  waited in the queue for good, silently. Found 2026-10-15 behind a reply that never reached the chat.
- **Install is one command, as version 3's (2026-10-15, later).** `install.sh` copies `src` into
  `<project>/.journal/src` (from the checkout it is run from, or a clone of `AGENT_JOURNAL_REPO` at
  `AGENT_JOURNAL_REF`) and runs `journal setup` from the copy. Setup also writes the dispatcher at
  `~/.local/bin/journal` (`journal/launcher/dispatcher.py`): it finds the project's `.journal` walking up and
  hands over to `.journal/src/journal.sh` (version 4) or `.journal/journal` (version 3's launcher), so one
  command serves both versions and nothing of the journal lives outside a project. Setup adds `/.journal`
  to the project's `.gitignore`. A wired hook first tests that its script exists. A dogfood checkout
  therefore runs from its own `.journal/src` copy: re-run `sh install.sh` after a change to try it live.
- **The drain of the discrepancy list (2026-10-15, night).** `docs/v3-v4-discrepancies.md` ends with
  what landed and what is left by choice. Workers run through `WorkerRunner`: the provider's
  `worker_command` headless on the brief, a worktree under `.journal/worktrees` when asked, the journal's
  hooks off for it, its output filed by `WorkerReports` as its report. A question through the provider's
  own tool is refused. Version 4's own API moved under `/journal`, since `/api/agents` shadowed the
  viewer's online list.
- **One inbox per environment (2026-10-15, evening).** A supervisor's inbox socket is named for the
  project and the environment, and while it runs it announces its path at
  `.journal/runtime/inboxes/<environment>`. `SupervisorLink` takes the environment id on every call
  and reads that file, so a line reaches the agent of that environment and none other; an environment
  with no supervisor hears nothing. The viewer's Start runs `journal.py <agent> --env <name> --yes
  --no-open --no-journal` detached (`AgentLauncher`): no keyboard (`stdin=None`), no journal of its
  own (a launch file with no services), its screen in `.journal/runtime/agent-<env>.log`; Stop sends the supervisor the
  stop verb. Since plan 8 the inbox is a stream socket speaking the protocol and the announce file is JSON naming it, the protocol and the screen. Deleted on the way: `JOURNAL_INBOX`.
- **The command is the project's.** `journal setup` writes `.journal/bin/journal` and nothing outside the
  project; the launch puts that folder first on the agent's PATH, so `journal …` resolves inside a
  session and nowhere else. Ruled 2026-10-15 after a dogfood setup overwrote the global `journal` of
  version 3 on this machine (restored from version 3's own shim template). Nothing of version 4 is
  published: origin holds `main` only, the last tag is v3.3.2.

## The shell runner (2026-10-15)

- The foreground shows a part's output cut to its first and last `shell.shown_lines` lines (200); a line says how many were cut and that the whole lies in the part's file. A Read of a file longer than twice that, without offset or limit, is refused with the same guidance (`ReadNarrowly`).

- Every shell command of the agent runs through `hooks/run.sh`, set as Claude Code's shell prefix at launch. The
  line is taken apart at `&&` and `;` (`Chain`); a pipe is one pipeline. Claude's own wrapping (`source`, `setopt`,
  `eval '…' < /dev/null`, `pwd -P >| file`) is run in silence; the parts inside the eval are the agent's and are
  recorded, each with what it is doing (`Doing`), its output and its duration (`running` and `ran` entries).
- A worker in the agent's own shell runs the parts in order and stops where the shell would; the foreground
  process shows each part's output as it lands. Past the limit it returns at once with the output file and the
  chain goes on in the background; the journal types one line when it ends. The limit is `shell.foreground`
  (30 s) or `shell.foreground_while_waiting` (10 s) while a message of the user's is unread.
- The bar and the terminal pane read the parts, not the tool call; a Bash call as a whole adds nothing to either.
- What stays one part: a pipe, quotes of every kind including backticks, subshells, groups, double brackets,
  parameter braces, a comment to the end of its line, a loop, an if or a case to its closing word, and a line with a
  heredoc. A bare `exit` or `exec` in a part ends the chain with that part's code, as the shell would. Output folders
  older than a day are swept at each run.
- Open: each part costs two shim calls (about 0.1 s each); run.sh could post straight to the server. A worker or
  subagent started from the agent's shell inherits the prefix, so its commands are recorded under the live agent.
- The runner's process tests are in `tests/runner_process.py`, not in the default run: the chain and the move to
  the background as a real process, and a corpus of sixty lines each run whole by zsh and in parts by the runner,
  compared on output and exit code. Add a line there for every new corner.
- Zsh's own answers, tested on 2026-10-15: only `for`, `select` and `repeat` have the short form whose body is the
  next command with its `&&` chain; `if`, `while` and `until` read on to `then` or `do`. A part before `&&` runs
  guarded so `set -e` does not end the shell on its failure, as in the shell. Known differences left: an alias
  defined in one part applies to the next (the shell parses the line first); a failed glob in zsh aborts only its
  own part, not the rest of the line.

## Thinking (2026-10-15)

- Claude writes its thinking to the transcript; the display hook never carries it. `Claude.thoughts_this_turn`
  reads the transcript's tail for the thinking blocks since the last prompt. Before each tool use the latest is
  kept in memory (`Thoughts`) for the working bubble, and a visible message clears it.
- Found by dogfooding: a reply written mid-turn can land in thinking instead of in words, and the chat never sees
  it. A thought opening with `[!reply:N]` for a message still unanswered is dispatched as that turn, so the reply
  is posted and the message answered.

## Conduct toward the agent, settled on 2026-10-15 (evening)

- Delivery (2026-10-15): every line the journal types is noted in `TypedLines` until the prompt hook brings its words back. One not seen back while the agent has sat between turns for ten seconds is typed again, three times at most, each try a card in the chat; the fourth miss is a card saying the line never arrived. The agent's turn being over is `Turn.over`, shared with the MCP restart.

- Every session start, fresh, resumed, after a compaction or a takeover, holds writes until `journal environment
  here` is run: the task in hand, open and parked tasks, messages, questions, workers, background runs, rules,
  facts and reminders in one read.
- A stop is answered, the state untouched: task in hand, "carry on", every time; parked tasks named in any mode;
  in auto mode the next open task and "sure you want to stop?"; a wait the journal owes the agent, said once. A
  wait on the user, a worker, an awaited run or a halt lets the stop pass. Work since a held stop makes the next
  stop a fresh one; a stop with no work between cannot be held again, so its line is typed instead. A halt with a
  reason is the way out.
- Messages: nudged after ten tool uses unanswered, held after fifteen (settings); a reply, a face or any word in
  the chat after the read answers. Every read ends with the choice: steering, or a task filed from it with `--from`.
- Logging: ten tool uses with nothing logged ask for a log, twenty hold the next write (settings).
- A journal command runs alone or chained only with journal commands; mixed with anything else it is refused.
- The machine answers a hook before any other listener, so listeners see the state the event led to.
- The viewer's source lives in `src/web` and builds with `npm --prefix src/web run build`; `scripts/checks/
  viewer_built.py --digest` writes `dist/built-from`. The bar shows `agent.doing` when busy without a task and the
  task's whole title when one is in hand.
- Open from today: integrations as MCP servers (task 11); the behaviour tree, the journal's conduct as an editable
  flowchart in the viewer, after ../workflows (not started, by the user's word).

## Ported whole on 2026-10-15 (night)

- Plans are version 3's shape again: a goal, phases in order with a complete-when and a checkpoint flag, tasks under
  phases (links `phase_of` and `in_phase`), a ready stage the agent sets once every phase has tasks, and the user's
  approval before `plan start`, from the plan page's Approve button or `journal plan approve`. The agent is told
  of the approval by a typed line. The shaper derives the building stage from the rows.
- Sequences may start on a row event (`starts_on`, as `plan.created`); the shipped "Building a plan" sequence is
  seeded at boot (feature `seeds`, run by the runtime) and tells the plan's steps. A run is engine flow, not a state
  and not a workflow: the runs are a stack on the agent's row (`sequence_runs`), the one in hand last, each with the
  step titles it began with and the row it is about; every start goes through `Running`; the next session takes over
  the runs of the last one that ended with some (plan 10). A step is taken up with `journal sequence follow`, or by
  running a command the step names in backticks; until then a write waits, and a taken-up step that stands for
  `sequences.stale_after` writes (25) holds the next write again. Reads, journal-only lines and subagents are never
  held. A stop is told the step once until the agent uses a tool again, and is quiet in a wait, while a question
  is open, while the run is parked and while the agent owes the look, the mark or a skill (`Requiring.owes_anything`),
  so those debts are paid first. A run's start owes the sequences skill. An unedited shipped sequence follows the
  shipped text at boot. A sequence names the states its row must reach (`finishes_in`; Building a plan: ready or
  later) and its last step is refused until then; `abandon --why --sure` gives a run up with a card to the user; a
  cancelled or deleted row, or a deleted sequence, ends the runs about it. Only the user's own words start a sequence
  by trigger (`PromptSubmitted.by_user`). The step is said again at a start, when a wait ends and every
  `sequences.say_every` minutes to a quiet agent. The agent inspector's sequence band shows the run and its last
  changes (entries of kind `sequence_run`) with Skip step and End sequence; that history is not in the chart's
  Recent runs, which is the canvas's.
- Delivery: every line the journal types is held in `TypedLines` until its prompt hook brings it back; one not back
  after ten quiet seconds between turns is typed again, three tries, each a card.
- The supervisor pins nothing to the screen any more: its line is Claude Code's own status line, read from
  `.journal/runtime/status-line`; the terminal scrolls back as it always does.
- The server runs commands one at a time: the output capture is process-wide, and two at once stole each other's lines.
- The runner shows a part's output cut to its first and last two hundred lines; a Read of a longer file without a
  range is refused.
- Still open: the avatar that keeps jumping at a perch (task 38, parked with a finding), the behaviour tree (plan 1,
  ready for approval).

## The chart (2026-10-16, plan 1)

- One `Chart` per journal; `Node` rows of three kinds (trigger, check, action) naming a catalogue entry, with a
  text and a place; lines are links of kind then, yes or no; nodes are linked to the chart by `node_of`.
- The catalogue: a trigger per agent event and per row event of every model; the checks the journal answers
  from the rows, plain and counter ones (a number or a setting's name in the text); the actions say, hold,
  block the stop, type, start a sequence; each entry marks the providers it works for.
- The walk (`features/chart/walk.py`): read fresh per event; agent events blocking after the machine, row events
  deferred; one path per trigger node, fifty steps at most; a trace entry per walk; `Actions` go through the
  nudger, the decision, the supervisor and `Running`; `Fillers` fill placeholders from the rows.
- Saved whole over `POST /journal/chart` with a revision, refused with every fault named (`Validation`); reset to
  the shipped chart; a dry run (`Trial`) for an agent event. `journal chart show|catalogue|node|line|remove|reset|try`.
- The shipped workflows carry the stop rules that were `AnswerStop` and `StopWords.for_`, and since plan 3's
  phase 2 the counter rules too (unread, unanswered, log cadence), in the base workflow and Working's; their
  listeners stay in code until phase 3 deletes them; docs/the-rules.md says what stays in code for good.
- The Workflow page: canvas with pan and zoom, palette, lines dragged from ports, text in place, draft with undo,
  list form for a phone or a keyboard, Try it dry. No release yet: version 4 is still a branch.

## The night of 2026-10-16: settled and shipped

- **Pinned links**: a `Notice` row pins a link above the chat with its label; `journal notice create "<what>" --link <url> --label "<Open ...>"`
  and `journal notice close <n>`; the user closes it from the strip; a link in the chat that no pin carries earns one reminder,
  the journal's own and pull requests excepted.
- **No work command** (the user's ruling): a quick edit needs no task and is never refused; `task park <n>`, `task resume <n>`
  are the task's verbs and `journal await "<what>"` the one wait; the log is asked after 25 edits, named every 25, held at 50 (`Tasks.*` options).
- **Options**: a feature declares the settings it reads as `Option`s (`Feature.options`), key `feature.name`, with the words
  the settings page shows; `Settings.option(PROJECT, option)` reads one. The settings page is built from them: the manifest's
  features and groups come from the registry, the tree nests the stored keys on the first dot, a save writes the keys and
  drops the ones left out. Version 3's settings fixture, its eighty features, the services and developer tabs and the
  status bar's work modes are gone. The avatar is a feature with its `shown` option. The System tab has the Project group
  (`V3Manifest.SYSTEM_GROUPS`); the Share links tab is the `sharing` feature's, with the tunler account pane under it.
- **Share links** (the `sharing` feature): a `Share` row per link, linked to the doc, report or plan it opens as `shares`;
  the share server is a second loopback listener (`ShareServer`) that answers `/s/<token>/`, its `data.json`, its assets and
  `/health`, nothing else; the tunnel is `tunler <port> --domain=<name>` run by the supervisor that hosts the journal while a
  link is open, its name and ports kept in `.journal/sharing.json`. `journal share create|opens|stop|list` is the feature's
  command and goes through `ShareActions`, the viewer's own path: a link the agent makes waits, and a message of the agent's
  with Accept and Deny buttons asks the user (a press is recorded on the message as `pressed`). A visitor's comment, on a link
  made with comments, is posted to `/s/<token>/comment` and becomes a card of the system's in the chat, linked to the row as
  `comments_on`; it is never a message of the user's, so it never reaches the agent as the user's words. Version 3's hold
  until the agent agrees, the user's button letting the agent act on it, and trusted comments through a password are not
  ported. Not ported yet either: shared views and layouts, the watchdog that restarts the tunnel. The phone is back in 4.2.0.
- **A read never makes an environment**: `Environments.existing(name)` is the one lookup for every route and answers not
  found; the runtime makes `main` at boot. The browser's stray `#/settings` had made four environments named settings.
- **The supervisor's Enter**: typed half a second after the line has reached the terminal, each piece in a write of its own;
  before, the Enter was counted from the queueing and went in behind a line still waiting for a slow reader, so Claude took
  the two for a paste and kept them in the box.
- **The Workflows page** is built from Herr Gropius's design after one critique round (first-time, words, parity): PageBar
  with the picker (Default tag), New workflow (event and name in one row, the workflow born with its trigger), Reset to
  default and Delete workflow asking by name, Undo, Discard changes, Save with the unsaved count; the Integrations header;
  nodes as cards with the kind over the title, hollow ports that take the port's colour when hooked, a plus on hover; Add
  node as a menu with search that says where the node lands and connects it; a line dropped on empty canvas offers Add node
  where it fell; Test with the workflow's own event, the result in the SidePanel with numbered steps and the path lit on the
  canvas; the list form with DropLists, no native select; the catalogue in plain words (Agent stops, Agent idle?, Send
  message to agent). The phone screen (design P1 to P5) is task 90.
- **The branch is on origin** as draft pull request 26.

## A failing node in a walk (ruling of 2026-10-16, plan 2)

The walk runs inside the hook's answer. A node that raises, a check on a state nobody foresaw or an action on a row that is gone,
would otherwise fail the whole answer and skip every listener after it, so one bad node could take the inbox, the holds and the
check-ins down with it. The walk therefore catches a node's fault, writes a `walk_failed` entry naming the node, its key and the
fault's words, ends that path and goes on with the others. This is the one place a `try/except` is allowed to catch broadly, and it
does not swallow: the entry is the fault made visible, and the page is to show it per workflow (plan 2, phase 3).

## One workflow per state (ruling of 2026-10-16, afternoon)

Plan 2, one workflow per event, is cancelled at phase 2 with its machinery kept: the catalogue, the checks, the
fillers, the actions, the replay harness and the frozen records, and the seven per-event shipped workflows that
run today. The user's ruling: a workflow per state, with a base workflow for what every state shares, is the state
class drawn, a trigger per event inside it; the state checks leave the branches, two workflows never fight over the
driving, and a workflow may move the agent to its next state through the machine. Plan 3 carries it in three
phases; report 3, five readers against "Find what is missing", is folded into it. The first task rules which state
picks the workflow: the state the machine left, read once into the walk's context right after the machine and
before the engine's holds, found by the state's class and its parents and then the base; the chart feature registers
first for that, so a session start is walked as the state the agent resumes in.

Ruled and built on 2026-10-16: the walk's Context carries the state, set once by the walk listeners and the trial
after the machine has moved; the checks and the fillers read it there and never look the agent up; the walk entry
names it. What is still to come under plan 3: the workflow found by the state's class and its parents and then the
base, the base first and the state's workflow second with one spoken set.

Ruled on 2026-10-16 under plan 3 (task 175): every state has one holder of its conduct, a workflow or the engine,
in the table "Every state, and who holds its conduct" in docs/the-rules.md; the subagent state, which nothing ever
entered, is deleted; the Stop hook's event stays keyed idle and the commands and the trial name it by its title,
Agent stops, beside the state idle.

Ruled on 2026-10-16 under plan 3 (task 176): every line still said outside a workflow is one of three in the rules
doc's table: a law or a guard that stays in code, a feature's own conduct of another kind that stays with it, or a
workflow in phase 3 once its check exists: polling, the reaction, a rule's review, the etiquette reminder and a
plan's changes, each in the base workflow.

Built on 2026-10-16 under plan 3 (phase 2): the seven state workflows, the base first, drawn from the per-event
drawings and the state rules; the older shape retires at boot, whole when unedited, its triggers alone when the user
edited it; Working, Expecting and the running state no longer say their lines; the replays' equal compares the lines
of one answer as a set, since each is an instruction of its own and only the order of the merge changed.

Plan 3, phase 2, complete on 2026-10-16 at the end of the afternoon: the development journal runs the base workflow
and the six state workflows, the older per-event ones retired at boot; thirty-six replays prove them equal to the
frozen records. Phase 2 is the plan's checkpoint: the user looks at the Workflows page before phase 3 deletes the
listeners the workflows carry. The default suite runs in thirty seconds on a loaded machine, with the replays out of
it (python3 -m pytest tests/replays_run.py) and one template journal booted per run; the server per test is what is
left to cut.

Ruling, 2026-10-16: the workflows are the project's, not a user's. A chart is a project row, so every environment
of a journal walks the same workflows, and in a shared journal every user edits the same ones; who made the last
change is on the revision (`revised_by`), and the page shows it. What differs per environment is not the drawing
but the switches: a feature switched off in an environment silences that feature's lines and holds there, since
every shipped line and hold carries its feature's key. A per-user or per-environment workflow is not a thing the
design has, and will not be until a shared journal asks for it.

Plan 3, phase 3, the free part done on 2026-10-16 in the evening: the Workflows page lists by state and notes where
each workflow runs, opens read-only behind an Edit switch, says when each workflow last ran and what last failed in
it, and marks a workflow with no trigger off; every command-line write raises the revision and a default workflow is
edited by command only with --edit-default; a hold a trigger reaches through no check is refused, a wait's workflow
with no release saves with a warning, a shipped workflow cannot be deleted; a tick's walk is recorded only when it
acted; a word from the user frees any wait not owed by the agent; a row event under an owed pause reaches the wait
beneath; the pure state checks retired and a workflow naming an unknown entry is stopped at boot; a feature switched
off silences its holds as well as its lines. The environment scope (Baron Haussmann) and the dictation fix (Mr.
Edison) are merged. What is left of phase 3 is the deletion of the listeners the workflows replaced (118, 142), the
end of listeners.off (181) and the docs after it (119): that waits on the user's look at the Workflows page, the
plan's checkpoint.

Plan 3 complete on 2026-10-16, late evening: the eleven listeners the workflows replaced are deleted in five commits,
one per workflow, each shown equal by the thirty-six replays; listeners.off, the take-over and the drawings' replaced
names are gone; the settings page names the workflow node that reads each option; docs/the-rules.md and
docs/the-chart.md say what the workflows carry and what stays in code. What stays in code: the machine and its
states, the laws, the briefing and the owed pauses, the skills, the shell runner, delivery, and the few feature
listeners that read what no check reads (voices, git, triggers, checks, mcp, plans, sequences, questions' own tool).

Ruling, 2026-10-16 in the evening, on the user's word: no base workflow. Each state's workflow carries what every
state shares, drawn by one shared drawing off the state's own triggers, so every workflow reads whole on its own; the
walk runs the state's workflow and, beneath a pause the agent owes the journal, the workflow of the state it
interrupted, so the inbox, the holds and the waits run under Orienting, AtMark and LoadingSkill. An unedited shipped
workflow is redrawn at boot when the shipping's drawings are newer (`chart.drawings_version`); an edited one is the
user's and stays. The former base is retired at boot like the older shape.

Found on 2026-10-16 in the evening, from the hook's own entries: Claude Code's MessageDisplay hook delivers only a
turn's last text block; a block followed by a tool call in the same turn never reaches it. So the journal reads the
agent's transcript at every other hook (`hooks/transcript_turns.py`, through the provider's `texts_written`), from
the byte it left off at, and handles each block written since as a whole turn before the hook's own event; a reply
written before a command answers its message at that command. The display hook's copy of the last block is matched
by its visible words and recorded once. Codex has no transcript reading yet: its replies still come only from the
display hook.

File edits are rows since 2026-10-16 in the evening, on the user's word: `Edit` is a model (`models/edit.py`), written
by the edits feature when an editing tool finishes (`features/edits`, blocking so the pane's next poll sees it) and by
the shell command for the files a part changed; the last five hundred per environment stay (`repositories/edits.py`);
the edits endpoint reads the rows, so the File edits pane shows the same after a return to the journal.

State changes on the agent's events, 2026-10-16 late: the wait lifted by the agent's own tool use moved from the
Expecting and Stuck states into their workflows (trigger Tool about to run, check The agent's own tool use, action
Release), Stuck gaining a shipped workflow of its own; the states keep only their data. What a state class still
decides on an agent event: Working's bookkeeping of edits and reminders, the owed pauses' refusals, and the word
from the user that frees any wait, which stays in the engine as the way out of an emptied workflow (task 139).
The moves the commands make, a task started, a worker dispatched, a question asked, a sequence stepped, stay
theirs. A workflow's move enters idle, or lays expecting or stuck over the agent's state (task 200).

Ruling, 2026-10-16 at night, on the user's word: one workflow per state per trigger. A chart is bound to a state at an
event and holds that one trigger; the pair has one workflow, forty of them shipped (seven states at the shared events
plus each state's own), titled "Idle at Agent stops" and so on; the walk runs the workflow of the agent's state at
the event, through the state's parents, then the state beneath an owed pause; a workflow of the user's own is for a
pair no default covers. The per-state shape and the older per-event shape retire at boot. The page was designed by
Mr. Eames in Claude Design through two critique rounds and a third cut short on the user's word (the critics are
not to be dispatched afresh per round, and a design needs no three rounds), then built to the orchestrator's own
judgement on 2026-10-16: two lists, states with mark strips and events with their status words, the one workflow
per pair, Turn off and on by the trigger, Start a workflow here and Make its own, faults under the bar by step,
the stale save naming who saved first, Recent runs as a side panel lighting a run's path, the phone the same
through its sheets; the pair logic lives in web/domain/workflowPairs.js for both. The server serves the states
with parents, edited and failed flags, off and on, faults as {node, words}, fillers, a tried flag per trigger
and runs with their nodes; row events are titled in the model's own noun with the right article.

The Profiles page, 2026-10-16 on the user's word (task 209): the agent profiles in .claude/agents listed in the
sidebar after Workflows, each with its model and how often and when last the agent dispatched it (counted from the
Agent tool's calls by subagent_type), opened in a side panel that edits when it is used (the description), its
tools, its model and its instructions, and New profile; the server reads and writes the front-matter files through
ProfileFiles and serves them at /journal/profiles. The journal's own three (researcher, planner, debugger) are marked
shipped and setup puts them back. The critic profile is gone and the designer profile has no critique rounds: a
design is one designer's work, judged by the orchestrator against what the user wants.

Worker reuse, 2026-10-16 on the user's word (task 210), as version 3 reused them since plan 21 (2026-10-21): a
worker keeps the provider's session of its last run, saved the moment the run prints it, and `journal worker send
<n> "<next job>"` gives a worker that reported, or was stopped, its next job in that session and its own worktree
and branch, so its memory of the last job comes with it; each send counts one reuse on its row. A worker still out
takes a message in its live session with `journal worker notify`, Claude only. A dispatch whose brief names files
an idle worker's branch touched is refused in favour of that worker unless `--fresh`, and a dispatch past
workers.idle_kept workers of one profile is refused while one of them is idle; reviewers start fresh. Retiring an
idle worker asks whether it could be reused and keeps the --why as its reason. A worker out silent for twenty
minutes is named once. A worker reaches only its own dispatcher's other workers, with `journal worker peers`, send
and notify. Subagents are rows written from the hook entries: the census counts the running ones against
workers.most_subagents, `journal worker list` shows them, a job on files an idle subagent read is refused with its
SendMessage line, and `journal subagent retire` lets one go.

The plan state, 2026-10-16 at night on the user's word (tasks 211 to 213): Following a plan holds the agent for the
plan's whole life. A checkpoint stands in the plan's state with no task in hand, said as "plan N, readings at a
checkpoint"; the checkpoint branch moved from Idle's stop workflow into Following a plan's own stop and start
workflows, beside the carry-on; Idle keeps nothing of plans. A plan parked or cancelled sends its follower back to
rest; a session that starts at rest while a plan is started follows it, beneath its orienting pause, at the plan's
task in hand. Every wait and a sequence are pauses that keep the state they left, so they return to the plan. A
sequence ends by its own last step and is no wait a workflow must release, so the wait warning leaves it alone.
Every state names itself (title on the class) and the states catalogue lists them all with their parents, so the
Workflows page shows every state the engine has, from the engine and not from a hand-written list; its lists are
headed State and Event and a state's row is its name and its marks. A child state ships only its own events, so
its shared-only workflows never shadow the parent's.

Counts, 2026-10-16 at night on the user's word (task 214): a workflow keeps named numbers for an agent between
events, as rows (models/count.py): Start a count puts one at nought, Count one adds one, and the checks Is a count
over N and Is a count at N read it, the text naming the count then the number or a setting. The user's rule: every
behaviour laid out in a workflow, nothing hidden in a check; task 215 rewrites the shipped conduct onto counts and
retires the hidden tool-use and edit counters, and task 216 is the proposal for moving the engine's remaining state
into workflows.

One line per port, 2026-10-16 at night on the user's word (task 217): a trigger and an action lead on by one line,
a check by one yes and one no, so a workflow is one path read top to bottom and nothing runs side by side; a
second line from a port is refused on save and replaced by command. The shipped workflows chain the state's own
steps first and the event's shared conduct after, every open end joined to the next part (DRAWINGS_VERSION 7). A
step that raises is recorded and passed by its no or then line, so one broken step never silences the chain.
The proposal for moving the engine's state into workflows is report 4, adjusted after four agents' discussion
as report 5; it waits on the user's word before a plan.

Plan 7, Everything through the workflow, approved on 2026-10-16 late at night after the user redrew the model
(messages 1133 to 1143) and three Opus reads were folded in: a workflow answers one trigger and is bound to a state
or to none (always); an event's workflows run in the place order the user drags; the laws and guards become locked
workflows at the head; Run no later workflows ends an event's walk; Orienting, Loading a skill and At a context mark become facts
the agent owes. Phase one so far: a shipped workflow remembers its shipping (drawn_version) and an edited one the
shipping moved past is kept and told so; shipped workflows are named after their drawing (state:event), a retired
one is remembered and reset by state and event draws it back; Chart.place orders an event's workflows, a state is
optional, the walk runs the event's list in order with the nearest state in the lineage replacing its parents';
one move per event, the first hold wins and later holds are recorded unanswered, the new state's workflows run at
their place after a move, the waits are placed before the states they go back to; a Run no later workflows node ends the event's
walk, warned on save for what it skips; the order endpoint and chart order take an event's list at the revisions
read, refusing a stale one naming who saved first; the page is an event list and the event's ordered list, dragged
to reorder, filtered by state; a locked workflow or step is the journal's law: the seed draws the holds locked, a
locked workflow keeps the head of its event's list and is neither deleted nor turned off, a locked step is neither
taken out, reworded (its numbers may change) nor gated by a check or a Run no later workflows of the user's, and the
DRAWINGS_VERSION bump that locks the holds in a readings journal came with the Always workflows: the tool conduct
is the locked the guards at Tool about to run (whole, the holds and the naming around them, since one path cannot be
split), the inbox and the message named are Always workflows per shared event after the locked ones, a state's
shipped workflow carries only its own steps and a state with nothing own at an event ships none there, a readings
journal's copies are released at boot (unedited gone, edited kept as the user's with the shared nodes stripped),
and A message is updated has no conduct to ship, so no Always workflow stands there yet.

Phase one closed on 2026-10-16 late: the counts replaced the engine's hidden counters. Is a count at every Nth joined
the count checks; the row checks Message just read, Task just started by this agent and Log is for the task in hand
read the event's row; counts are the engine's own table, walked by no row event, gone with the session; Always at A
message is created starts uses and namings, the Always workflow at A message is updated (now shipped) starts owed at the first
read owed; the guards count uses, owed and namings on the canvas and Working counts its edits, a held write not
counted, started at nought by a task start and a log line; Working keeps no edits or reminders and the seven counter
checks are gone from the catalogue, a user's workflow naming one rewritten to its count check at boot with the
title saying so, a Working agent's edits carried once into its count; the replays record the counts and were
re-frozen from the workflows, differing by the counts alone, with count_survives_events added; the rules reworded.
A task start moves the agent before the row is written, so the row's walk reads Working. A second boot on a seeded
journal is a no-op (tested). The suite: 230 tests, 16 s of CPU, 35 s of wall on a box at load 5, replays 40 in
about three minutes.

Phase two, in progress on 2026-10-16 late: what the agent owes is a fact on its row. Agent.oriented (false from a
start until journal environment here) and mark_owed (the mark crossed and not decided at) are columns touched
narrowly; a skill owed is a link owes:<name> from the agent, set by the Require a skill node and removed by the read
of the file; the fillers awaiting, skill_owed and skill_path read them. the Always workflow at Session starts requires the journal
skill and marks the agent unoriented, the Always workflow at Prompt sent requires the skills a prompt names, a state's workflow at
Session starts requires its own skill, every Always and Guards workflow at an agent event opens with the context mark,
the guards at Tool about to run hold a write (writes only, after the lockout of 2026-10-16) while a skill, the look or a
mark is owed, and the Always workflow at Agent stops holds a stop while anything is owed, naming it. The requiring, start and
mark listeners are deleted; the three pause states are no longer entered and retire in task 368. Decided (task 367):
a debt never changes which workflows run; it holds writes and stops only. The replays of phase two carry it. The
journal's own commands must never be held, whatever a workflow says: task 406, on the user's ruling.

Phase two closed on 2026-10-17 just after midnight: the three pause states are deleted with the owed-pause
machinery; the first migration, run at boot by the migrator the app now wires, unwraps an agent readings in one
of them with its fact set; a user's workflow bound to one is kept off and named; the holds hold under Codex as
under Claude; CLAUDE.md names the facts beside the state and the pauses as the waits; DRAWINGS_VERSION 9. The
suite: 237 tests, 19 s of CPU and 38 s of wall on a loaded box; the replays: 46 in about twenty seconds now that
no pause state wraps another. The checkpoint note is report 7 on the plan. The dev journal
re-seeded itself at the bump: 9 states, 28 workflows, none behind. The lockout of 2026-10-16 (a skill hold that
held the read paying it) is fixed in the guards and floored by task 406, still open.

Phase three of plan 7, closed on 2026-10-17 in the small hours: the replays for plans and workers, the clock, the
pauses' exits and Ended, and a session's start and end were frozen before anything moved (tasks 372 to 375), and
stand green after it, 58 in about twenty seconds. Send the agent back to what it was doing releases any pause to
the state its resume keeps (376); a state change is named by its outcome, Wait for something outside, Mark the
agent stuck, Change state to Idle, with a wordless wait or stuck refused at the save and a change to Idle from a
state that owns something refused as before; move_to is gone and an older workflow naming a state is rewritten at
boot (377). Ended ships a workflow with its trigger alone, titled Does nothing yet (378). The page shows a run's
state change in words, the answer the agent was given, the number a count check read, and a card's details in
reading mode; Test run says the order and where it would stop, with a dry count ledger (379, 380, 413). The rules
doc is reworded (381). On the user's rulings of the same night: the engine's own moves are not workflows and are
not shown on the page at all (415, after 379 had shown them in grey); delivering a message to the agent is the
engine's, so the two Always workflows at a message's creation and reading are gone and the messages feature types
and counts itself (416); every shipped workflow is titled by what it does (411); every label, title and line is
plain English, swept by a reading subagent and fixed in two commits (412), and CLAUDE.md carries both rules, Plain
English and Workflows drive the agent, the engine keeps it safe, the latter around the test "would a user want it
different, or want to watch it happen". Task 414 sorts the plan's remaining phases by that test before phase four
closes: 388 to 393, 398 and 399 are engine behaviour, 385, 395, 396, 397 and 401 stay workflows. The floor of 406
is in: a journal command and a skill's read are never held. The suite: 245 tests; the replays: 58.

Phase four of plan 7, closed on 2026-10-17 before dawn: each feature declares the checks and actions a workflow
may name, beside its states and nudges, and the chart's catalogue gathers them from the registry and defines none
itself, Entry having moved up to features/entry.py (383); a blocking listener that raises fails open, with an entry
guard_failed, a card in the chat and a line to the agent, and the law text says a hold is never the result of a
fault (384); the content checks Tool is one of, Tool input contains, Prompt contains, Time of day within and
Context over N percent read the event's own content, answered the same for Claude and Codex in one bounded test
(385); a check on time takes its unit and the shipped workflows say minutes, DRAWINGS_VERSION 10 (386); the phone
shows the locks and a card's own number in its title. Phase five has nothing to build: its guards are engine
behaviour by the user's ruling and stay where they are, listed under Kept in code. The suite: 248 tests; the
replays: 58; the dev journal after the restart: 9 states, 27 shipped workflows, none behind, 142 catalogue entries.

Phase five had nothing to build: its guards are engine behaviour by the user's ruling. Phase six of plan 7, closed on
2026-10-17 in the night, turned on the user's rulings of the evening: one concern per workflow in the run order, a held
stop and Run no later workflows ending the walk, a child state running its parent's workflows after its own, the
agent's debts each feature's own code, the counts read from the journal's record and kept by no workflow, two Opus
reviewers' findings applied (task 417). The start block was the Always workflow Tell the agent the journal's rules,
facts and what waits (395) until task 842 made it the engine's, the briefing feature's StartBriefing; the voice is its own workflow (396); the fiftieth-line reminder a workflow at Post tool use
reading the lines said since the last one (397); the silent session's end and the delivery retype stay the engine's
(398, 399); what is unread at a start is delivery (on message 1672). Alongside: the agent events take the providers'
hook names (425), titles say their settings' numbers (424), a card's run-ending steps carry the no later workflows
badge (418, 426), the menu watcher answers Claude Code's menus by the user's rules (420), a start after a compaction
says where the work stands (409), old facts are asked about once a day (410), and a cancel stamps a task finished so
the sidebar counts only open tasks (on message 1729). The rules table is final: every row names its workflow by title
or says the engine keeps it. The suite: 250 tests; the replays: 56.

## The thin supervisor (plan 8, 2026-10-18)

Who owns what, decided at the start of the plan (task 443) on the rulings of messages 1611, 1613 and 1616 and the review in report 11:

- One supervisor runs per agent terminal, as now. The one launched with the journal hosts it: the journal server is a named process in its table. A supervisor started with --no-journal runs its agent only.
- The supervisor starts what its launch file lists, the agent and, on the host, the journal. Once up, the journal asks its host to start the services it declares. Starting a name that is already running does nothing, so a journal restart starts nothing twice. The journal never asks to start itself.
- Every process lives as long as its supervisor: when the host ends, its journal and services end with it, as the journal does today when its parent is gone, and the next launch hosts them again.
- Workers stay outside the protocol: the journal runs them itself.
- Nothing but the agent's own end, or a stop asked for, ends a supervisor (message 6316): a fault in a verb is answered with why, a fault in a turn of the loop is skipped, and each is written to runtime/supervisor.log. A service's group is signalled only while its leader runs, never the group of a process reaped long before.
- send stays in the protocol: it is the message bus of message 1613; its first user comes with a later service.
- "Never another restart" covers new processes and the protocol growing by versioned verbs. The supervisor imports every module at start, so an upgrade that overwrites its files leaves a running one untouched (task 438, a test); since task 1169 a fix to it lands at the end of the agent's next turn, through the launcher's loop (see The launcher's loop below).
- The menu watcher stays a thread in the journal server (question 6, the user's answer): it reads every environment's mirror and shares what it chose with SupervisorLink in memory. Phase 3 proves services through the protocol with the next real one, or a fake one in its test.

The protocol, first version (tasks 436, 437, 439):

- One stream socket per supervisor, in /tmp/journal-<uid>/, a folder only the user can open, the socket itself 0600. A request is one line of JSON, {"verb": ..., ...}; the reply is one line, {"ok": true, ...} or {"ok": false, "error": "<plain words>"}. An unknown verb or a malformed request is answered with an error and the supervisor stays up.
- The announce file runtime/inboxes/<environment> holds {"socket": <path>, "protocol": 1}. An announce file holding a bare path is the old supervisor, which takes the old datagrams (Type, Keys, Stop, RestartAgent, RestartJournal); SupervisorLink speaks to each in its own way until the one restart, then the old way is removed.
- hello answers {"protocol": 1, "verbs": [...]}. The verbs are hello, start, stop, restart, list, keys, type and send. A later version adds verbs and never changes one, so a journal asks hello before using a verb it is not sure of.
- The supervisor's process in front is the one that owns the user's terminal: it gets the keyboard, the resize and the band, and when it ends the supervisor ends, taking every process it started with it.
- send carries text to a named process's input: a service's, or the agent's terminal. The agent is the only terminal process; one started beside it, with its own mirror under runtime/screens, waits for its first user.
- The agent in front owns the terminal: the keyboard, the resize and the band; a restart of it through the protocol fits it again. When it ends, or the journal stops it, the supervisor ends and takes its services, its inbox and its mirror with it, so no stale screen is read. Stopping the agent is the viewer's Stop, a deliberate act; nothing guards it further.
- Features declare the services they need (Service, a name and a module of the package); at boot the journal asks the supervisor hosting it, the environment the launch names in JOURNAL_ENV, to start each. An upgrade restarts the journal, so a new service starts with it and the supervisor runs on. A journal no supervisor hosts, under plain claude or a worker's, starts none and its log says which are off. Workers stay outside the protocol: the journal runs them itself.

## The launcher's loop (task 1169, 2026-10-21)

On messages 11891 and 11894:

- The launcher is `src/supervisor/launcher.sh`, a shell loop of a few lines that never changes and loads no code. It runs `python -m supervisor <launch file>`, starts it again whenever it exits, after a second, and exits when the supervisor exits 0. The journal's Python launch (`Launch.supervise`) runs the loop and waits, then puts the other hooks back and removes the launch file, as before.
- The supervisor's exit codes: 0 (ENDED) when its agent is done: the agent quit, died three times in two minutes, or was stopped, a SIGTERM or a hang-up; also a launch file it cannot read, which would fail again. 75 (RESTART) for its own restart. Any other code, a crash, starts it again too. The agent's own exit code is no longer passed up.
- `restart` with the name `supervisor` (and `resume`, else the conversation running) is the supervisor's own restart: it writes the conversation to resume into the launch file's `front.resume`, stops the agent and every service, and exits 75. The next supervisor starts from the launch file: the agent resumed on its conversation, the journal as a service, and the journal at boot asks again for the services the features declare. A restart of the agent alone writes its resume into the launch file too, so a supervisor started again after a crash resumes the newest conversation.
- `hello` answers `outdated`: whether the supervisor's code on disk (a hash of its `*.py`, `SourceHash`) differs from the code it started with. The supervisor hashes itself, so the journal imports nothing of the supervisor package.
- When it is restarted: at the journal's boot the updates feature's seed `SupervisorCheck` asks each environment's announced supervisor once and keeps the outdated ones (`OutdatedSupervisors`); `SupervisorUpgrade` restarts a kept one at the end of its agent's turn, never in the middle of one, and once. A journal boots after every launch, `journal setup restart` and update, so the answer is fresh where the code can have changed, and no Stop asks anything. An environment with no supervisor announced, or one from before the protocol, is not outdated and is never asked. `journal setup restart` and an update restart the journal at once as before; the supervisor follows at the agent's next turn end, so its code changes land without a new launch. A supervisor from before task 1169 answers no `outdated` and is left as it is until the next launch.

## A reply the transcript never kept (2026-10-17)

A text block written just before a tool call reaches the journal only through the agent's transcript, which the journal reads at every hook. Claude Code sometimes does not save such a block at all: replies to messages 1787, 1795 and 1814 of this session are in no transcript file, while 1790's is. The journal cannot record what never arrives, so the answer hold names `journal message send "<words>" --reply-to N`, which always counts, and the messages skill says why (task 457).

## Secrets (plan 9, 2026-10-17)

A secret is a key or a login the agent may use without seeing it. The row (models/secret.py) holds its fields, which are filled, the programs it may go to and those proposed, whether helpers may have it, and its login's times; never a value. The values live in a NAME="value" file in the private folder (private_folder.py, secret_values.py), named by the project's .journal/project-id, 0600 in a 0700 folder with a .gitignore of *; AGENT_JOURNAL_SECRETS moves it. Secrets kept as files under .journal/project/secret come in as rows once at boot.

Engine, kept in code because no user would want them different: masking every text the connection writes (db/masks.py) and every form of a value in a program's output (features/secrets/output_mask.py); the allow-list, the never-given programs and the search path without the project (features/secrets/programs.py, secret_run.py); the guard that refuses the agent's tools the secrets folder and the MCP keys (listeners/keep_out_of_private.py); telling the agent a program was allowed (listeners/tell_allowed.py); the leak alarm card (listeners/alarm_on_leak.py); the thirty-day purge. A workflow a user may shape: none yet; a nudge to use `journal secret run` at a tool use that names a key would be one.

The agent proposes a program (`journal secret propose`), the user allows it on the Secrets page; no command takes a value, the user fills it on the page. How the viewer proves it is the user is question 8, open.

## A workflow's counts (plan 12, 2026-10-17)

(Superseded where it says per agent or names the readings: see Workflow parts, plan 18, below.)

- A workflow keeps its own counts for each agent, named `charts:<id>:<name>` in the counts table (question 9:
  no sharing by name across workflows). A count started at one event and counted at another is one workflow with
  a trigger for each event (question 10); `Charts.for_event` lists a workflow under every event it holds a
  trigger for.
- Every event still walks a workflow from its trigger; a run never resumes at a node (the three readers of
  report 18 showed resuming skips the count it waits on). Waiting is drawn: Wait here until a count reaches N.
- The readings (edits, uses, owed, namings, lines) stay the journal's, read from the record, and are shown on the
  canvas with what they count; a count may not take a reading's name.
- Raising, starting and setting a count happen in one database transaction; a lock around the walk deadlocked
  against a row's save, which walks its workflows inside the transaction.
- The walk entry records where each path ended with the workflow's counts (`stops`); `GET /journal/chart/<n>/readings`
  serves each agent's last stop, its counts, readings and the numbers checks compare with.
- A count no node names any more is cleared with a card; a user's workflow reading another's count is turned off at
  boot; migration 6 cleared counts of the old shape.
- The replays record what the count checks read in each step, so a change in a reading fails them.

## Plugins (plan 11, 2026-10-17)

The protocol, the manifest and the version 3 mapping are in docs/plugins.md. Decided while building it:

- One listener per kind of event, on the bus from boot, reads the enabled plugins at each event. There is no
  Bus.unlisten, so switching a plugin off between two events neither drops nor doubles one.
- A plugin holds an event only inside the window its manifest declares, `{"event": "tool_starting", "window_ms": 5}`,
  cut to the ceiling `plugins.hold_window_ms` (50 ms); a bare event name takes the ceiling. A hold that fast is answered
  by the plugin's service from what it already knows; judging and sins run on the plugin's own time and ride on the
  next hook. One past its window is cut, its answer dropped and the miss recorded as unanswered, never a fault, so it is asked again next time (messages 11346, 11408; doc 61). This replaced the one shared
  deadline of six seconds on 2026-10-21.
- A plugin's queue (message 11346, task 1142): the folder `queue` under its data folder, one `.json` file per line out
  with `env`, drained at every hook on the answer path, a line for the hook's environment riding on it; a plugin that
  judges asynchronously writes there and never holds. One parser for a queued file and an answer: the protocol's.
- A plugin is asked to hold only while nothing has held the event yet (`asked_while_free` on the listener). After that
  it hears the event after the reply, and a refusal then is recorded as `plugin_unanswered`.
- A stop is held once a turn: Idle carries `held_before` from `stop_hook_active`. There is no count of four in a row.
- The plugin token is made per server run and kept only in the server's memory, never in a column.
- A plugin's message is the journal's side of the chat (`Author.of`). Plan approve still refuses anyone but you.
- Plugin commands carry a step count in a context variable. A row written two steps deep is heard by no plugin, and
  a `plugin_cut` entry records it.
- `plugin.updated` is delivered to a plugin alone when someone else changes its settings. Install writes the settings
  once, so a plugin hears it only on a later change.
- Only the user installs, switches on or configures. The agent upgrades a plugin already installed (message 6307), and
  proposes a new one with `journal plugin propose`. The
  agent's writes into `.journal/plugins` are held. A linked folder is not held, since it is the user's own working copy
  (code-commandments is one); the hash check switches the plugin off when its program changes.
- Services run per environment, one copy under each running supervisor, each on a short socket path in /tmp. The
  program answers when no supervisor runs or the socket is gone.
- A dashboard is lines the plugin writes (`journal dashboard set`), drawn by the viewer's own dashboard. No plugin page
  runs in the viewer.
- A keyed card settles the earlier one in place. A plugin's plain message is drawn as a card of the plugin's.
- What a plugin did is its record: the entries it left (`plugin_said`, `plugin_command`, `plugin_fault`,
  `plugin_unanswered`) and every row change stamped with it.
- Requiring a plugin's skill in a state waits for a workflow action that names a skill.
- The console captures each command's output per context (CapturedStream) and runs commands side by side. A plugin's
  setup step or installed command may itself run `journal` commands while `journal plugin install` runs.

## Rulings of 2026-10-18

- Triggers are engine code. A user trigger never becomes a workflow of its own (message 3400); the Triggers page stays
  as it is.
- Documents are project-wide, never per environment (message 3311): `Doc` is a `Model`, read from every environment; the Documents page also lists the files attached to messages, and its search reads every document.
- The supervisor starts an agent that dies again, resuming its session, and keeps the journal and the services
  running; a clean exit still ends it (message 3331).
- The supervisor stays a very thin process host; a change to it needs the whole process started again, so changes to
  it are kept rare and every other behaviour lives in the journal (message 3423).

## The package's layers, after the sin sweep (2026-10-19, task 598)

Code commandments judges `src/journal` clean (657 files). Decided on the way:

- The packages import one way: `models` and `events` at the bottom, then `db` and `repositories`, `engine`, `providers`,
  `features`, `hooks`, `http` and `console`, with `app.py`, `runtime.py` and `service_start.py` at the top. The bus,
  `Listener`, `AgentListener` and `Decision` live in `events/`; `Said`, `Nudge` and `Deferred` in `engine/`; `Option` in
  `models/`; `Hook` and `HookKind` in `providers/`; `PluginRefusalExemption` in `features/`. The runtime and the service start wire the
  features, so they sit beside `app.py`, not in `engine/`: the engine imports nothing from `features/`, and asks
  `FeaturesKnown` (its protocol, which `Registry` implements) for the states and whether a line is switched off.
  CLAUDE.md still lists the runtime among what the engine holds; that line is the user's to change.
- A skill an agent owes is a fact on its row, `skills_owed`, like `oriented` and `mark_owed` (migration 7 moves the old
  one-ended links); a link always has both ends.
- What crosses into the journal is typed where it enters: the viewer's act body (`ActionBody`), a drawing
  (`DrawnNode`, `DrawnLine`), a walk entry (`WalkRecord`, `WalkStop`, `WalkFailure`), a plugin's manifest, settings,
  answer and preview, a transcript row (`ClaudeRow`, `CodexRow`), the supervisor's announcement and replies, the MCP
  check (`HealthReport`). What the page reads back is a `TypedDict` where it is a JSON shape.
- code-commandments v5.19.3: an attribute that overrides a base class's `ClassVar` is a constant, so a feature's
  nudges built from its `name` are in order.

- **Updates (task 28).** `features/updates`: `Updating` reads the v4.* tags from GitHub at most hourly on a thread of its own (first look a minute after boot), and with `updates.auto` on installs the newest release of the same major by running its `install.sh` (`AGENT_JOURNAL_REF`, `AGENT_JOURNAL_YES`) from the project root; the install's own `journal setup` restarts the journal. The code-commandments plugin, when installed, is upgraded first through `Installing.upgrade`. The viewer's `/releases`, `/update` and `/changelog` are in `http/v3/updates_controller.py`. Open: the plugin is pulled to its newest commit, not its newest tag; `src/web/dist` needs a rebuild for the new UpgradeBand.

## Dumps (ported from version 3, 2026-10-19)

`features/dumps`: a `Dump` model and `Dumps` repository, `Filing` (everything done to a dump, shared by the `journal dump` command and the viewer's `DumpActions` in `http/v3`), five listeners that tell the agent (arrival, answer, choice, filed, carry on), and the `journal-dumps` skill. Files are kept under `config.files/dump/<n>`.
- Decided: no collections. Version 4 has no Collection model, so the dump itself is the collection: `journal dump name` renames it, and each row the agent files is a `dump_filed` link from the dump to the row. Removing a dump deletes the docs, reports, tasks and plans linked to it that were made after it was dropped.
- Left out for now: a pasted transcript becoming a dump (needs the message kind transcript); an offered step that runs a command (offers are `{ask, label}` only).

## Rulings of 2026-10-19

- Every read of a scoped model is scoped in the base repository (`ScopedRepository.selected`); no repository writes
  `environment_id = ?` by hand. A read with no environment set is refused. A read across environments says so by
  name: `across_environments`, `selected_everywhere`, `agents.everywhere()`, `with_project` for the project's own rows.
  A seed whose rows belong to environments is an `EnvironmentSeed`, run once inside each environment's scope.
- The supervisor restarts a kept service however often it dies, the wait capped at 30 seconds; it never gives up.
- Workflows are behaviour toward the agent only: keeping it going, holding its stop, nudging it. A hint on a command's
  output is the engine's (a feature's listener), never a workflow's, and no workflow changes a command's output.
- Sorting a dump is a state of the engine (`SortingDump`, a pause), not a sequence and not a workflow: a dump the user
  drops moves the agent into it, the stop is held until the dump is filed, save while the user's answer is awaited.
- A blocked task never blocks its plan; a plan whose every task left is blocked blocks itself and opens when one opens.
  `journal plan block` and `journal task block` take `--on` and `--until "<command>"`; an `--until` command is a check
  kept off the lists, and one that cannot run holds every stop with its error.
- A face on a message answers it, whatever its length. A line the user types in the agent's terminal is their message
  in the chat, read already and never owed a tagged answer.
- A question's options name who acts, the agent or the user, never I, we or you.
- Docstrings: one short line at the top of a class; none on fields or methods.
- Helper classes leave their domain's folder: `<domain>/support/` when only that domain uses them, `src/journal/support/`
  when several do (task 729, after the viewer's API is moved).
- An agent marked ended after an hour's silence comes back the moment it takes a prompt or uses a tool; the machine
  refuses an agent with no session.
- A worker outlives a restart of the journal: its output goes to files, its process id is on its row, and at boot every
  worker still out is watched again.
- Words the hooks missed are swept from the transcript each tick, read on from the hooks' own position past the
  seconds the hooks have (`messages.sweep_after`, 10 by default).

## Rulings of 2026-10-20

- A workflow is self-contained: it checks every condition it acts on itself, auto mode among them, and never counts on
  an earlier workflow stopping the walk to keep it from acting. Stop the later workflows (formerly Run no later
  workflows) is a side effect a workflow may opt into. The shipped checkpoint wait checks auto mode is off, the
  carry-on and the log ask check a task is in hand, and no shipped workflow stops the later ones any more (message 7165).
- The state of an agent that ran `journal await` is named Waiting, beside Waiting on a question and Waiting on a worker.
- A setting's help says what it does in plain words; the workflows that read it show under it as links (message 7014).
- Tunler's version and domains, and the MCP servers' check, are kept for an hour and asked again after a change.
- The phone (plan 17) ports version 3's server side as it was, which worked; its screens are the viewer's own pages
  and components with phone styling, not version 3's separate app; only what touch needs gets a phone component
  (messages 7314, 7327; tasks 901 to 903). Plan 17 may be merged by the agent once landed and tested, and released as
  4.2.0; plan 18 waits for Sir Jesse to merge (message 7301).
- The phone after its review (task 909): a phone's reads are named one by one, as its writes are, never every read
  but a few; no read that starts a program (the MCP check) and no page that sets how the journal runs. A project file
  is never read from a hidden folder (.env, .journal) nor outside the project, on the desk too. The push keys live in
  the private folder beside the MCP keys. The clock closes the tunnel once a code or a phone runs out, and a paired
  phone keeps the tunnel, and its button in the top bar, even with sharing off. The phone sends text only: a file is
  attached on the computer. A failed push is tried again a minute later; an address the service no longer knows is
  forgotten. A file opened on the phone is sandboxed. Left as it is: anyone who reaches the tunnel can void an open
  pairing code with ten wrong tries; the user makes another, and a code lives ten minutes.

## Rulings of 2026-10-20, evening (on the development branch)

- The journal follows a branch when Settings, Updates, Follow this branch names one, or `journal update follow
  <branch>`: the check reads the branch's head on GitHub and compares it with the commit the installer recorded in
  `.journal/src/commit`; only a pushed commit counts, never a working tree. This checkout's journal follows
  development.
- Lines typed to the agent go at most once a window, `delivery.batch_seconds` (5): a line within the window of the
  last is held in the typing funnel, SupervisorLink.type, never in a workflow, and the tick types the held lines as
  one marked line, the instructions joined with " | ". The window and the hold until a line is seen back are the
  same hold; 0 types each line at once, which the tests about other conduct set.
- A settings save from the viewer names only the keys it sets, null clearing one; the server never unsets a key
  by its absence. Before, a pane layout or colour scheme save dropped every other viewer key, the tour's finished
  mark among them, so the tour replayed after every update.
- A pin above the chat whose link is a row's ref (`--link docs:55`), or the journal's own address opening one,
  opens the row in place as its card does; an outside address opens a new tab.
- A comment on a document's passage is read with the passage: `journal message read` prints the quoted lines under
  the comment when the message is no reply; a reply's quote of the message it answers is still left out.
- The chart goes (task 979, plan 19, doc 55): the states carry the journal's conduct on a stack machine. Settled
  with Sir Jesse in messages 9364 to 9427: a stack of states with push and pop, the trail; one BaseState with the
  mechanism and the shared listeners (compaction pushes Compacting, the session's end pushes Ended); listeners are
  methods named on_<moment>, bound to their event by the annotation and found by type, overridden on purpose; a
  journal panic command always allowed; Tuning as a frozen readings of the options; Readings on the stop and the
  tick. Plan 19 waits for his approval. Later the same evening (messages 9491 to 9516): only the states move the
  agent, answering events; a command writes rows and the feature dispatches a named event beside the write
  (PlanStarted, TaskClosed, QuestionAnswered, WorkerBack), and a state never reads a row as it was before; the
  state machine is the engine's alone, `journal panic` the one hand on it from outside; the class is StateMachine;
  the options reach a state as a frozen Settings value; the lifecycle hooks on_push, on_suspend, on_resume and
  on_pop are always called, and on_push may refuse the push; no docstring and no comment inside a method, and none
  on a field, a class keeps its one line at the top. Six reviews of plan 19 (four on Opus by phase, two critiques)
  were filed into it the same night: 40 tasks, 24 briefs rewritten, the phases retitled, phase 2 in three steps
  each ending with the replays green, the repositories and the judge before the live check and the pull request.
- Also that evening: JOURNAL_ACTOR (agent, sub-agent, worker-agent) read by the hook and command shims, a hook with
  a subagent's agent_id returning at once; a subagent's shell is the agent's whole, so its commands are told apart
  by the server later (task 1032), for Codex by the thread id; the journal's own update installs the journal and
  nothing else, never a plugin, and takes its marker down when its thread fails; five plain-code-words rules under
  .commandments/custom (poetic names, docstrings in methods and under fields, the state machine outside the engine),
  1591 findings left for the rewrite by Sir Jesse's word; the worker and subagent chat draws the same Turn bubbles
  as the main chat, from transcript turns shaped like messages (kind and text).

## Workflow parts (plan 18, 2026-10-20)

- Sir Jesse's answers (message 7237): a workflow's values are kept per environment, in its own record, and no
  workflow reads another's. Counts and times are rows named `charts:<workflow>:<name>` (ValueName, one home), in
  the counts and noted_times tables, kept out of the timeline since they change on nearly every tool use.
- A value lives as long as its workflow: a session's end, a restart, a takeover and an edit that keeps its step
  leave it; the last step naming it gone, a reset or a deletion clear it, in every environment. Two agents in one
  environment share its values; a row event sets a value once however many agents it walks about.
- Times are read through Clock.now(), which every tick, log time and background check reads too, so the replays
  drive one clock. A time never noted has no since: Has N passed since a noted time? answers no, and Was a time
  noted? says so. Has N passed is at least N, as the quiet check it replaces was.
- A workflow's place is per event it holds a trigger for, on its own record (Chart.places), kept in step with its
  triggers; a row per event was not made, since it would need a link back to its workflow and the places are the
  workflow's own data. Chart.event stays the event it was made for, the key a shipped drawing is known by.
- The shipped workflows are drawn from parts (DRAWINGS_VERSION 28). Each quiet clock is still bound to its state and
  notes its time on the move that starts its wait and on the agent's own session start, prompt, tool use and stop;
  quiet now means no event of the agent's own, where it meant no change to the agent's row. A reminder repeats by
  its line's repeat window, as before, not by noting its time again. The log ask forgets its time for a task a plan
  took in hand (Follows a plan?), so it asks at once as an empty Working.logged_at did. The log ask's start trigger
  now belongs to the stop's workflow, so at a session start the log line comes before carry on: the one change in
  what the agent is told, and only in order.
- Retired: Has the agent been quiet for N?, Is the log older than N?, Has a command run in the background longer
  than N?, and the readings edits, uses, owed, namings and lines. A user's workflow, or an edited shipped copy,
  naming one is stopped at boot with its title saying which; it is not rewritten to the parts, since a clock needs
  triggers the user's drawing does not have. At the upgrade the times are seeded from what the retired checks read
  (ValuesAtUpgrade); counts start at zero.
- Journal line said and the others no row speaks for are agent events (Await, Command moved to the background,
  Background command ended, Commit made); a task's or a message's move is its row's trigger with a check naming
  the move. A path from Journal line said may not say a line, or it would start itself again.
- The run order changes in a mode of its own on its column, since the page's Edit folds the lists for the canvas.
  The workflows page stays on the computer, as the phone leaves every page that sets how the journal runs there.
- The blocked-task ask after an hour of quiet never speaks, since an hour of quiet ends the session first: task 911.
- Tool held already? sees the holds of workflows only: a write held by the engine's own debts (a skill, the look, a
  mark) or by a plugin still counts toward a workflow's writes, where the retired edits reading left it out. Left as
  it is: such a hold is paid within a step or two, and the count is at most that many ahead.
- Journal line said is told on the bus after the reply, on the worker thread, so a line said never walks inside the
  hook or the walk that said it; its walks that only count are not recorded.
- A downgrade past 4.3.0 is not supported: migrations 15 and 16 merge the agents' counts per environment and move a
  workflow's one place onto each of its events, and an older version reads neither.

## Plan 19, phase 1, as built (2026-10-20, night)

- The stack machine's values, `Stack`, `Transition`, `Held`, `Hooked`, `Settings`, `SnapshotReaders`, live under
  `engine/support/`, not `support/`: only the engine builds them, and `support/` may not import the engine. `Readings`
  is an event's payload and lives in `events/readings.py`.
- Until phase 2 moves the features' conduct, the old `AgentState` extends `BaseState` and the pause chain (`Paused.resume`)
  stays what the old states express; the stack on the agent's row is kept as its mirror: a pause that resumes the top is
  pushed on it, a resume that names the state beneath pops to it, anything else stands on its own chain with Idle at the
  floor. `StateMachine.move` is that bridge and goes with the commands' moves.
- Every change of the stack is a trail entry of kind `state`, with the stack before and after, the cause (the event's name,
  `a feature moved the agent`, or the panic command's words) and a refused push with its line; the agents page carries
  `stack` top first and `trail`.
- `journal panic` lives under `console/commands/`, since the engine imports nothing from the console; the rule that keeps
  the state machine inside the engine excepts it and `runtime.py`.
- One nudge registry (`engine/nudge_registry.py`): every feature's nudges and the engine's are registered at boot, the
  nudger refuses an unregistered one, `journal nudge list` prints them. A nudge's name says what the line does; a
  hundred and four were renamed by one map, the replay records and the shipped drawings rewritten by it.
- Twelve guard rules under the custom `stack-machine` skill and two more poetry rules (parameters and variables); the
  custom docstring rule looks at a statement's own literal. The worklist the judge writes is cleared on purpose: the
  pre-existing findings are phase 4's (task 1052).
- Phase 1's commits were pushed to `development` as they landed, since this journal follows that branch; the plan's
  "nothing pushed until the migration is proved" was not kept, and task 1053 still proves the migration on a copy before
  the pull request.
- The files of task 1002 were wiped from the working tree before their commit while a worker's commit was taken into the
  branch (task 1082); they were written again from the record.

## Plan 19, phase 2, task 1035: the speaking listeners become conduct (2026-10-21)

- Voices, etiquette, pins, migration, git, checks, triggers and plugins each have a conduct mixin and, where the lines need facts, a readings reader: the voice's instruction, the lines said since the last reminder, the pinned and lately suggested links, whether a version 3 journal waits, every trigger, the plugins folder. The listeners that said those lines are gone: IntroduceAtStart, SayVoiceWhenChanged, ReadTurn, UnpinnedLink, UnpinnedLinkInOutput, LinkSuggestions, HoldPluginFolders; the drawings say_voice, remind_what_a_line_is and tell_of_version_3 with them.
- A setting's write, a check's run and a user's message are row events the models carry: SettingChanged, CheckRan, MessageArrived. A row that is new when it carries its event has no environment or time yet, so the repository's carried() places the event by the saved row (RowEvent.placed_by); that is the one place it happens.
- A commit stays an agent event: SpotCommit records the card, closes the tasks the trailer names and dispatches CommitMade with what it closed and the task open next; the git conduct says the lines, and because they ride the reply of the command that committed (never typed, as ruled on 2026-10-17), CommitMade answers the hook and SpotCommit hands the machine's decision back. The dispatch in SpotCommit is the one agent event a feature listener makes; the DispatchOutsideFunnels rule still names it, and phase 6 gives the rule a principled reject for an agent event that answers a hook.
- The tool call carries the paths it writes (ToolStarting.written_paths, filled in the hook translation from the provider), so the plugins conduct holds a write into the plugins folder with nothing but the event and the readings.
- PluginsHearAgents stays a listener on purpose: it is the funnel through which each plugin's own words and holds reach the agent, never the journal's conduct. Watching still hands back the first step of a sequence a trigger starts; task 1034 makes sequences states and takes that line with it. Both are named by the FeatureListenerSpeaks rule until then.
- AfterAClose answers with the next open task as a value (OpenTask, in models); the task command and the git conduct each render the line from it.
- A stopped runtime takes its conducts off the base state, so a hand-built state in a test answers with its own listeners alone.

## Plan 19, phase 2, task 1059: messages, laws, shell, secrets, questions, profiles and workers speak as conduct (2026-10-21)

- Each of the seven features has a conduct mixin; the readings carries what the lines need: for messages the unread, the unanswered and the folders of their files, the agent's own tool uses since the newest message came, how often the unread were named since, and its uses while a read message stays unanswered, all derived from the entries and the nudge lines said, never kept as counts; for shell the background commands and since when, the untold ended ones, the shapes of the last reads of outputs by hand, the project's readers and the reader tips said; for workers the subagents running besides the newest dispatch, every dispatch of the session, the reports waiting and the workers' worktrees; for profiles every profile by name, the subagents' and the workers'; for secrets the private folders by every spelling.
- The four inbox workflows are one conduct: the inbox named every so many own tool uses since the newest message, a write held once the unread were named often enough, the tools held past so many uses with a read message unanswered and an answer asked for before that. A journal command and a read of the message's own files pass the unanswered hold, as before.
- A reaction (ReactionGiven, by the Reaction model), a secret let go to new programs (SecretAllowed, by the Secret model) and a worker's report (WorkerBack now names the worker and its report message) are row events; a user's message (MessageArrived) came with task 1035.
- The tool call carries the paths it reads and the lines of the file the read tool reads whole (ToolStarting.read_paths, file_lines), filled in the hook translation from the provider, so the shell conduct holds a whole read of a long file without touching the disk.
- MarkOutputsTold is the one listener left that records for the shell conduct: it marks the ended outputs told at the tick the conduct names them.
- DeliverMessage and DeliverUnreadAtStart stay the engine's delivery in the messages feature; TellInbox is their base and the FeatureListenerSpeaks rule still names it. The two one-line listeners of one body for two events (the inbox at a prompt and at a stop, the reports at a stop and on the tick) are named by the duplication rule; a listener answers one event type, so each stays.
- The ten drawings of the inbox, the reports, the background check and the report-came line are gone from the shipped chart.
- A state silences a conduct listener by defining a method of the same name: the dispatch leaves out a conduct method whose name the state or its bases have, so Awaiting answers a worker's report itself and the workers conduct's line stays quiet while the agent waits on workers.
- The custom poetic rules ban poetry, not coding words (messages 10144 to 10163): the words of speech and story, mood and magic, craft and journey, the vague fillers, and the past participles that say nothing of the thing (made, done, seen, taken, heard, noted, got, met, gone, lost). Plain coding words such as created, deleted, written, moved, pushed, fetched and merged stay. The judge found 329 such names on 2026-10-21; task 1095 in phase 6 renames them.

## Plan 19, phase 2, task 1060: the skill, look and mark debts are conduct (2026-10-21)

- The debts stay facts on the agent's row, set by recording listeners: OweSkills notes the skills a start or a prompt calls for, OweTheLookAtStart sets the look owed, TakeTheMark takes a crossed context mark. The lines and the holds are the skills, briefing and memory conducts', from the readings: which skills are owed, loaded by hash and shipped (SkillsSnapshot with the catalogue, so the conduct works out what a start or a prompt calls for with the state's own name and no repository), whether the agent has looked and what the start block names (BriefingSnapshot), the mark owed and taken and every fact, rule and reminder with its keywords (MemorySnapshot).
- The rows that pay a debt carry its event: the agent row carries LookTaken, MarkDecided and SkillRead (Agent.look_taken, mark_decided, skill_read), a rule carries RuleMade with who made it. Every row event gets the row's number on save (RowEvent.row_id, filled by the repository with the environment and the time), so a new row's event can name it.
- What a start or a prompt owes is worked out once, on SkillsSnapshot (due_at_start, named_in); the conduct says it and OweSkills records it from the same reading. The same for the mark (Memory.mark_due) and the whisper (MemorySnapshot.whispered_by): the conduct types the line, MarkWhispered shows the card.
- A transition's typed lines are typed by the machine after the event's delay, so the introduction is the voices conduct's on the session start, typed four seconds after the start block; JournalStarted and AnnounceStart are gone.
- The whisper and the question about a new rule are typed lines now, where they were the hook's context and the command's output.

## The mend after tasks 1059 and 1060 (2026-10-21, night)

- A test run that ends in a pipe reports the pipe's exit code, not pytest's: twenty failures hid behind a tail. A test run never ends in a pipe; the pytest reader (journal output read N --reader pytest) picks the failures out of the kept output.
- The tests of the chart drawings removed on purpose are gone with the drawings (twelve tests, chart-only).
- A skill read is recorded under the write lock, its event carried: Repository.rewritten(row, by, change) re-reads the row, applies the model's change, writes what differs and carries the events, so two reads sent together both stay.
- A prompt typed in the terminal is watched as a prompt; its record as a message (RecordTypedPrompt) is not watched again, or a trigger started its sequence twice.
- Awaiting hears each worker's return and stop (WorkerBack, WorkerStopped) itself, tells it, and pops on the last with the waited-on line; the two awaiting drawings are gone. The workers conduct tells a report only to the agent that dispatched the worker (the row event names the session it reaches, RowEvent.session, and the worker names who dispatched it).
- The machine types lines one at a time, as the terminal takes them: a line with breaks would be pasted and typed again.
- A fact, rule or reminder is whispered once per context window: the lines whispered since the last compaction travel on the memory readings, and the card follows the line said (MarkWhispered on LineSaid, which now carries the line's values).
- The rule question is a typed line, as the whisper is; the test reads it from the typed lines.
- The resume chain lives on the stack since phase 1; the unwrap test reads the stack.
- The custom rules ban poetry in names (PoeticVariable/Parameter/Method/TypeNameDetector) and sentences as method names (SentenceMethodNameDetector): articles, pronouns, adverbs and preposition phrases in a name. Tasks 1095, 1101 and 1105 rename what they catch. Since task 1102 the banned words sit in .commandments/custom/lists.json, which the plugin reads since v5.27.0: `poetic` holds the 261 words every name rule bans, written capitalised so the type rule matches them in a class name, `poetic_values` the 177 words banned in parameters and variables but allowed as methods, and a rule names a list as `${poetic}` in its matcher; the method rule's 64 own words and the type rule's 98 own class names stay inline. A banned word is added to the list once.

## Plan 19, phase 2, task 983: Idle is the plan's (2026-10-21)

- Idle keeps quiet_since and parked_asked; a start, a prompt and a tool use make it active again. on_stop holds in the order parked, broken wait, approved plan, next open task in auto mode, and passes a stop held once this turn; on_ticked asks about a parked task once after a minute of quiet, a blocked task with no wait after 45 minutes, and checks in after half an hour in auto mode. The listener is on_stop though the event is still named Idle: the event's rename to Stop waits for the chart's deletion, since the chart keys its triggers by the event's name.
- The tasks readings names what the stop and the tick read in words: parked_named, broken_waits_named, blocked_without_wait (a blocked task with no wait link, nothing the journal can see that opens it) and next_open; the plans readings's approved plans. Plans.APPROVED_UNSTARTED is a nudge of the plans feature now.
- The seven idle drawings are gone; the approved-plan drawing stays for Working until task 984.
- The riddle nudges are named for what they do: parked_task_asked_about, blocked_task_asked_about, check_in_after_quiet, parked_task_named_at_close; TaskOpenedAgain and PlanOpenedAgain are TaskReopened and PlanReopened.
- A state prints with the fields set past their defaults and no times: working(task_id=3), idle; the panic command and the trail read it from BaseState.printed.
- The 71 tests of the chart itself are dropped ahead of phase 3, since the suite carried every chart walk; the shell's short and shown limits are 400 characters (message 10389); the code-commandments plugin runs v5.20.1.

## Plan 19, phase 2, task 984: Working is the plan's (2026-10-21)

- Working keeps edits and active_at beside task_id, what and logged_at. A write past tasks.log_after is refused until the log line; at tasks.first_nudge_after edits behind it the log is asked for, and every tasks.name_every the task in hand is repeated; the asks read the edits already made, so "5 edits since you logged" comes on the sixth write. A stop is refused while an approved plan is not started, with the log line first when the log is ten minutes old, else with carry on, and a stop held once this turn is refused again: with a task in hand there is no escape by stopping twice (the standing test), where doc 55 let the second stop pass. A session start says carry on, and after a compaction where the work stands, from the tasks readings's last log line and the git readings's uncommitted files. A quiet quarter hour is told the task is still open. TaskLogged keeps logged_at, TaskClosed pops, and on_resume pops when the task is no longer in hand, else says carry on.
- The machine hands a resumed state the agent's readings (through_hooks takes it; a move by hand reads it inside the agent's environment). A refusal of a switched-off feature passes: the machine asks the nudger whether the nudge is silenced before refusing.
- The nine working drawings are gone, the approved-plan drawing with them.
- Standing is Readings everywhere (messages 10270, 10423): Readings, <Feature>Readings, <Feature>SnapshotReader, event.readings, SnapshotReaders. The look stays until its column migration (task 1101: oriented becomes overview_read, LookTaken becomes OverviewRead).
- Names renamed on the way: task_in_hand_repeated, last_log_line, the *_summary fields, rules_numbered, facts_numbered, reminders_numbered, last_other_session_at; the rules ban held, hold, named, back and forth as well.

## Plan 19, phase 2, task 985: FollowingPlan is the plan's (2026-10-21)

- FollowingPlan extends Working with plan_id, approved, moved_from, at_checkpoint and phase. A push of an unapproved plan is refused (PLAN_NOT_APPROVED). At a checkpoint a stop is refused in auto mode with the phase complete and go on, else told the user looks first; a session start says the same; a tool use counts nothing. A task's close keeps the state with no task in hand, at the checkpoint when the readings says so; the next task's start, by the plan or by number, keeps the top as that task; PlanDone pops with the plan done line.
- Only a state moves the agent: Idle pushes Working on TaskStarted and FollowingPlan on PlanStarted (or on a task of the started plan); Working becomes FollowingPlan when its task's plan starts; a blocked task carries its close like a done or parked one, so the state lets it go. InHand.start and the plan control's start only write rows; AdvancePlan only writes the next task, finding the follower by the stacks on the agent rows, and the plan's end is PlanDone carried by Plan.done(at).
- The three following-plan drawings are gone. A plan parked or abandoned still moves the agent by the plan control until task 1061.

## Plan 19, phase 2, the last tasks and the replays (2026-10-21, early morning)

- A closing command prints the next task (number, title, brief) itself; the plans conduct types the plan's next task only for a start the agent did not cause: every row event carries the actor's stamp (RowEvent.actor, by_agent) (task 1076).
- One tool-use counter per session lives on the agent's row (Agent.tool_uses), moved as a plain tool use of the agent's own is placed (hooks ToolUses) and carried on ToolStarting and ToolFinished as tool_use; a journal command and a subagent's use carry the unchanged number, lift no wait and earn no inbox reminder. The inbox counts from the mark a message's arrival leaves (Agent.inbox_mark, set by MarkInboxArrival on MessageArrived) and from the count a message was read at (Message.read_mark); the namings since a message are nudge entries with a tool_use at or past the mark (Entries.nudge_count); the pin suggestions count the same way (task 1085).
- A paused session ends its turn: PausedByUser refuses every tool but a read of the user's messages, the messages conduct names the inbox at a stop only where tools are not all refused (BaseState.refuses_every_tool), and the inbox is named again on resume (task 1088).
- Awaiting (features/tasks/states) is the one wait on something outside the chat: what in words, ends_on as table:id refs (workers, outputs, checks, tasks, questions), start_time, reminder_time, next_task_named, outcomes. A worker's dispatch pushes it (Awaiting.on_workers) and widens it; a wait on workers stands through the agent's own tool use, any other is lifted by it; the last row settling pops it with WAIT_OVER. Expecting and the workers' Awaiting are gone (task 1096).
- The ToolCall is the one reading of a line: its parts carry reads_output and read_shape, Running.names and AnnouncedCommands compare parts, RecordEdit and SpotCommit read the call, and a tool entry records the call (Entry.recorded_call, is_write) beside the raw hook; nothing outside the provider's call() reads a line into parts but the shell runner, which runs it (tasks 1111 to 1114, 1112).
- Working says nothing on resume (the wait that popped said what came; the start block names the task after a compaction), counts its still-open reminder from the agent's quiet time, and says the name-back beside the log line. The machine types a tick's lines; the clock only dispatches.
- The replay harness runs one journal (played) and lists what differs from the record; a step records the stack, not the chart's counts; records are re-frozen only where the conduct changed on purpose, each reason in task 991's log; the replay fixture switches the chart feature off (tasks 1043, 991).
- The name rules match a word anywhere in a name, ignore case, forbid prepositions, pronouns, adverbs, verb forms, slang nouns and the journal's voice, have sentence rules for parameters and class names, and flag a string standing alone at the top of a file; report 32 holds the two readers' findings. by is forbidden too: the briefing says save(row, actor) and task 1135 renames it. A quantity names its unit (task 1133).

## The ruling: the workflows are gone (2026-10-21, phase 3 of plan 19)

- The chart feature, its models, repositories, support, controller, routes, page, command, skill and docs are deleted; the states and the conducts carry every line (docs/the-rules.md is generated from the source and names each state and each line's sayer).
- Migration 19 keeps a workflow the user made or edited as a document, 'Workflow: <title>', from its nodes and lines, then drops charts, nodes, counts and noted_times, the node_of, yes, no and then links, the settings listeners.off, chart.drawings_version and features.chart, and the walk entries. The migrations 6, 15 and 16, which touched the chart's tables, are deleted; migration 13 indexes no counts.
- The keeping of the user's workflows as documents was the orchestrator's choice; the pull request says so.

## Plan 19, phases 8 and 9 and the morning's rulings (2026-10-21)

- The compacting state is on the stack at last: the chart's leftover `AgentState` answered the compaction with
  stay and the catalogue did not know `Compacting`, so no compaction had ever pushed it. `AgentState` is gone;
  `Idle` and `Working` extend `BaseState`.
- A listener may stop an event's propagation, `event.stop_propagation()`, and the listeners after it never hear
  it; the walk starts again at the next `on`. The compacting state uses none of it.
- A state entering or leaving the stack is handed the typist, `on_enter(typist)` and `on_exit(typist)`, the
  lifecycle handlers that come first in a state class (rule 2, detector `lifecycle-handler-not-first`). The
  typist has pause and resume (queue, then type as one), disable and enable (queue nothing), and clear. The
  compacting state clears and disables on entering and enables on leaving: a line the journal would type while
  the context compacts is dropped, since the look at the next start brings the agent up to date. The tool-use
  count and the inbox mark go back to zero at a compaction.
- The work mode is the floor state: `Idle` is the builder's, `Orchestrating` and `Soloing` are swapped in by the
  `workers.mode` setting at a session start, at the setting's change and on resume, through `Workers.MODE_STATES`,
  never an if on the mode. A floor pushes its own family: the orchestrator's pushes `OrchestratingPlan` and
  `Delegating`, whose lines say hand it to a worker where the builder's say carry on; the orchestrator's floor
  answers a stop, a long quiet and a worker's report with the open tasks across the plans and the workers to
  dispatch. The solo floor refuses a worker's dispatch at the floor. Proven by a test driving an orchestrator
  through a plan of twenty tasks with three workers out at once.
- The plan's listener finds its follower by the state's class, `isinstance(state, FollowingPlan)`, never by the
  state's name: by name, the orchestrator's plan state never advanced the plan.
- A fact, rule or reminder carries its presence in the agent's context window. The start block hands every row
  over at a session start (a listener sets them all), the look hands them all over, and `journal <noun> read <n>`
  hands one over; a keyword hit on a row not in the context tells the agent to read it, never its words. The
  funnel is `MemoryContext`.
- A secret's field shown while typing is no secret: its value is kept for the programs and named in the shown
  file beside the values, and only a hidden field's value becomes a mask.
- Still open: the
  plugins upgraded by a `journal.updated` event (task 1167); the remote journal two people share (task 1164); the
  rest of the name sweep (task 1052) and the custom name detectors' noise on every `on_` listener.

## Plan 19, phase 5, the live checks (2026-10-21, late morning)

- A real Claude session on Sonnet and a real Codex session, headless and resumed at every step, each walked a
  scratch journal (port 8765) through a task, a log, a question answered from the user's side, a worker whose
  real report popped Awaiting, an await on a flag, a plan with a checkpoint approved from the user's side, refused
  to start while a task was in hand, done through its checkpoint in auto mode with the stop held by the parked
  task, the parked task resumed and done, and `journal panic now compacting` from the user's side popped by the
  next start. The nudge keys match doc 55's table; the rail has no Workflows entry; the chart route answers 404.
- Found on the way and fixed: `journal question show` crashed on an answered question's link (a Ref has a type,
  not a table); the chart drop counted a shipped workflow's revisions as the user's edits and wrote documents for
  them, now only workflows a user or an agent last wrote are kept.
- Noted: Codex sends no session-start hook, so a Codex session cannot end an earlier one that still runs in its
  environment; a scratch set up from a source checkout needs `.journal/journal` for the global command to find
  it; the Building-a-plan sequence stays open on its first step when the agent builds the plan by commands.
- Environments: on a second and a fresh third environment, Claude and Codex each put every row where it belongs
  and nothing on the first; the old fault of Codex going to main is gone.
- Two records from before the chart's removal, backed up from other journals on this machine, upgraded in-process
  through App and Config: 22 migrations, the chart tables gone, every live agent's stack seeded.

## The type check passes (task 1173, 2026-10-21)

- `python3 -m mypy src/journal` finds no error, and it stays that way: an Optional the design always has is made
  certain where it is born, never cast or ignored.
- A saved row answers `row.row_id`, `row.creation_time`, `row.update_time` and `row.creation_actor`; each raises
  `UnsavedRow` on a row not yet saved, so code that needs a saved row says so and `Model.id` stays `int | None`.
- `Conduct` extends `BaseState`, not the other way round: a conduct's listener runs with the state as itself, so
  it is typed as one, and the answers `none`, `swap`, `push`, `pop`, `forward` and `refuse` live on `BaseState`.
  A conduct holds its `on_` listeners and nothing else; a helper one listener merges is a module function that
  takes the state.
- A setting is read by its option's kind: `settings.integer`, `decimal`, `texts`, and `SettingRows.mapping` for a
  raw key, each raising `WrongSettingKind` on a stored value of another kind.
- An entry's data is a dict, empty when it has none. A phone's and a pairing code's expiry is required.
- A route answers `Answer`, a JSON response, a file or a stream; `Router.page` is what a phone may reach, never a
  stream.

## The task in hand per agent (task 1232, 2026-10-21)

- Each agent has its own task in hand: an `in_hand` link from its holder to the task, written by `Tasks.holder_started`
  (and `assign_holder` for a plan's start, before the plan's row moves) wherever a task starts, the one-task
  refusal checked per holder there. `Tasks.current(agent)` is the started task the agent holds.
- The holder: a worker's command makes the worker row the holder, since a worker's hooks never reach the journal and
  it has no agent row; an agent's command its own agent row; the user, at the terminal or in the viewer, the
  environment's agent at work; a plan's next task, whoever held the task that closed. A task started by another
  moves to it, and the link from the one before goes.
- The tasks data carries `agent_tasks`, the tasks this agent holds; Ready, PlansReady and FollowingPlan push or swap
  only for a task of the agent's own, and the plan's next-task line goes to the agent that holds it. SingleTaskRule
  is gone: the refusal lives where the holder is known.
- The viewer's task inspector shows "Held by" on a started task: a worker by number and name, an agent by program
  and session.

## The shared journal

Plan 24 builds it on the branch shared-journal, from doc 62 and report 42.

- **What is shared and what stays on one machine.** Every model has `shared`, true by default. Kept on one machine: Entry (the hook and timeline log), Agent (the state stack), Timing, Statistic, CommandOutput, DashboardRow, Secret, Phone, PhoneCode, MigratedRow, Version3Migration, JournalVersion and ReleaseMessage, and also Plugin and McpServer: a plugin is a program installed on the machine and an MCP server's command and keys are the machine's own. Alias is shared: the team runs the same project commands.

