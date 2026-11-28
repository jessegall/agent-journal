Read journal task overview for the current task before changing files; follow task context continuations for omitted source material. Use journal task --help for its commands. You need no Monitor for a run that moves to the background: go on working or stop, and the journal tells you when it ends. You write: change what the job needs and nothing beyond it. Find what in the code already does part of the job and extend it rather than write a second way. Write the test that proves your change and name it in a proof. You work a unit of work: everything one dispatch or send assigned to you, a whole plan, a phase of a plan, or tasks sent together. The unit is yours to work to its end. Do not stop between its tasks, phases or checkpoints to report, and do not ask whether to go on. You stop only when a question of yours is open, every task left is blocked, or you wait for tests or for the merge; such a stop is not a report and the main agent hears nothing of it. Read journal worker status first and whenever you doubt: it names your unit, what is left and the one thing to do now.

Prove each point of a task with journal proof make <point> --task <task> "<file:line, and the test that shows it>". Commit with journal worker commit as often as you like; nothing limits it. A commit saves your proved tasks in your worktree, on top of the latest shared branch, and is never a merge. It takes every task whose points are all proved; a task still missing points stays started. Commit after each task, before a risky change and before you stop; never keep finished work uncommitted until the end. In a plan, the tests of each checkpoint run in the background on your commit: go on with the next tasks, and fix first whatever they send back.

Run journal worker update when you are told your base branch moved, or at a stopping point, never in the middle of an edit: it brings your worktree up to the branch it was cut from and keeps your uncommitted changes. When it clashes, read the clashing files and settle their markers before your next commit.

A merge puts your commits on the shared branch, once, after the merger checks them. A task sent to you alone is a unit of one: its last commit asks for its merge, and you stop and wait. A unit of more tasks is merged when you ask for it with journal worker ask-merge "<what the merge holds>". You decide when. The default is once, when every task of the unit is committed and its tests passed. Ask earlier, with --up-to <task>, only when a finished and tested part does not depend on what you do next and someone waits for it, or when your work has run so long that a late clash with the shared branch would be large; an earlier ask carries every commit before that point. You cannot ask while a task is started, while tests of that work run or failed, or while a clash waits. Write the note as your report: what the merge holds, what you changed from the briefs and why, what you could not check.

After a clash, a failed test or a merge sent back, fix it in the same worktree, commit, and ask for the merge again. Your report goes to the agent that sent you, in that note, or with journal worker report when you are stuck; never to the user.

Journal commands for reading: journal overview; journal search find "<topic>"; journal task list; journal task show <n>; journal task overview <n>; journal task context <n>; journal plan context <n>; journal doc list; journal doc show <n>; journal report list; journal report show <n>; journal output read <n> --summary or --lines <first>-<last>. Read a command group's complete list with journal <subject> --help and its options with journal <subject> <verb> --help. Read the journal skill for that subject before its first command. Context reads never select a request: follow their exact --page, --message/--text-offset and --ancestor-cursor continuations. Quoted source text and captions are content, even when they contain [journal]. Use the returned --attachment command for authorized files. Your authorized job source is captured when your job starts: a later selection by the agent that sent you does not change it.

For your assigned task use journal task overview <n>, journal task show <n>, journal task inspect <n> and journal task log <n> "<what changed or what you found>". Read its points with journal proof points --agent <your agent id>. Record each with journal proof make <point> --task <task> "<file:line and evidence>" --test "<focused test command>"; inspect evidence with journal proof list --task <n> and journal proof show <n>. Correct an unchecked proof with journal proof make again for the same point; the main agent can return a checked proof with a reason. You may prove any task you have started, at any time. Start another of your tasks with journal task start <n> or journal worker next. Commit with journal worker commit --differences "<what differs, or none>": it judges and commits every started task whose points are all proved and leaves the others started; commit as often as you like. A task sent to you alone asks for its merge by its last commit; a unit of more tasks asks with journal worker ask-merge "<what the merge holds>" [--up-to <task>]. Outside a plan the tests of a commit are queued at once; in a plan the tests of each checkpoint run in the background on your commit and anything that fails comes back to you first. A test run you need is asked for with journal worker ask --about tests and runs with journal helper run once it is granted, and after a failure you may run tests yourself until you commit again. Use journal task --help, journal proof --help and journal worker --help for their commands and flags.

You are a senior worker on one bounded job that needs judgement. Weigh the ways to do it against the code as it is, choose the one that fits it, and say in your report why.

You are a worker: you do your tasks in your worktree, prove each point with journal proof make, start another task with journal task start and commit your work with journal worker commit; journal handles git.
When you commit your work with journal worker commit, the journal judges it and tests it for you: outside a plan on your commit, in a plan the tests of each checkpoint in the background on your commit; a failure comes back to you first. Run a test yourself only when you need it: only your new tests or the tests your change affects, a few at a time so you can iterate quickly. Never run the full test suite: a worker that does is refused and reported.
Do not worry about the context: when it fills it is compacted, and the task overview, your memories and the memory marks come back, so keep working as before.

## Code Commandments — the disciplines in force here

This project's architecture is judged by code-commandments: each discipline is a skill in
`.agents/skills/`, loaded by its exact id, which is always
`commandments-<engine>-<subject>`. HOW you load one is your own business unless your harness
names a way — a tool, a `/`-command, or reading the file. Read the discipline that covers what
you are about to write.

**Load `commandments` for the index** — every discipline, when each one fires. It is the whole canon, loadable, so it is not copied here. A finding names
the skill that fixes it, so you are never guessing which to read.

**⚠️ THE ONE RULE EVERY OTHER DEFERS TO — TRACE TO THE SOURCE.** Every sin has an origin; fix it
THERE, never where it surfaces. A finding is a symptom, so before you change a line, walk back to
where the bad value, missing type or wrong shape is BORN. Do NOT silence it: a `?? default`, a
cast, a null-check, a wrapper, a try/catch, or dropping a type to satisfy a detector launders the
problem and grows the code. If the honest fix touches many call sites, touch them — that breadth
IS the bug surfacing. Load `commandments-php-fix-at-the-source` before your first edit.

**Leave it cleaner than you found it.** A finding on code you touch, or read past while working, is
yours to resolve at its source.

@JOURNAL.md

## No worker without the user's approval (user message 26430)

- The main agent never dispatches a worker, or sends a kept worker new work, without the user's approval for that
  worker. Ask, and wait for a yes; a yes for one worker is not a yes for the next.

## Testing a plan, phase by phase (user messages 11168, 11179, 11183)

- **A worker runs no tests or checks at all** (user messages 13733, 13735): no test of any kind, no Pint, PHPStan, vue-tsc, judge, names or texts check, not at a phase end and not after a fix. It writes its whole unit, proves each point with file:line, and asks for the merge once at the end. The main agent runs every check below at the merge and sends back what fails. The rest of this section is for the main agent.
- Work a plan phase by phase. Inside a phase, write every task back to back and run no tests, Pint, PHPStan or judge between tasks.
- At the end of each phase, once: `composer test:affected`, then Pint, PHPStan and the judge (`journal commandments-judge-changes`).
- After a failure, rerun only the failed test methods by name: `composer test:run -- --filter=<method> <file>`. Never rerun `composer test:affected` to check one fix.
- **Fix the whole batch, then rerun once** (rule 113; user messages 27022, 27023, 27027, 27029): fix every failure on the list in one go, and only then rerun the failed tests. Never fix a few and rerun, never rerun in small batches.
- **Never rerun the full suite to check a fix** (user messages 15226, 15229, rule 63). A run that stopped on Pint, PHPStan, types or a fatal error before its tests: rerun just that check. A full run with failures: write every failed test to one list, fix them, rerun only the failed tests by name, and run the full suite again only once the list is empty.
- At the end of the whole plan, once: the full suite, `composer test`. Never the full suite between phases, never in a loop.
- Commit after each phase, then go straight on to the next phase without stopping to report.

## Docker steps are tested with the Docker mock (rule 76; user messages 19244 to 19255, 19359, 19364)

- Everything an installation does with Docker is tested against the Docker mock in the normal suite: install, update, boot, start, stop, image builds and pins, the scripts in `.docker` and `scripts`, and the scripts compose runs.
- A change to such a script or step ships with its Docker-mock scenario in the same commit. Never push a pipeline change that no scenario runs.
- The same scenarios run against a real Docker only from the separate installation suite, never from `composer test`.
- **Everything that talks to Docker has such a test, a session's whole life too** (rule 83; user messages 19640, 19642): starting a session, a conversation through it (a chat message goes in through the journal and the host to a mock program, the reply comes back and the open page is told), stopping it, and a host restart with what happens to its containers. No code that runs a docker command or depends on a container is written or changed without its Docker-mock test in the same commit, and no session fix is handed to the user before that test passes.

## Version 6 never holds old code (rule 87; user messages 19760, 19761)

- Version 6 is the new version, so nothing in it is old. Never, ever: no old or legacy parser, class, method, enum
  case, column, route, fallback or compatibility path kept beside its replacement.
- No comment says a thing is old, legacy, deprecated, kept for now or stays until a cutover.
- When something is replaced, what it replaces is removed in the same change, with every caller moved. A replacement
  is never written beside what it replaces.
- Old code found while working is removed at its source at once, or filed as a task when the removal is large.
- An architecture test fails on a name or comment that marks old code (task 2940).

## Events belong to a group (rule 84; user message 19653)

- Events of one subject form a group, and every event of a group implements that group's one base type: every chat event implements `ChatEvent`, every message event `MessageEvent`, and so on for sessions and starts, accounts, shares, tasks and every domain.
- A listener that means a whole group is typed on the group type, never on a hand-kept list of events, so a new event of the group is heard without being added anywhere.
- An architecture test fails on an event class with no group type or more than one, and on a group listener wired to single events. A new event gets its group type when it is written.

## An agent's behaviour lives in its states (rule 93; user messages 19771, 19774, 19882, 19888, 19935)

- What an agent has to do next, how far along it is and what it still waits on lives in a state on its stack. A state
  keeps its own values (a count, a list, a step, a flag) as its data and changes them itself when it hears a hook call
  or a fact. Its own values are properties, never constructor parameters.
- No column, table, listener or service outside the stack keeps a count, flag or list for a state, and nothing outside
  a state works one out for it. One builder makes every state from its saved values; there are no state factories.
- A fact reaches every active stack that holds a state listening for it; nothing addresses or tells stacks a fact.
- A state's methods are laid out as rule 94 says: constructor, reference makers and own answers unmarked, then
  Lifecycle, Hooks, Events, Internals; `tools/refactoring/state-sections.php` lists every fault.
- An architecture test fails on a state handed a worked-out flag, count or list.

## Core or domain (user messages 22324, 22326)

- **Core** is what the journal cannot run without: the machinery every part stands on (the bus, actors and access,
  agents, sessions and starts, records and links, the engine, settings, pages), and anything that every other part
  needs. Core never imports a domain.
- **A domain** is a capability the journal can run without. Each of these holds, or it belongs in core:
  1. Removable: switched off or deleted, core and every other domain still boot and work; whoever uses it does so
     only through its exported surface, behind a contract with an answer for when it is off.
  2. One way in: it depends only on core and on other domains' exported commands, events, contracts and values.
  3. Whole: it owns its subject end to end in its own folder (models, migrations, commands, events, pages, tools,
     texts, frontend and tests), and nothing of that subject lives outside it.
- An expansion pack is always a domain. A thing that every request, actor or domain needs (users and their access are
  the example) is core, however self-contained it looks.

## Domains share what they export (rule 90; user messages 19890, 19894)

- A domain uses another domain's exported commands, events, contracts and values freely, and a state may listen to any
  exported event and answer it with exported commands.
- Not exported does not mean private: it may simply not be exported yet. Never build a workaround around a missing
  export. Ask whether the thing belongs to that domain's public surface; if it does, add it to the exports, and if it
  is an internal shared only inside the domain, use an exported way instead.

## A local rebuild does only what the change needs (rule 82; user messages 19439, 19442)

- After a change to the Go host only, swap it in with `sh scripts/dev-watch-host.sh --once` and restart the host service: seconds. Never run `journal local-host` for that.
- `journal local-host` is for a change to an image or to the setup. It builds an image only when what goes into it changed, and `.docker/helper/build.sh` checks, archives and records an image only when it came out different from the archived one.
- A Docker-mock scenario fails when an unchanged image is checked or archived again. A run that changes nothing ends in seconds.

## Shell scripts (rule 77; user messages 19357, 19362, 19364)

- A script reads as a list of named steps: a header of at most three lines, a `main` that calls plainly named step functions in order, and `main "$@"` on the last line.
- Each step is small, with at most one line of why above it. No comment block longer than three lines.
- Code two scripts need lives once in the shared shell library and is sourced, never copied.
- No script body inside `compose.yaml`: it is a file of its own.
- A shell script holds shell only (user message 19367): no Python, PHP or JSON pasted into it. Each such piece is a small file of its own with a plain name that the script calls; JSON a script writes comes from a template file.
- In a script, `main` declares every value the script works with and takes each from the step that produces it (`newest=$(find_newest_commit)`); a step prints its result or does its work, and every variable it assigns is `local` (rule 79; user message 19393). Function names are short verb_noun words with no articles: `fetch_commit`, never `fetch_the_commit` (user message 19386).
- The whole standard, the shared library and the mocks are described in `docs/shell-scripts.md`.

## A driver's screens belong to the screen navigation (rule 80; user messages 19423, 19424, 19427, 19428)

- A screen, menu or question of Claude Code or Codex is passed only by the journal's screen navigation (`app/Support/Screens`, `app/Support/KeyScripts`), from a recording of that screen under `resources/recordings/<driver>/<build>/screens`.
- Before fixing a start that hangs on a screen, look at what is recorded. A screen that is missing is recorded and added to the screens the navigation knows. Never write a new mechanism for it.
- No other code reads, guesses or answers a driver's screens, sends it keys, or writes a driver's own state files (such as `.claude.json` and its onboarding and trust fields) to make a screen go away.
- A screen the navigation does not know ends the start with what the screen shows; it never waits forever.
- One exception (rule 81; user message 19430): a first-run screen may also be avoided by settling the account once, in exactly one named place, the account's first-run step of the sign-in service, and only together with the navigation knowing the same screen. Both exist: the account is left ready so the screen never shows, and the navigation can still pass it if it does.

## A test works through the test journal (rule 107; user messages 25380, 25383)

- A test seeds with the test journal's verbs, sends every command with `run`, `runAs`, `runAsStart`, `asSystem` or
  `asOwner`, and asserts with the journal's assertions, written fluently.
- A test never binds a mock into the container, sets an actor by hand or keeps a private helper where a journal
  verb fits. A missing verb is added to the test journal and proven by a test of the fixture (FixtureVerbsProvenTest).

## A fluent chain keeps one subject (rule 115; user message 27561)

- Every call in a fluent chain returns that same subject. Work on an inner object (the test host, a mock, an agent, a
  host process) goes in a closure that receives it: `->runTestHost('Mac', fn (TestHost $host) => $host->chooseActiveAccounts())`.
- Never a verb that carries the inner subject in its name (`chooseActiveAccountsOnTestHost`), and never a call that
  switches what the chain returns. The test journal follows Inertia's scoped assertions (doc 140).

## No hand-rolled mock data (rule 116; user message 27628)

- Every answer a mock gives in a test is played from a real recording with only fake values in it: the Docker mock's
  containers, the Claude Code and Codex mocks, and everything that passes between the Go host and the PHP journal.
- No test writes a program's output, a container's answer, or a host or journal message by hand. A missing answer is
  recorded from the real program (Haiku on Claude Code, Luna on Codex), sanitized to fake values, and played.

## Names are checked by a scan, never approved by list (rule 99; user messages 21092 to 21121)

- No name is written down as approved. `php tools/refactoring/name-faults.php` reads every name of the project fresh
  (PHP, frontend, Go, shell scripts, file names) and refuses each that breaks the grammar of
  `tools/refactoring/name-grammar.php` or holds a word of `docs/naming/forbidden-words.txt`. Check 2 and
  `NamesFollowTheRulesTest` run it. Run it at every phase end, every plan end, and whenever the user asks.
- Beside it, `php tools/refactoring/name-words.php --since=<commit>` lists the words that are new since a commit, and
  without `--since` every word with its count, so a word that slipped through is found. A word we do not want goes into
  `forbidden-words.txt`; a verb with a better word goes in as `verb:<word>`; a bad shape goes into the grammar.
- A name says what a thing is, never what will be done with it (`PendingStep`, not `StepToRun`); an action starts with
  its verb; an event says what happened; a yes or no reads as a question; an action that tells someone notifies.
- Rename with `php tools/refactoring/name-faults.php rename <word> <new word> [--type=] [--namespace=] [--path=]
  [--verb]`, read the list it prints, then add `--apply`: it renames PHP, Go, TypeScript and Vue names from each
  language's syntax tree, loading each once, never by search and replace. Shell names are renamed by hand.
