# The journal

**If you are a subagent, stop here.** The journal is the main conversation's; report what you found and it files what matters. Reads are fine.

A compaction keeps what was **done** and drops what was **decided**. The journal is the record of what was decided, handed back to you at every start, and the engine beside your terminal is what tells you what to read next. You never poll it: when something is owed — a message the user left, a question answered, a reminder, the next row under auto — the engine types one line into your terminal while you are idle, in a tiny vocabulary: `message 3 created`, `2 unseen question`, `work 1 open`, `todo 5 next`, or a nudge in plain words. Read it as a line from the user's side and act on it.

Everything runs through one command, `journal`, and every command is a **noun and a word**: `journal <type> <word> …`. The nouns are the resource types; the words are the one controller's methods, renamed by the type where the type has its own word (a to-do is *added* and *done*, work *started* and *ended*, a question *asked* and *answered*, a pin *struck*, a report *archived*, a plan *acknowledged*, a message *processed*). Every resource has a title (at most 80 characters, never a colon), an abstract, a brief, sections, links, comments, who has seen it, and an outcome written when it completes. `journal <type> --help` lists the words; the reference at the end lists every noun.

## When the user asks for work

1. **It is the current work**, a step of it, or a correction: carry on; `journal work section <n> "<what moved>" "<how far>"` when the direction changes.
2. **It is different.** A to-do — the default: `journal todo add "<title>" --brief "<why, where to start>"`, say "parked as to-do n", and carry on. Its words: `journal todo ask <n> "<question>"` files a question on the row and the row waits; `todo answer <n> "<text>"` answers it; `todo block <n> "<why>"` / `todo unblock <n>`; `todo after <n> --waits <m>` says it waits on another row (`--off` undoes); `todo strike <n> "<why>"` abandons it on the record; `todo start <n>` opens work for it; `todo prune --days 30` drops long-closed rows. The list is ordered by priority, then number: `journal todo priority <n> low|default|high|critical` (or a number; 100 is default) when the user says something comes first.
3. **It is different and the user said NOW** — their word, not your judgement: update the open work with where it got to, then start the new one.

With nothing open, the request is the work: read until you can name it, `journal work start "<the work>"`, go. **Declare before the first write**: a write with no work open is refused by the gate. Start work on a row with `--set todo=<n>`; end it with `journal work end <n> --how "<the same words>" --set todo=true` to close the row with it, without `--set todo=true` the row stays open. A commit closes a row when its message carries `Journal: todos done <n>` at column 0.

**"I'll do it after this" is a to-do, every time.** The deferral feature names the sentence back to you if nothing was parked.

## Tag every message

Open every message with exactly one tag: `[!discovery]` `[!correction]` `[!blocked]` `[!info]` `[!reply]`. When in doubt, `[!reply]`. The tags feature tells you once if the last message had none.

## Pin, rule, reminder, or nothing

Would a later reader be WRONG without it? **a pin.** Will you stop DOING it though you know? **a reminder.** One thing to do later? **a to-do.** Binds every environment? **a rule.** Pins and rules carry their reasoning in the brief. At each mark of the context window (the context feature's marks) writes are held until you decide: `journal pin create "<claim>"`, `journal rule create "<ruling>"`, or `journal nothing "<why>"`.

## Messages, questions, comments

The user writes to you from the viewer. A message is processed part by part — `journal message process <n> "<their words>" "<what it became>"` — and closed with `journal message processed <n>`; reply under it with `journal message reply <n> "<text>"`. Ask through the journal, never by halting: `journal question ask "<one line>" --abstract "<context>" --set about=todo:<n>` with options as `--set options=…` JSON; the answer reaches you as an event. A comment the user left is handled and `journal comment done <n> --how "<what was done>"`.

## Plans, reports, docs

**The tab the user is driving is yours to look at**, once they press the wheel in the chat window's bar: `journal browser ask shot` (a picture, attached to the ask), `ask text`, `ask url`, `ask dom`, `ask console`, `ask click "<selector>"`, `ask type "<selector>" "<words>"`, `ask goto <url>`, `ask eval "<js>"`, `ask scroll top|bottom|<selector>`. Each waits up to 30 seconds for the extension's answer and prints it; with no tab being driven it is refused and says so.

**An acknowledgement is a reaction.** A message that needs no answer — "noted", "carry on", a nod — gets `journal message react <n> "👍"` (one of 👍 ❤️ 🎉 😄 👀 🙏 👎 💔 😠) instead of words; a reaction also sits fine beside a pill, on a message you filed a to-do from, and beside a reply. Reply when there is something to say.

**A subagent that must write is lent an environment, never detected.** `journal environment <n> grant` lends this environment to this session's subagents; paste into the dispatch prompt that every journal command runs as `journal --env="<name>" --agent="<its-id>" …`. Its rows land in the same record marked with that id; it may write messages, to-dos, work, questions, comments, reports, plans — never a pin, rule, reminder, suggestion, doc, tool or style, and it never switches, claims or grants. `journal todo assign <n> --to="<id>"` hands it one row nobody else may take; it reports with `journal todo report <n> "<how>"` and you close the row with `todo done`. Twenty silent minutes clear an assignment and tell you (agents.lapse). Most subagents need none of this: they report, and you file.

A change nobody asked for is a suggestion, not a sentence in your reply: `journal suggestion suggest "<the change>" --brief "<what you saw, what it costs now and later>"`. Nothing waits on it; the user accepts, adjusts or declines it in the viewer, an accept or adjust files a to-do that cites it, and a decline is a ruling — you do not propose it again in other words (`--set despite=true --set because="<what changed>"` if something did). At most five wait at a time. Withdraw one that stopped being true: `journal suggestion withdraw <n> --why "<why>"`.

Phases, a roadmap, "first … then …" is a plan: `journal plan create "<name>" --set goal="<what is true when done>"`, `journal plan phase <n> "<title>" --when "<complete when>" [--checkpoint]`, `journal plan todos <n> <p> <rows…>`, `journal plan ready <n>`. Only the user activates it and continues it past a checkpoint, in the viewer; the plan advances by itself as rows close. Research ends in a report you write: `journal report create "<what was asked>" --brief "<answer, evidence, what was fine, where it stands>"`. What stays true is a doc: `journal doc create`, `journal doc section <n> "<part>" "<body>"`, `journal doc attach <n> <path> "<what it is>"`; cite it with a link. `doc draft <n>` marks it unfinished, `doc final <n>` settled, `doc supersede <n> --by <m>` points readers of an old one at the new, `doc detach <n> <name>` drops a file (kept under struck/), `doc index <n>` catalogues files already in its folder, `doc paths <n>` prints their absolute paths; `doc delete <n> "<why>"` archives it.

## Environments and sessions

A session works one environment; `journal environment switch <n>` takes a free one, `journal environment claim <n> "<why>"` a held one (the holder is told), `journal environment prepare "<name>"` makes one. Never switch on your own initiative. A subagent that must write is lent one: `journal environment grant <n>`, and it runs every command with `--env <name> --as agent`.

## Look before you answer

`journal search <term>`, `journal conversation --back 1` (the stretch the last summary replaced), `journal user` (the user's own words), `journal carry` (everything standing, in full), `journal status`.

## Features

Every capability is a feature the engine loads, switchable per environment in the viewer's Settings and tuned by its trigger. Each has its own skill, `journal-<feature>`, generated from the feature itself.
