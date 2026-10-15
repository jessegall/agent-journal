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
- **Settings, not states**: auto mode and the work mode (hands-on, orchestrator, solo). They
  change what a state allows or says. Liveness (alive, compacting now) is not a state either;
  the viewer derives it from the last event's time.
- **The runtime is the server process.** `engine/runtime.py` keeps three threads: HTTP, the
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

- **Features register states; features depend on the engine, never the reverse.** The engine
  holds `AgentState`, `Paused`, `Transition`, `Machine`, `Nudger`, the catalogue and the
  generic `Ended` and `Subagent`. Every other state lives in its feature's `states/` folder:
  tasks (Idle, Working, Stuck), plans (FollowingPlan), sequences (RunningSequence), helpers
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
  and delivers. Standing nudges are not stored: the state says them again and dedupe
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
memory_checkpoints (AtMark), plans' flow (FollowingPlan), sequences' flow (RunningSequence),
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
E. **API for the viewer** under `/api`: environments, agents (with state and context), tasks,
   plans, messages, questions (answer), facts, rules, reminders, entries (`?since=` for live
   updates), settings (feature switches), skills; the server serves the built viewer at `/`.
F. **The viewer is version 3's, whole** (the user's ruling on 2026-10-15, reversing the small
   rebuild): `src/web` is version 3's viewer source and its built `dist`, untouched, with its
   `node_modules` shared from `v3.bak` by a symlink. The server speaks version 3's API under
   `/api` from version 4's rows (`src/journal/http/v3/`): a manifest and a settings tree
   recorded from a live version 3 server (`manifest.json`, `settings.json`, with task and
   worker names laid in), one shaper per type from a model to the row shape the viewer reads,
   listings with its paging, the dashboard with counts, events and the event stream from the
   entries (every row change is an entry now), the bar, the summary, identity, agents,
   profiles, and the writes the viewer sends (`v3_actions.py`). The viewer's own code is the
   one place to adapt if the contract ever moves; today nothing in it changed.
D2. **The boot menu** is version 3's, rebuilt in the supervisor: a banner, then one question
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
0.3 s later (`Terminal.ENTER_AFTER`): sent together, Claude takes them for a paste and keeps
the line in its input, as version 3 found.
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
- Workers do not spawn yet: `worker dispatch` records the row; the supervisor's headless launch
  of a second agent in a worktree is next.
- Resume after `RestartAgent` is wired but untried; Codex is wired but untried live.
- The context figure needs Claude's statusline, which runs only interactively; untested.
- Reports and docs have models and routes but no page; no page for workers, checks, sequences,
  triggers; no hub of journals; no phone; no sharing; no plugins.
- Memory keyword whispers and the rule review; put-off-work; closed-by-commit; auto mode and
  work mode settings; permission prompts routed to the viewer.
- Panes now read from the entries: file edits (Edit and Write calls, with the lines added
  and removed) and the terminal (shell commands and their output). Still served empty:
  collections, suggestions, dumps, plugins, integrations, secrets, phone, sharing, the hub
  when the project is under a throwaway path. Each is a shaper or a stub in `http/v3/` away.
- Chat marks drawn today: commit badges (from the git feature's entries), replies as comments,
  skills loaded; not yet: subagent marks, thoughts, whispers, test-run cards, reactions.
- Install from a clone or a release (`install.sh`), upgrade and migrations; the `.pyz` build.
- `v3.bak/` can go once nothing is left to read from it.

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
  for marks on the agent's timeline, as `card` entries: a check run, a trigger met, a question
  answered, a skill loaded, a halt; the agent shaper draws them beside the commit cards. The console
  now answers a missing row or a refusal with code 1 and the reason instead of raising.
- **A deferred failure never stops the worker.** `Deferred._work` logs a failing piece of work to the
  server log and runs the next; before, one exception ended the thread and every later deferred listener
  waited in the queue for good, silently. Found 2026-10-15 behind a reply that never reached the chat.
- **Install is one command, as version 3's (2026-10-15, later).** `install.sh` copies `src` into
  `<project>/.journal/src` (from the checkout it is run from, or a clone of `AGENT_JOURNAL_REPO` at
  `AGENT_JOURNAL_REF`) and runs `journal setup here` from the copy. Setup also writes the dispatcher at
  `~/.local/bin/journal` (`supervisor/dispatcher.py`): it finds the project's `.journal` walking up and
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
  own (`NoJournal`), its screen in `.journal/runtime/agent-<env>.log`; Stop sends the supervisor the
  Stop instruction. Deleted on the way: `JOURNAL_INBOX`.
- **The command is the project's.** `journal setup` writes `.journal/bin/journal` and nothing outside the
  project; the supervisor puts that folder first on the agent's PATH, so `journal …` resolves inside a
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
  seeded at boot (feature `seeds`, run by the runtime) and tells the plan's steps. A step may wait on the user, so
  the same stop again goes through.
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
- The shipped chart carries the stop rules that were `AnswerStop` and `StopWords.for_`; those are gone. The
  counter rules (unread, unanswered, log cadence) stay as listeners until their lines move over; docs/the-rules.md.
- The Workflow page: canvas with pan and zoom, palette, lines dragged from ports, text in place, draft with undo,
  list form for a phone or a keyboard, Try it dry. No release yet: version 4 is still a branch.
