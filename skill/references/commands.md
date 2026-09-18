# The journal: every command, and why it is shaped this way

Read this when you need an option or a verb SKILL.md did not spell out, when you are on
the wrong environment, when something seems broken, or when a rule of the journal seems
arbitrary and you want the reason.

Contents: [Commands](#commands) · [Environments](#environments) · [Shared, and not shared](#shared-and-not-shared)
· [Why it works this way](#why-it-works-this-way)

## Commands

All of them run as `.journal/journal.py <command>`; `journal` is an alias. `journal help
<verb>` prints one verb's lines.

A bare listing — `journal docs`, `journal tools`, `journal todo`, `journal pins`,
`journal rules` — shows 15 at a time and says "… and N more; `--page=2` shows the
rest." if there are more; `--all` still shows struck ones on pins and rules. A single
item read (`journal docs 4`, `journal todo 3`, a pin's `--full`), a search result, and
the hand-off page (`journal environments "<name>"`) are never capped — that is the
payload, not a description of it.

**Where things stand**

    journal                          environment, rules, pins, open work, to-dos, context, hooks
    journal verify                   is the journal wired, and has it fired — in this session?
    journal settings                 every setting, its value, and where it came from

**Reading the transcript**

    journal conversation             what was said since the last compaction
    journal conversation --back=N    N compactions back; --back=1 is what the last summary REPLACED
    journal user                     only the user's own words, in full, never trimmed
    journal search <term> [--all] [--page=N]   every line mentioning it on this environment, in every session; 25 a page, newest first; --all is every environment
    journal carry [--fresh]          exactly what a session start hands back; nothing is written

**Work**

    journal work start "<what>"           declare it — a commitment, which is why it costs a command
    journal work update "<what moved>" [--on="<work>"]   progress, filed against the open work
    journal work await "<what you wait on>"   the stop stops nudging this piece until it expires
                                     --agent=<id> or --pid=<n> names it; a pid is watched and ends the wait when it exits
                                     --for=<minutes> (default 20, cap 120); any update or end ends it
    journal work park "<why it is set aside>" [--on="<work>"]   it stops without being finished: stays open, says why, off the stop's nudging until the next update
    ... --stdin on `work update`, `messages reply` and `comments done`   the text on stdin, where a shell cannot eat a `backtick span` out of it
    journal work end "<the same words>"   close it; the to-do of that title STAYS OPEN unless --todo is passed
    journal open                     work declared and never closed, with its notes

`update` refuses when nothing is open and refuses to guess between several; name one with
`--on`. `work end` matches the subject you opened with, case-insensitively.

**Pins, for this environment**

    journal pins add "<claim>" [--supersedes=N] [--doc=<doc>[.<p>]]   a fact that must survive a compaction; --doc: the doc or part it rests on
    journal pin "<claim>"            the same command, spelled the way it always was — a permanent alias, not deprecated
    journal pins [--all] [--order=asc|desc]   every pin, numbered and NEWEST FIRST; --all includes struck ones, --order=asc reads oldest first. Every paginated list takes it: pins, rules, todos, docs, tools
    journal pins N --full            the conversation around where pin N was written
    journal pins strike N "<why>"    retire a pin that stopped being true, no replacement needed (also: bare `journal strike N "<why>"`)
    journal nothing "<why>"          after a context warning: nothing here needs pinning, and why
    journal pins promote N           lift pin N into a rule; the pin is struck and says where it went (also: bare `journal promote N`)

**Rules, for every environment**

    journal rules add "<ruling>" [--doc=<doc>[.<p>]]   a pin that every environment obeys
    journal rule "<ruling>"          the same command, spelled the way it always was — a permanent alias, not deprecated
    journal rules [--all]            every rule, numbered
    journal rules N --full           the conversation around one
    journal rules strike N "<why>"   repeal one, on the record (also: `journal rule --strike N "<why>"`)
    journal rules inject N           write it into CLAUDE.md between `<!-- journal:rules -->` markers; paths, never file contents
    journal rules uninject N         take it out of CLAUDE.md

**Cleanup: what has stopped being true**

    journal cleanup [--all]          every entry with EVIDENCE against it — a rule or pin naming a file or a `journal <verb>` that is gone, a doc whose environment is gone or an untouched draft, a to-do that has waited on the user, an empty environment — each beside the command that retires it; --all reads every environment's pins, not just this one's
    journal cleanup read             the second pass: every rule and every pin IN FULL, with the three questions to ask of each — the half a checker cannot do, and the record keeps when it was last done
    journal tidy                     the same command
Nothing is struck for you, and age alone is never evidence: a checker that flags a true
claim teaches the reader to skim, and the one real finding goes past with the noise. What
no check can see is the rule that quietly stopped describing how anyone works, so the
report always ends with every rule in force, to be READ. A strike needs a reason and hides
the claim rather than erasing it, so being wrong about one is cheap.

**To-dos, for this environment** (`todos` is a twin of `todo` everywhere below — plural or singular, either works)

    journal todos add "<title>" [--brief]   add one; --brief reads a longer brief from stdin — bare `journal todo "<title>"` is the same
    journal todos [--all]            the titles, numbered — `journal todos list` is the same
    journal todos show N             the whole brief — bare `journal todo N` is the same
    journal todos search <term> [--all] [--page=N]   every line of the open to-dos that mentions it, grouped by to-do; --all adds closed ones. Messages, questions, reports, suggestions, reminders, pins, rules, work and comments have the same `search`
    journal todos start N             open work with that title; `work end "<title>" --todo` closes both
    journal todos done N "<how>"      resolved without starting it
    journal todos reopen N "<why>"    undo a close; the reason and the close it undoes are kept
    journal todos from-commit [<ref>]   act on a commit's trailer by hand — what the git post-commit hook runs
    journal todos strike N "<why>"   abandoned, on the record — `journal todo drop N "<why>"` is the same
    journal todos ask N "<question>"  it waits on the user's answer; auto moves on to the next
    journal todos answer N "<answer>" the user answers from the terminal; the agent is told at its next stop and picks it up first
    journal auto-mode [enable|disable]  per environment: work through the list without asking, or wait for the user's word
    journal todos amend <n> "<section title>" --brief    append a new `## <title>` section to a brief, from stdin
    journal todos replace <n> ["<section title>"] --brief   swap one named section (or, with no title, the whole brief); the old text is kept under struck/

A commit closes the to-do it finishes, with a trailer of its own in the message, at the
start of a line and unindented (an indented one is a quoted example and does nothing):

    Journal: todos done 4
    Journal: todos done cli-streamline/4 the four corners are the vocabulary

The message is read off the commit once it exists, so a commit that was rejected closes
nothing and `-m`, `-F -` and an editor session all behave the same. The `how` becomes the
commit's subject and sha. Prose never closes anything: the line must start with `Journal:`
and spell the command. The number resolves against the environment you are on, then against
the only environment that has it, and refuses when more than one does —
`<environment>/N` says it outright.

A brief on stdin:

    .journal/journal.py todo "convert the last three widgets" --brief <<'EOF'
    After the merge. Dropdown, Trail and EditorPanel still read props; the user wants
    them state-only like the others. Start from src/View/Widgets/Dropdown.php.
    EOF

**Messages, for this environment** (`message` and the old `inbox` answer too)

    journal messages "<message>"         leave a message for the agent — `journal messages add "<message>"` is the same
    journal messages [--page=N] [--order=asc|desc]   waiting messages first, then processed ones
    journal messages waiting             only the messages still waiting to be processed, oldest first, each in full — what to read when a stop says messages wait
    journal messages show N              the message, the parts it was split into and what each became, and the questions about it
    journal messages search <term> [--all]   every line of the waiting messages that mentions it; --all adds processed and archived ones
    journal messages process N --part="<words>" --became=<ref> [--became=<ref>]   one part: the words it quotes, and what it became — todo 22, pin 3, rule 2, reminder 1, question 4, work or noted
    journal messages file N <name> "doc <doc>"|keep   an attached file: copied into the doc (the held copy removed), or kept
    journal messages archive N "<why>"   off the list, kept with its reason; it no longer waits
    journal messages reply N "<text>"    an optional note under the message: what you did, a clarification, a call you made
    journal messages done N              processed; refused until at least one part is recorded and every file is filed
    journal messages edit N "<text>"     reword a message that still waits
    journal messages move N "<env>"      carry a waiting message to another environment

A part must quote the message, and what it became must exist. Nothing is deleted. A stop
holds while messages wait; the first tool call after a new one mentions it once.

**Questions, for this environment**

    journal questions add "<question>" [--about=<ref>]... [--description="<context>"] [--option="<a choice>" [--option-description="<why>"] [--option-code="<example>"]]... [--pick=<n>]   ask; never halts the session. A ref is todo 22, doc 4.1, pin 3, rule 2 or inbox 5; each --option is a choice the user can click in the viewer; --option-description and --option-code belong to the --option in the same position, shown under it; --pick is the number of the option you recommend
    journal questions [--all]         open first, then answered; --all adds withdrawn ones
    journal questions show N          the question, what it is about, and the answer
    journal questions search <term> [--all]   questions and answers that mention it; --all adds answered and withdrawn ones
    journal questions answer N "<answer>"   the user answers; answering again adds a new answer, the old one is kept, and the agent is told again
    journal questions edit N "<question>"   reword it
    journal questions link N <ref>    about one more thing — `questions unlink N <ref>` takes one off
    journal questions withdraw N "<why>"   it no longer needs an answer

**Docs, for every environment** — `<doc>` is a doc's number or its name (the title, or a unique part of it)

    journal docs                     the catalogue
    journal docs show <doc>               read a doc; `<doc>.<p>` reads one part
    journal docs files <doc>         its attachments, as a tree; `docs files` lists every doc's; `docs <doc> files` still works
    journal docs add "<title>" --abstract="<one line>" --brief   a new doc; the intro on stdin
    journal docs part <doc> "<title>" --brief   a new part, from stdin
    journal docs attach <doc> <path> "<what it is>" [--replace]   copy a file or a folder into the doc
    journal docs detach <doc> <name> "<why>"   drop an attachment; kept under struck/
    journal docs replace <doc>.<p> --brief   a new body; the old one is kept under struck/
    journal docs strike <doc>.<p> "<why>"    drop a part, on the record
    journal docs final <doc> | draft <doc>   status
    journal docs abstract <doc> "<one line>"   the line every session is handed
    journal docs title <doc> "<title>"         retitle it; its number and what cites it stay
    journal docs archive <doc> "<why>"         off the catalogue, readable by number, listed under --all
    journal docs paths <doc>                   one absolute path per attached file, for a subagent's prompt
    journal docs supersede <doc> by <doc>    point readers of the first at the second
    journal docs index               catalogue the files .journal/docs/ already holds
    journal docs search <term> [--page=N]   every line of every doc, and every attachment by name, 25 a page
    --doc=<doc> | --doc=<doc>.<p>    on pin, rule and todo: cite a doc, or one part, from the entry

**Tools, for every environment**

    journal tools                    the catalogue
    journal tools show <name>        read one; `show` is how a tool NAMED after a verb (add, run, index) is reached
    journal tools run <name> [args]  run its entry point from the project root
    journal tools add <name> "<title>" --summary="…" --usage="…" --when="…" --entry=<file> [--brief]   the title and summary are required
    journal tools set <name> title|summary|usage|when|entry "<value>"   the title and summary cannot be blanked
    journal tools remove <name> "<why>"   retire it under struck/ — `journal tools strike <name> "<why>"` is the same
    journal tools index              catalogue folders under .journal/tools/ that lack a tool.md

**Environments**

    journal environments                   every environment, this session's marked, the start environment marked, who is on which
    journal env | envs | environment | tracks | track   the same noun, every one a permanent alias
    journal switch "<name>"          this session onto that environment; creates it if new
    journal switch "<name>" --project   this session, and where new sessions start
    journal switch "<name>" --session=<id> | --all-sessions   move other sessions (a terminal's switch offers these)
    journal switch --back            the environment this session came from
    journal claim "<name>" "<why>"   take one a live session still holds: it is unbound, told at its next stop why and by whom, and can claim it back. Nothing of the environment is deleted
    journal environments remove "<name>" [--yes]   take one off the list: bare it says what it holds, --yes deletes it and what it holds (the record keeps a one-line note); never the start environment, never one a live session is on, never one with open work (end it first), and docs stay
    journal environments show "<name>"   the pickup page: docs to read first, what stands, open work, to-dos, how to begin (bare `journal environments "<name>"` is the same)
    journal prepare "<name>"         create an environment for a piece of work and switch to it (see prepare.md)
  says which model, which gets a worktree, and what happens to the branch.
    journal --env=<name> <command>   any command on a named environment, without switching
    journal loop set                 this session has a loop the hook cannot see; `journal loop` says what is known

**The viewer**

    journal suggest "<the change>" [--about=<ref>] --brief   propose a change nobody asked for; the user decides
    journal suggestions [--all]      waiting ones; `suggestions withdraw <n> "<why>"` takes one back
    journal notify "<what finished>" [--about=<ref>]   a notification on the user's Home; only what they want to hear about
    journal notice "<line>" [--tone=note|good|warn] [--link=<url> --label=<text>]   one line kept over the chat until the user's X; `notices` lists, `notices close <n>` retires
    journal react <message> "<face>"   a face on a turn (👍 ❤️ 🎉 😄 👀 🙏 👎 💔 😠); the same face again removes it
    journal browser <op> [target] [--text=]   ask the tab the user put at the wheel: shot, text, dom, url, console, click, type, goto, eval, scroll — the command waits and prints the answer, a picture saved to a path (the `journal-messages` skill)
    journal notifications [--all]    the unread ones; `notifications read <n>` marks one read
    journal reports [--all]          what the user asked to have checked or researched, for the user to read
    journal reports add "<title>" [--about="todo 22"] --brief   file one; never a doc, never handed to a session
    journal reports archive <n> "<why>"   take one off the list
    journal reports keep <days>      a report older than this is archived (7 by default, 0 never); also on the environment's Settings page
    journal plans [--all]            what will be done here and in what order: phases, each made of to-dos
    journal plans add "<title>" --goal="<one line>" --brief   a draft; the user approves it in the viewer
    journal plans phase <n> "<title>" [--when="<complete when>"] [--checkpoint] [--before=<p>]
                                     add a phase, or INSERT one before phase <p> — the phases after it move
                                     along with their to-dos and their checkpoints
    journal plans rephrase <n> <p> ["<title>"] [--when=] [--checkpoint]   correct a phase written wrong
    journal plans todos <n> <phase> <to-do numbers> [--off] [--reopen="<why>"]   put to-dos in a phase, or take them out
    journal plans show <n>           the plan, its phases and their to-dos
    journal plans link <n> "doc 4.2"   a doc or report it rests on; a report it links is kept while it runs
    journal plans from-doc <doc>     a draft plan from a doc's "Phase …" parts, holding the to-dos that cite them
    journal plans abandon <n> "<why>"   stop it
    journal comments [--all]         what the user said about a to-do, doc, pin, rule or reminder
    journal comments done <n> "<what was done>"   a comment is handled
    journal serve [--port=<n>] [--detach]   the web interface on 127.0.0.1, at 8420 or the next free port (read
                                     the URL it prints). Its home is the conversation with the user; every
                                     resource has a page, with the same actions these commands have. `journal
                                     claude` brings one up on its own if none is running here
    journal connections              services this project can reach — a Sentry, a GitHub org, an internal API
    journal connections show <name>  one, and what this environment changed about it
    journal connections add <name> "<what it is for>" [--kind=] [--url=] [--secret=<ENV_VAR>]
                                     --secret NAMES THE VARIABLE, NEVER THE TOKEN: this record is read back
                                     verbatim into every session and every subagent, so a token written here
                                     is a token that has leaked. A value shaped like one is refused where it
                                     is typed, and the only thing read back is whether that variable is set
    journal connections here <name> purpose|kind|url|secret "<value>" [--off]   change it on this environment only
    journal statusline [--install]   the status bar line: environment, open work, viewer; --install adds it to .claude/settings.json, never over one that exists
    journal claude [prompt]          start Claude under the journal's launcher AND the web viewer, if this journal has none running — it says where. The launcher types the viewer's news into the idle session; --quiet never types. --continue, --resume=<id>, --dry-run shows the command; any other flag is passed through to claude
    journal codex [prompt]           start Codex under the journal's launcher, the same way; --quiet never types, --dry-run shows the command

Everything the viewer changes goes through the same controllers as these commands, marked as
coming from the web where a record keeps a source. The API is `/api/env/<env>/<resource>[/<n>][/<action>]`
(GET lists and shows, POST creates or runs an action, PATCH edits, DELETE retires), and
`/api/rules`, `/api/docs` and `/api/tools` for what belongs to the project.

**Chains.** A journal command in a chain exempts only itself from the write gate. A line
whose first non-trivial piece is `journal work start` may write after it; a line that decides
first (`pin`, `rule`, `nothing`) passes the context gate for what follows. `cd` and
`export` before either do not count against it.

## Environments

An environment is a line of work, not a session. Pins, open work and to-dos belong to the environment
that made them; rules belong to every environment. Switch when the user says a new piece of work
should not inherit the current environment's pins and to-dos. Nothing is ever deleted by a
switch: every environment's pins and work stay under its name.

A SESSION STARTS ON NO ENVIRONMENT, and there is no default one. Until it has picked, every
journal command that reads or writes an environment is refused and says how to choose —
reads as well as writes, because answering from the start environment would make that a
selected environment nobody chose. What still answers unbound: `environments`, `switch`,
`prepare`, `claim`, `rules`, `docs`, `tools` and the machinery. A `--continue` or `--resume`
goes back to the environment that session was last on; only a session that has never been
anywhere starts on nothing. `bind_on_start` in settings is a project saying every session
belongs on its start environment, and puts the old behaviour back.

Once it has picked, a session stays bound to that environment. `journal switch` from inside a session moves that session only, so a
second session on another environment keeps its own pins, work and to-dos. `--project` also
moves where new sessions start; do that when the user says the whole project is moving on.
A switch the user runs from a terminal is always the project's, and it lists the sessions
bound elsewhere with how to move one — the user decides, not the hook. `journal environments`
shows every binding and whether each session is running.

One running session works an environment. Two agents on one environment would share its open work and
its to-do list, and two auto sessions would pick the same chore. So a session that starts
on a taken environment — usually the project's start environment, because the user opened a second
terminal — is told at its start who holds it, held at every stop and refused edits until
it has switched: ask the user which environment this session works on, then `switch "<name>"`.
A switch onto a taken environment is refused. A session is running until its SessionEnd, or
until `session_stale_hours` (24) pass without a hook event from it.

An environment has a transcript: everything said while it was current, across every session.
The record keeps which sessions carried each environment, written at every session start and
every switch, so `search` opens only those transcripts and keeps only the stretches the
marks say were on the environment. A session older than the index is read the long way once.

## Shared, and not shared

The record — rules, pins, work, to-dos, environments — is the project's. Every session and every
agent reads and writes the same one, committed with the code. A session that starts
tomorrow is handed the standing rules, the environment's pins, its open work and its to-dos.

What is not shared is the hook's bookkeeping: where it last held you, which context rung
it announced, whether a pin is due, the largest tool result. Those are facts about one
transcript and live in `runtime/<transcript>.json`, gitignored. A fresh session starts with
clean marks and a full store.

The CLI reads **this session's** transcript, found through `CLAUDE_CODE_SESSION_ID`, which
every Bash call from inside a session carries.

## Worktrees

A linked git worktree shares the main checkout's journal: its `.journal/` is a symlink,
made at session start when the checked-out copy is clean. `journal worktree` says which
case you are in; `journal worktree link` replaces a copy by hand. Never write to a copy.


rest are denied with a line saying to report back; `search`, `pins`, `open` and other reads
are fine. Their tool calls are neither gated nor nudged. They are handed the rules on their
first tool call and again at 25%, 50% and 75% of their own window, because a rule binds
main conversation files it.

## When something seems broken

`journal verify` reports wired and fired as separate facts, and fired as two: in some
transcript on this machine, and in this session. A hook that is registered and silent looks
exactly like one everybody is obeying. It also says when the context window is unset, in
which case the ladder is silent rather than guessing.

## Why it works this way

Three ideas explain nearly every rule. Knowing them means you can predict what a command
will do instead of guessing.

**A tag is free; work costs a command.** A tag rides on a message you were sending anyway,
so nothing has to be remembered and there is no store to keep current. Declaring work is a
commitment, so it costs a verb, and that cost is the thought.

**A tag describes the message it rides on, and nothing else.** That is why none of them can
be wrong. `[!update]` was struck because its correctness depended on something outside its
own message, an open scope. Progress is `journal work update` now, a command, because it is
about the work.

**Refuse rather than guess.** Every command fails loudly rather than file something
plausible in the wrong place, and every gate names its own way out. A note under the wrong
heading reads as true, and nothing about it looks broken afterwards. This is also why
nothing is ever evicted by a counter: a pin leaves the store only when a person strikes it,
with a reason.

The gates exist because nudges were measured and did not land: a session tagged 843
messages faithfully and ran `work start` zero times, and the user had to ask for a pin after a
context warning. A rule becomes a gate only when its nudge has been shown not to work.

**Every command takes its arguments the same way: `journal <noun> <verb> [<id>]
[<payload>]`, noun first, plural nouns canonical.** `pins`, `rules`, `docs`, `tools` and
`todo`/`todos` all read `<noun>` alone, read one with `<noun> <id>`, and act with an
explicit verb — `add`, `strike`, `list`, `show`, and each noun's own lifecycle verbs
(`start`/`done`/`ask`/`answer` for a to-do, `part`/`attach`/`final` for a doc). `strike`
is the one verb for retiring anything, everywhere — a struck pin, a repealed rule, a
dropped to-do, a removed tool are the same idea and now the same word. Every spelling
that predates this — `pin`, `rule`, bare `strike`, bare `promote`, `todo
drop`, `tools remove` — still runs, forever, calling the exact same function its new
alias calls; none of them is printed as deprecated.

**Four kinds of command stay outside that pattern, on purpose, not by oversight.**
wrapped under an `environments` noun: they are session/environment *lifecycle* actions,
not collection CRUD — there is no list of them to add to or strike from — and they are
`search` stays top-level for the same reason: it has no collection noun of its own. And
the singleton reads — `conversation`, `user`, `open`, `carry`, `next`, `verify`,
`settings`, `version`, `worktree`, `loop`, `nothing` — are one-shot, not a collection, so
noun-first has nothing to attach to. Separately, `docs detach` keeps its own name rather
than folding into `docs strike`: an attachment is not a part, and `docs strike <doc>
<name>` would be ambiguous against `docs strike <doc>.<p>`.
