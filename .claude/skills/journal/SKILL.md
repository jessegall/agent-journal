---
name: journal
description: The journal, its commands and when each applies; load it before the first write
---

# The journal

**If you are a subagent, stop here.** The journal is the main conversation's; report what you found and it files what matters. Reads are fine.

A compaction keeps what was **done** and drops what was **decided**. The journal is the record of what was decided, handed back to you at every start, and the engine beside your terminal is what tells you what to read next. You never poll it: when something is owed — a message the user left, a question answered, a reminder, the next row under auto — the engine types one line into your terminal while you are idle, in a tiny vocabulary: `message 3 created`, `2 unseen question`, `work 1 open`, `todo 5 next`, or a nudge in plain words. Read it as a line from the user's side and act on it.

Everything runs through one command, `journal`, and every command is a **noun and a word**: `journal <type> <word> …`. The nouns are the resource types; the words are the one controller's methods, renamed by the type where the type has its own word (a to-do is *added* and *done*, work *started* and *ended*, a question *asked* and *answered*, a pin *struck*, a report *archived*, a plan *acknowledged*, a message *processed*). Every resource has a title (at most 80 characters, never a colon), an abstract, a brief, sections, links, comments, who has seen it, and an outcome written when it completes. `journal <type> --help` lists the words; the reference at the end lists every noun.

## When the user asks for work

1. **It is the current work**, a step of it, or a correction: carry on; `journal work section <n> "<what moved>" "<how far>"` when the direction changes.
2. **It is different.** A to-do — the default: `journal todo add "<title>" --brief "<why, where to start>"`, say "parked as to-do n", and carry on. Its words: `journal todo ask <n> "<question>"` files a question on the row and the row waits; `todo answer <n> "<text>"` answers it; `todo block <n> "<why>"` / `todo unblock <n>`; `todo after <n> <m>` says it waits on row m (`--off` undoes); `todo strike <n> "<why>"` abandons it on the record; `todo start <n>` opens work for it; `todo prune --days 30` drops long-closed rows. The list is ordered by priority, then number: `journal todo priority <n> low|default|high|critical` (or a number; 100 is default) when the user says something comes first.
3. **It is different and the user said NOW** — their word, not your judgement: update the open work with where it got to, then start the new one.

With nothing open, the request is the work: read until you can name it, `journal work start "<the work>"`, go. **Declare before the first write**: a write with no work open is refused by the gate. `journal todo start <n>` opens work for a row; `journal work end <n> --how "<what landed>"` ends it, and the row is closed only by `journal todo done <n> --how "<how>"` — ending work is not finishing a row. `journal work update <n> --brief "<where it got to>"` records a turn in the work; `work section` a longer part. A commit closes a row when its message carries `Journal: todos done <n>` at column 0.

**"I'll do it after this" is a to-do, every time.** The deferral feature names the sentence back to you if nothing was parked.

## Tag every message

Open every message with exactly one tag: `[!discovery]` `[!correction]` `[!blocked]` `[!info]` `[!reply]`. When in doubt, `[!reply]`. The tags feature tells you once if the last message had none.

## Pin, rule, reminder, or nothing

Would a later reader be WRONG without it? **a pin.** Will you stop DOING it though you know? **a reminder.** One thing to do later? **a to-do.** Binds every environment? **a rule.** Pins and rules carry their reasoning in the brief. At each mark of the context window (the context feature's marks) writes are held until you decide: `journal pin create "<claim>"`, `journal rule create "<ruling>"`, or `journal nothing "<why>"`.

## Messages, questions, comments

The user writes to you from the viewer. `journal message unread` lists what waits, `journal message read <n>` marks one seen. Use `journal message process <n> "<their exact words>" "<resource ref>"` only when that part became a record resource such as a to-do, pin, rule, reminder, question, doc, report, plan or work. The pills above a message are links, never status prose, acknowledgements or descriptions of what you did. Reply with `journal message reply <n> "<text>" [--file <path>]` when the message needs an answer; react when it only needs acknowledgement; then close it with `journal message processed <n> --how "<what was done>"`. `message waiting` lists the ones not yet processed; `message file <n> <name> --into "doc <d>"` files an attached file into a doc (`keep` keeps it); `message archive <n> "<why>"` puts one away; `message edit <n> "<text>"` rewords one that still waits. Ask through the journal, never by halting: `journal question ask "<one line>" --abstract "<context>" --set about=todo:<n>` with options as `--set options=…` JSON; the answer reaches you as an event. A comment the user left is handled and `journal comment done <n> --how "<what was done>"`.

## Plans, reports, docs

**The tab the user is driving is yours to look at**, once they press the wheel in the chat window's bar: `journal browser ask shot` (a picture, attached to the ask), `ask text`, `ask url`, `ask dom`, `ask console`, `ask click "<selector>"`, `ask type "<selector>" "<words>"`, `ask goto <url>`, `ask eval "<js>"`, `ask scroll top|bottom|<selector>`. Each waits up to 30 seconds for the extension's answer and prints it; with no tab being driven it is refused and says so.

**An acknowledgement is a reaction.** A message that needs no answer — "noted", "carry on", a nod — gets `journal message react <n> "👍"` (one of 👍 ❤️ 🎉 😄 👀 🙏 👎 💔 😠) instead of words; a reaction also sits fine beside a pill, on a message you filed a to-do from, and beside a reply. Reply when there is something to say.

**A subagent that must write is lent an environment, never detected.** `journal environment <n> grant` lends this environment to this session's subagents; paste into the dispatch prompt that every journal command runs as `journal --env="<name>" --agent="<its-id>" …`. Its rows land in the same record marked with that id; it may write messages, to-dos, work, questions, comments, reports, plans — never a pin, rule, reminder, suggestion, doc, tool or style, and it never switches, claims or grants. `journal todo assign <n> --to="<id>"` hands it one row nobody else may take; it reports with `journal todo report <n> "<how>"` and you close the row with `todo done`. Twenty silent minutes clear an assignment and tell you (agents.lapse). Most subagents need none of this: they report, and you file.

A change nobody asked for is a suggestion, not a sentence in your reply: `journal suggestion suggest "<the change>" --brief "<what you saw, what it costs now and later>"`. Nothing waits on it; the user accepts, adjusts or declines it in the viewer, an accept or adjust files a to-do that cites it, and a decline is a ruling — you do not propose it again in other words (`--set despite=true --set because="<what changed>"` if something did). At most five wait at a time. Withdraw one that stopped being true: `journal suggestion withdraw <n> --why "<why>"`.

Phases, a roadmap, "first … then …" is a plan: `journal plan create "<name>" --set goal="<what is true when done>"`, `journal plan phase <n> "<title>" --when "<complete when>" [--checkpoint]`, `journal plan todos <n> <p> <rows…>`, `journal plan ready <n>`. Only the user activates it and continues it past a checkpoint, in the viewer; the plan advances by itself as rows close. Research ends in a report you write: `journal report create "<what was asked>" --brief "<answer, evidence, what was fine, where it stands>"`. What stays true is a doc: `journal doc create`, `journal doc section <n> "<part>" "<body>"`, `journal doc attach <n> <path> "<what it is>"`; cite it with a link. `doc draft <n>` marks it unfinished, `doc final <n>` settled, `doc supersede <n> --by <m>` points readers of an old one at the new, `doc detach <n> <name>` drops a file (kept under struck/), `doc index <n>` catalogues files already in its folder, `doc paths <n>` prints their absolute paths; `doc delete <n> "<why>"` archives it.

## Environments and sessions

A session works one environment; `journal environment switch <n>` takes a free one (`--project` also makes it the project's start environment, `--move <session>` moves another session, `--back` returns), `journal environment claim <n> "<why>"` a held one (the holder is told), `journal environment prepare "<name>"` makes one, `journal environment rename <n> "<name>"` renames it (the folder moves and every session on it follows), `journal environment remove <n> [--yes]` takes it away — its record goes to `.journal/attic/` and the name is free again; `--yes` when rows are still open. `journal environment pickup <n>` shows what waits on one before you take it. Never switch on your own initiative. A subagent that must write is lent one: `journal environment grant <n>`, and it runs every command with `--env <name> --agent <its-id>`.

## Look before you answer

`journal search <term>`, `journal conversation --back 1` (the stretch the last summary replaced), `journal user` (the user's own words), `journal carry` (everything standing, in full), `journal status`.

## Skills

The start block names the skills to load before the first write — every `journal-*` skill until the user chooses otherwise on the viewer's Skills page, where each skill has a Load button (a message asking you to load it now) and an every-start switch. Load what the block names with the Skill tool, then work; the skills feature reminds you every 25 tool uses if no journal skill is in the window, because a compaction empties it.

## Features

Every capability is a feature the engine loads, switchable per environment in the viewer's Settings and tuned by its trigger. Each has its own skill, `journal-<feature>`, generated from the feature itself.

## Reference: every noun and its words

### message — What the user left for the agent, or the agent for the user
A message is read once by the other side and processed part by part; what each part became is written on it.  Scope: environment. Seen by: user, agent.
    journal message all [--deleted]
    journal message archive <n> <why>
    journal message attach <n> <path> [--what …]
    journal message comment <n> <text>
    journal message comments <n>
    journal message processed <n> [--how …] [--set key=value…]
    journal message create <title> [--abstract …] [--brief …] [--set key=value…]
    journal message declare <n> <kind>
    journal message delete <n> [--why …]
    journal message detach <n> <name> [--why …]
    journal message edit <n> <text>
    journal message file <n> <name> [--into …]
    journal message files <n>
    journal message find <name>
    journal message folder <n>
    journal message force_delete <n>
    journal message index <n>
    journal message link <n> <ref>
    journal message linked_to <ref>
    journal message move <n> <env>
    journal message paths <n>
    journal message process <n> <part> <became>
    journal message react <n> <face>
    journal message read <n>
    journal message reply <n> <text> [--file …]
    journal message restore <n>
    journal message search <term>
    journal message section <n> <title> <body>
    journal message set <n> <key> <value>
    journal message show <n>
    journal message tag <n> <name> <tags>
    journal message unlink <n> <ref>
    journal message unread [--actor …]
    journal message update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]
    journal message waiting

### todo — One thing to do later, with a brief that says why and where to start
A to-do waits on the list until it is started as work and closed; auto mode works the list in order.  Scope: environment. Seen by: user, agent.
    journal todo after <n> <waits> [--off]
    journal todo all [--deleted]
    journal todo answer <n> <text>
    journal todo ask <n> <question> [--set key=value…]
    journal todo assign <n> [--to …] [--off]
    journal todo attach <n> <path> [--what …]
    journal todo block <n> <why>
    journal todo comment <n> <text>
    journal todo comments <n>
    journal todo done <n> [--how …] [--set key=value…]
    journal todo add <title> [--abstract …] [--brief …] [--set key=value…]
    journal todo delete <n> [--why …]
    journal todo detach <n> <name> [--why …]
    journal todo files <n>
    journal todo find <name>
    journal todo folder <n>
    journal todo force_delete <n>
    journal todo index <n>
    journal todo link <n> <ref>
    journal todo linked_to <ref>
    journal todo move <n> <env>
    journal todo paths <n>
    journal todo priority <n> <value>
    journal todo prune [--days …]
    journal todo react <n> <face>
    journal todo read <n>
    journal todo report <n> <how>
    journal todo restore <n>
    journal todo search <term>
    journal todo section <n> <title> <body>
    journal todo set <n> <key> <value>
    journal todo show <n>
    journal todo start <n>
    journal todo strike <n> <why>
    journal todo tag <n> <name> <tags>
    journal todo unblock <n>
    journal todo unlink <n> <ref>
    journal todo unread [--actor …]
    journal todo update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### work — What the agent is doing right now, declared before its first write
Work is opened by the agent, updated as it moves and ended when done; the agent that opened it has seen it.  Scope: environment. Seen by: user.
    journal work all [--deleted]
    journal work attach <n> <path> [--what …]
    journal work comment <n> <text>
    journal work comments <n>
    journal work end <n> [--how …] [--set key=value…]
    journal work start <title> [--abstract …] [--brief …] [--set key=value…]
    journal work delete <n> [--why …]
    journal work detach <n> <name> [--why …]
    journal work files <n>
    journal work find <name>
    journal work folder <n>
    journal work force_delete <n>
    journal work index <n>
    journal work link <n> <ref>
    journal work linked_to <ref>
    journal work move <n> <env>
    journal work paths <n>
    journal work react <n> <face>
    journal work read <n>
    journal work restore <n>
    journal work search <term>
    journal work section <n> <title> <body>
    journal work set <n> <key> <value>
    journal work show <n>
    journal work tag <n> <name> <tags>
    journal work unlink <n> <ref>
    journal work unread [--actor …]
    journal work update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### plan — Ordered phases of to-dos with a goal, approved by the user before it runs
A plan is drafted by the agent, approved and continued by the user, and worked phase by phase.  Scope: environment. Seen by: user, agent.
    journal plan abandon <n> [--why …]
    journal plan activate <n>
    journal plan all [--deleted]
    journal plan attach <n> <path> [--what …]
    journal plan comment <n> <text>
    journal plan comments <n>
    journal plan acknowledge <n> [--how …] [--set key=value…]
    journal plan create <title> [--abstract …] [--brief …] [--set key=value…]
    journal plan delete <n> [--why …]
    journal plan detach <n> <name> [--why …]
    journal plan files <n>
    journal plan find <name>
    journal plan folder <n>
    journal plan force_delete <n>
    journal plan from_doc <doc>
    journal plan index <n>
    journal plan link <n> <ref>
    journal plan linked_to <ref>
    journal plan move <n> <env>
    journal plan paths <n>
    journal plan phase <n> <title> [--when …] [--checkpoint] [--brief …] [--before …]
    journal plan phases <n>
    journal plan todos <n> <p> <todos> [--move] [--off]
    journal plan react <n> <face>
    journal plan read <n>
    journal plan ready <n>
    journal plan rephrase <n> <p> [--title …] [--when …] [--checkpoint …] [--brief …]
    journal plan restore <n>
    journal plan continue <n>
    journal plan search <term>
    journal plan section <n> <title> <body>
    journal plan set <n> <key> <value>
    journal plan show <n>
    journal plan tag <n> <name> <tags>
    journal plan unlink <n> <ref>
    journal plan unread [--actor …]
    journal plan update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### doc — What stays true about the project, catalogued for every session
A doc is written once, cited by pins and rules, and read before anything it settles is re-investigated.  Scope: project. Seen by: user, agent.
    journal doc all [--deleted]
    journal doc attach <n> <path> [--what …]
    journal doc comment <n> <text>
    journal doc comments <n>
    journal doc final <n> [--how …] [--set key=value…]
    journal doc create <title> [--abstract …] [--brief …] [--set key=value…]
    journal doc delete <n> [--why …]
    journal doc detach <n> <name> [--why …]
    journal doc draft <n>
    journal doc files <n>
    journal doc find <name>
    journal doc folder <n>
    journal doc force_delete <n>
    journal doc index <n>
    journal doc link <n> <ref>
    journal doc linked_to <ref>
    journal doc move <n> <env>
    journal doc paths <n>
    journal doc react <n> <face>
    journal doc read <n>
    journal doc restore <n>
    journal doc search <term>
    journal doc section <n> <title> <body>
    journal doc set <n> <key> <value>
    journal doc show <n>
    journal doc supersede <n> <by>
    journal doc tag <n> <name> <tags>
    journal doc unlink <n> <ref>
    journal doc unread [--actor …]
    journal doc update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### report — What was checked and what was found, written for the user, read once
A report answers something the user asked to have checked; it ages out or becomes a doc.  Scope: environment. Seen by: user, agent.
    journal report all [--deleted]
    journal report attach <n> <path> [--what …]
    journal report comment <n> <text>
    journal report comments <n>
    journal report archive <n> [--how …] [--set key=value…]
    journal report create <title> [--abstract …] [--brief …] [--set key=value…]
    journal report delete <n> [--why …]
    journal report detach <n> <name> [--why …]
    journal report doc <n>
    journal report files <n>
    journal report find <name>
    journal report folder <n>
    journal report force_delete <n>
    journal report index <n>
    journal report link <n> <ref>
    journal report linked_to <ref>
    journal report move <n> <env>
    journal report paths <n>
    journal report react <n> <face>
    journal report read <n>
    journal report restore <n>
    journal report search <term>
    journal report section <n> <title> <body>
    journal report set <n> <key> <value>
    journal report show <n>
    journal report tag <n> <name> <tags>
    journal report unlink <n> <ref>
    journal report unread [--actor …]
    journal report update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### pin — A fact a later session would get wrong without
A pin is handed to every session on its environment; it is struck when it stops being true.  Scope: environment. Seen by: user, agent.
    journal pin all [--deleted]
    journal pin attach <n> <path> [--what …]
    journal pin comment <n> <text>
    journal pin comments <n>
    journal pin strike <n> [--how …] [--set key=value…]
    journal pin create <title> [--abstract …] [--brief …] [--set key=value…]
    journal pin delete <n> [--why …]
    journal pin detach <n> <name> [--why …]
    journal pin files <n>
    journal pin find <name>
    journal pin folder <n>
    journal pin force_delete <n>
    journal pin index <n>
    journal pin link <n> <ref>
    journal pin linked_to <ref>
    journal pin move <n> <env>
    journal pin paths <n>
    journal pin promote <n>
    journal pin react <n> <face>
    journal pin read <n>
    journal pin restore <n>
    journal pin search <term>
    journal pin section <n> <title> <body>
    journal pin set <n> <key> <value>
    journal pin show <n>
    journal pin tag <n> <name> <tags>
    journal pin unlink <n> <ref>
    journal pin unread [--actor …]
    journal pin update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### rule — A ruling that binds every environment of the project
A rule is decided by the user, cited where it applies, and struck only by them.  Scope: project. Seen by: user, agent.
    journal rule all [--deleted]
    journal rule attach <n> <path> [--what …]
    journal rule comment <n> <text>
    journal rule comments <n>
    journal rule strike <n> [--how …] [--set key=value…]
    journal rule create <title> [--abstract …] [--brief …] [--set key=value…]
    journal rule delete <n> [--why …]
    journal rule detach <n> <name> [--why …]
    journal rule files <n>
    journal rule find <name>
    journal rule folder <n>
    journal rule force_delete <n>
    journal rule index <n>
    journal rule inject <n> [--into …]
    journal rule link <n> <ref>
    journal rule linked_to <ref>
    journal rule move <n> <env>
    journal rule paths <n>
    journal rule pin <n>
    journal rule react <n> <face>
    journal rule read <n>
    journal rule restore <n>
    journal rule search <term>
    journal rule section <n> <title> <body>
    journal rule set <n> <key> <value>
    journal rule show <n>
    journal rule tag <n> <name> <tags>
    journal rule uninject <n> [--into …]
    journal rule unlink <n> <ref>
    journal rule unread [--actor …]
    journal rule update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### reminder — An instruction said again until it is retired
A reminder repeats at every start and every so often mid-work, because knowing is not doing.  Scope: environment. Seen by: user, agent.
    journal reminder all [--deleted]
    journal reminder attach <n> <path> [--what …]
    journal reminder comment <n> <text>
    journal reminder comments <n>
    journal reminder retire <n> [--how …] [--set key=value…]
    journal reminder create <title> [--abstract …] [--brief …] [--until …] [--set key=value…]
    journal reminder delete <n> [--why …]
    journal reminder detach <n> <name> [--why …]
    journal reminder files <n>
    journal reminder find <name>
    journal reminder folder <n>
    journal reminder force_delete <n>
    journal reminder index <n>
    journal reminder link <n> <ref>
    journal reminder linked_to <ref>
    journal reminder move <n> <env>
    journal reminder paths <n>
    journal reminder react <n> <face>
    journal reminder read <n>
    journal reminder restore <n>
    journal reminder search <term>
    journal reminder section <n> <title> <body>
    journal reminder set <n> <key> <value>
    journal reminder show <n>
    journal reminder tag <n> <name> <tags>
    journal reminder unlink <n> <ref>
    journal reminder unread [--actor …]
    journal reminder update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### suggestion — A change the agent proposes unasked; the user accepts, adjusts or declines it, and nothing waits
Accepting or adjusting files a to-do from it; a decline is a ruling the agent does not propose again.  Scope: environment. Seen by: user, agent.
    journal suggestion all [--deleted]
    journal suggestion attach <n> <path> [--what …]
    journal suggestion comment <n> <text>
    journal suggestion comments <n>
    journal suggestion decide <n> [--how …] [--set key=value…]
    journal suggestion suggest <title> [--abstract …] [--brief …] [--set key=value…]
    journal suggestion withdraw <n> [--why …]
    journal suggestion detach <n> <name> [--why …]
    journal suggestion files <n>
    journal suggestion find <name>
    journal suggestion folder <n>
    journal suggestion force_delete <n>
    journal suggestion index <n>
    journal suggestion link <n> <ref>
    journal suggestion linked_to <ref>
    journal suggestion move <n> <env>
    journal suggestion paths <n>
    journal suggestion react <n> <face>
    journal suggestion read <n>
    journal suggestion restore <n>
    journal suggestion search <term>
    journal suggestion section <n> <title> <body>
    journal suggestion set <n> <key> <value>
    journal suggestion show <n>
    journal suggestion tag <n> <name> <tags>
    journal suggestion unlink <n> <ref>
    journal suggestion unread [--actor …]
    journal suggestion update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### question — Something the agent asks the user, with choices to pick
A question waits for the user; its answer reaches the agent as an event.  Scope: environment. Seen by: user, agent.
    journal question all [--deleted]
    journal question attach <n> <path> [--what …]
    journal question comment <n> <text>
    journal question comments <n>
    journal question answer <n> [--how …] [--set key=value…]
    journal question ask <title> [--abstract …] [--brief …] [--set key=value…]
    journal question delete <n> [--why …]
    journal question detach <n> <name> [--why …]
    journal question files <n>
    journal question find <name>
    journal question folder <n>
    journal question force_delete <n>
    journal question index <n>
    journal question link <n> <ref>
    journal question linked_to <ref>
    journal question move <n> <env>
    journal question paths <n>
    journal question react <n> <face>
    journal question read <n>
    journal question restore <n>
    journal question search <term>
    journal question section <n> <title> <body>
    journal question set <n> <key> <value>
    journal question show <n>
    journal question tag <n> <name> <tags>
    journal question unlink <n> <ref>
    journal question unread [--actor …]
    journal question update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### comment — What the user or the agent said about another resource
A comment is a resource of its own, linked to what it is about.  Scope: environment. Seen by: user, agent.
    journal comment all [--deleted]
    journal comment attach <n> <path> [--what …]
    journal comment comment <n> <text>
    journal comment comments <n>
    journal comment done <n> [--how …] [--set key=value…]
    journal comment create <title> [--abstract …] [--brief …] [--set key=value…]
    journal comment delete <n> [--why …]
    journal comment detach <n> <name> [--why …]
    journal comment files <n>
    journal comment find <name>
    journal comment folder <n>
    journal comment force_delete <n>
    journal comment index <n>
    journal comment link <n> <ref>
    journal comment linked_to <ref>
    journal comment move <n> <env>
    journal comment paths <n>
    journal comment react <n> <face>
    journal comment read <n>
    journal comment restore <n>
    journal comment search <term>
    journal comment section <n> <title> <body>
    journal comment set <n> <key> <value>
    journal comment show <n>
    journal comment tag <n> <name> <tags>
    journal comment unlink <n> <ref>
    journal comment unread [--actor …]
    journal comment update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### agent — A session of Claude or Codex, and what it is doing right now
The hooks report activity; the engine distinguishes idle, busy, declared work and compaction.  Scope: environment. Seen by: nobody.
    journal agent all [--deleted]
    journal agent attach <n> <path> [--what …]
    journal agent by_session <session>
    journal agent comment <n> <text>
    journal agent comments <n>
    journal agent complete <n> [--how …] [--set key=value…]
    journal agent create <title> [--abstract …] [--brief …] [--set key=value…]
    journal agent delete <n> [--why …]
    journal agent detach <n> <name> [--why …]
    journal agent files <n>
    journal agent find <name>
    journal agent folder <n>
    journal agent force_delete <n>
    journal agent index <n>
    journal agent link <n> <ref>
    journal agent linked_to <ref>
    journal agent move <n> <env>
    journal agent paths <n>
    journal agent react <n> <face>
    journal agent read <n>
    journal agent restore <n>
    journal agent search <term>
    journal agent section <n> <title> <body>
    journal agent set <n> <key> <value>
    journal agent show <n>
    journal agent tag <n> <name> <tags>
    journal agent unlink <n> <ref>
    journal agent unread [--actor …]
    journal agent update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### notification — What the agent did, told to the user once
A notification is written for the user by a feature for every act of the agent, or by the agent to say a long piece of work landed.  Scope: environment. Seen by: nobody.
    journal notification all [--deleted]
    journal notification attach <n> <path> [--what …]
    journal notification comment <n> <text>
    journal notification comments <n>
    journal notification complete <n> [--how …] [--set key=value…]
    journal notification create <title> [--abstract …] [--brief …] [--set key=value…]
    journal notification delete <n> [--why …]
    journal notification detach <n> <name> [--why …]
    journal notification files <n>
    journal notification find <name>
    journal notification folder <n>
    journal notification force_delete <n>
    journal notification index <n>
    journal notification link <n> <ref>
    journal notification linked_to <ref>
    journal notification move <n> <env>
    journal notification paths <n>
    journal notification react <n> <face>
    journal notification read <n>
    journal notification restore <n>
    journal notification search <term>
    journal notification section <n> <title> <body>
    journal notification set <n> <key> <value>
    journal notification show <n>
    journal notification tag <n> <name> <tags>
    journal notification unlink <n> <ref>
    journal notification unread [--actor …]
    journal notification update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### notice — One line kept over the chat while it matters
A notice stays until the user's X or the agent's close; a tone and a link may ride on it.  Scope: environment. Seen by: user.
    journal notice all [--deleted]
    journal notice attach <n> <path> [--what …]
    journal notice comment <n> <text>
    journal notice comments <n>
    journal notice close <n> [--how …] [--set key=value…]
    journal notice create <title> [--abstract …] [--brief …] [--set key=value…]
    journal notice delete <n> [--why …]
    journal notice detach <n> <name> [--why …]
    journal notice files <n>
    journal notice find <name>
    journal notice folder <n>
    journal notice force_delete <n>
    journal notice index <n>
    journal notice link <n> <ref>
    journal notice linked_to <ref>
    journal notice move <n> <env>
    journal notice paths <n>
    journal notice react <n> <face>
    journal notice read <n>
    journal notice restore <n>
    journal notice search <term>
    journal notice section <n> <title> <body>
    journal notice set <n> <key> <value>
    journal notice show <n>
    journal notice tag <n> <name> <tags>
    journal notice unlink <n> <ref>
    journal notice unread [--actor …]
    journal notice update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### reaction — A face on a message
A reaction is one face by one actor on one message; the same face again takes it off.  Scope: environment. Seen by: user, agent.
    journal reaction all [--deleted]
    journal reaction attach <n> <path> [--what …]
    journal reaction comment <n> <text>
    journal reaction comments <n>
    journal reaction complete <n> [--how …] [--set key=value…]
    journal reaction create <title> [--abstract …] [--brief …] [--set key=value…]
    journal reaction delete <n> [--why …]
    journal reaction detach <n> <name> [--why …]
    journal reaction files <n>
    journal reaction find <name>
    journal reaction folder <n>
    journal reaction force_delete <n>
    journal reaction index <n>
    journal reaction link <n> <ref>
    journal reaction linked_to <ref>
    journal reaction move <n> <env>
    journal reaction paths <n>
    journal reaction react <n> <face>
    journal reaction read <n>
    journal reaction restore <n>
    journal reaction search <term>
    journal reaction section <n> <title> <body>
    journal reaction set <n> <key> <value>
    journal reaction show <n>
    journal reaction tag <n> <name> <tags>
    journal reaction unlink <n> <ref>
    journal reaction unread [--actor …]
    journal reaction update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### tool — A script kept for a job that comes back, catalogued so the next agent runs it instead of writing it again
A tool names its entry (how to run it), its usage and what it does; run executes it from the project root.  Scope: project. Seen by: user, agent.
    journal tool all [--deleted]
    journal tool attach <n> <path> [--what …]
    journal tool comment <n> <text>
    journal tool comments <n>
    journal tool complete <n> [--how …] [--set key=value…]
    journal tool create <title> [--abstract …] [--brief …] [--set key=value…]
    journal tool delete <n> [--why …]
    journal tool detach <n> <name> [--why …]
    journal tool files <n>
    journal tool find <name>
    journal tool folder <n>
    journal tool force_delete <n>
    journal tool index <n>
    journal tool link <n> <ref>
    journal tool linked_to <ref>
    journal tool move <n> <env>
    journal tool paths <n>
    journal tool react <n> <face>
    journal tool read <n>
    journal tool restore <n>
    journal tool run <n> <args>
    journal tool search <term>
    journal tool section <n> <title> <body>
    journal tool set <n> <key> <value>
    journal tool show <n>
    journal tool tag <n> <name> <tags>
    journal tool unlink <n> <ref>
    journal tool unread [--actor …]
    journal tool update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### style — One rule of the project's coding style, on one subject, written as a skill
A style rule names its subject and its decision; the style feature writes the skill for it.  Scope: project. Seen by: user, agent.
    journal style all [--deleted]
    journal style attach <n> <path> [--what …]
    journal style comment <n> <text>
    journal style comments <n>
    journal style strike <n> [--how …] [--set key=value…]
    journal style create <title> [--abstract …] [--brief …] [--set key=value…]
    journal style delete <n> [--why …]
    journal style detach <n> <name> [--why …]
    journal style files <n>
    journal style find <name>
    journal style folder <n>
    journal style force_delete <n>
    journal style index <n>
    journal style link <n> <ref>
    journal style linked_to <ref>
    journal style move <n> <env>
    journal style paths <n>
    journal style react <n> <face>
    journal style read <n>
    journal style restore <n>
    journal style search <term>
    journal style section <n> <title> <body>
    journal style set <n> <key> <value>
    journal style show <n>
    journal style tag <n> <name> <tags>
    journal style unlink <n> <ref>
    journal style unread [--actor …]
    journal style update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### connection — A service the project can reach, and which variable holds its token
Never the token itself: the name of the variable that holds it.  Scope: project. Seen by: user, agent.
    journal connection all [--deleted]
    journal connection attach <n> <path> [--what …]
    journal connection comment <n> <text>
    journal connection comments <n>
    journal connection complete <n> [--how …] [--set key=value…]
    journal connection create <title> [--abstract …] [--brief …] [--set key=value…]
    journal connection delete <n> [--why …]
    journal connection detach <n> <name> [--why …]
    journal connection files <n>
    journal connection find <name>
    journal connection folder <n>
    journal connection force_delete <n>
    journal connection index <n>
    journal connection link <n> <ref>
    journal connection linked_to <ref>
    journal connection move <n> <env>
    journal connection paths <n>
    journal connection react <n> <face>
    journal connection read <n>
    journal connection restore <n>
    journal connection search <term>
    journal connection section <n> <title> <body>
    journal connection set <n> <key> <value>
    journal connection show <n>
    journal connection tag <n> <name> <tags>
    journal connection unlink <n> <ref>
    journal connection unread [--actor …]
    journal connection update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### environment — One line of work with its own record: messages, to-dos, pins, plans, settings
A session works one environment at a time; switch takes one that is free, claim takes a held one with a reason.  Scope: project. Seen by: nobody.
    journal environment all [--deleted]
    journal environment attach <n> <path> [--what …]
    journal environment claim <n> <why>
    journal environment comment <n> <text>
    journal environment comments <n>
    journal environment remove <n> [--how …] [--yes] [--set key=value…]
    journal environment prepare <title> [--abstract …] [--brief …] [--set key=value…]
    journal environment delete <n> [--why …]
    journal environment detach <n> <name> [--why …]
    journal environment files <n>
    journal environment find <name>
    journal environment folder <n>
    journal environment force_delete <n>
    journal environment grant <n> [--off]
    journal environment index <n>
    journal environment leave <n>
    journal environment link <n> <ref>
    journal environment linked_to <ref>
    journal environment move <n> <env>
    journal environment paths <n>
    journal environment pickup <n>
    journal environment react <n> <face>
    journal environment read <n>
    journal environment rename <n> <name>
    journal environment restore <n>
    journal environment search <term>
    journal environment section <n> <title> <body>
    journal environment set <n> <key> <value>
    journal environment show <n>
    journal environment switch <n> [--project] [--move …] [--back]
    journal environment tag <n> <name> <tags>
    journal environment unlink <n> <ref>
    journal environment unread [--actor …]
    journal environment update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### browser — What the agent asks of the tab the user is driving — a picture, its text, a click — answered by the extension
journal browser shot|url|text|dom|console|click <selector>|type <selector> <words>|goto <url>|eval <js>|scroll top|bottom|<selector>; the user turns driving on in the chat window's bar.  Scope: environment. Seen by: nobody.
    journal browser all [--deleted]
    journal browser answer <n> <text> [--ok] [--files …]
    journal browser ask <op> <args> [--wait …]
    journal browser attach <n> <path> [--what …]
    journal browser comment <n> <text>
    journal browser comments <n>
    journal browser complete <n> [--how …] [--set key=value…]
    journal browser create <title> [--abstract …] [--brief …] [--set key=value…]
    journal browser delete <n> [--why …]
    journal browser detach <n> <name> [--why …]
    journal browser driving
    journal browser files <n>
    journal browser find <name>
    journal browser folder <n>
    journal browser force_delete <n>
    journal browser index <n>
    journal browser link <n> <ref>
    journal browser linked_to <ref>
    journal browser move <n> <env>
    journal browser paths <n>
    journal browser pending
    journal browser react <n> <face>
    journal browser read <n>
    journal browser restore <n>
    journal browser search <term>
    journal browser section <n> <title> <body>
    journal browser set <n> <key> <value>
    journal browser show <n>
    journal browser tag <n> <name> <tags>
    journal browser unlink <n> <ref>
    journal browser unread [--actor …]
    journal browser update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]

### nudge — A line a feature has the engine type to the agent
A nudge is written by a feature and spoken to the agent as it is; the user never hears it.  Scope: environment. Seen by: agent.
    journal nudge all [--deleted]
    journal nudge attach <n> <path> [--what …]
    journal nudge comment <n> <text>
    journal nudge comments <n>
    journal nudge complete <n> [--how …] [--set key=value…]
    journal nudge create <title> [--abstract …] [--brief …] [--set key=value…]
    journal nudge delete <n> [--why …]
    journal nudge detach <n> <name> [--why …]
    journal nudge files <n>
    journal nudge find <name>
    journal nudge folder <n>
    journal nudge force_delete <n>
    journal nudge index <n>
    journal nudge link <n> <ref>
    journal nudge linked_to <ref>
    journal nudge move <n> <env>
    journal nudge paths <n>
    journal nudge react <n> <face>
    journal nudge read <n>
    journal nudge restore <n>
    journal nudge search <term>
    journal nudge section <n> <title> <body>
    journal nudge set <n> <key> <value>
    journal nudge show <n>
    journal nudge tag <n> <name> <tags>
    journal nudge unlink <n> <ref>
    journal nudge unread [--actor …]
    journal nudge update <n> [--title …] [--abstract …] [--brief …] [--outcome …] [--set key=value…]
