---
name: journal-todos
description: "Journal to-dos and auto mode: parking work as a to-do with a brief, priorities, starting and closing rows (todos start, work end --todo, a 'Journal: todos done' commit trailer), saying which to-do waits on which (--after, todos after), blocking a row or asking the user about it, and working the list with auto mode and a loop. Use it whenever work is put off: the user says later, not now, add it to the list, park it, or after this. Also use it when you start, finish or close a to-do, when auto mode is on or a hold says to-dos are waiting, when the user says work through the list, when a to-do cannot be done yet, when one to-do depends on, builds on or has to wait for another, and when a commit finishes one. Not for subagents."
---

# Journal to-dos and auto mode

**Not for subagents.** A subagent reports what it found; the main conversation files it.
It is one of the journal's skills; the core `journal` skill says when each applies.
Every command runs through `.journal/journal.py`; `journal` is an alias for it.

## Delayed work: the to-do

    journal todos add "<title>" [--brief]   add one; --brief reads a longer brief from stdin (also: `journal todo "<title>"`)
    journal todos add "<title>" --after=12,14   add one that waits on to-dos 12 and 14
    journal todos after <n> 12,14       to-do n waits on 12 and 14; `--none` clears it
    journal todos                      the titles, HIGHEST PRIORITY FIRST (--order-by-id for plain number order)
    journal todos show <n>             the brief (also: `journal todo <n>`)
    journal todos priority <n> <value>  bigger is more important; a number or a name (low/default/high/critical); 100 unless set
    journal todos start <n>             open work under that title; the row stays open until you close it
    journal todos done <n> "<how>"      the row is finished — always explicit, never a side effect
    journal work end "<title>" --todo   closes the work AND the row, in one command
    journal todos done <n> "<how>"      resolved without starting it
    journal todos reopen <n> "<why>"    undo a close, on the record
    journal todos move <n> "<env>"      carry it to another environment
    journal todos ask <n> "<question>"  it waits on the user; auto moves on to the next
    journal todos answer <n> "<answer>" the user's answer; the agent is told at its next stop
    journal auto-mode [enable|disable]  work through the list without asking, or wait for the word
    journal todos prune --older-than=<30d|2h|6w>|--before=<date> [--force]   done/dropped to-dos older than that, ARCHIVED (or actually deleted with --force); an open to-do is never touched, and there is no silent default age
    journal todos keep <days>   done to-dos older than that are archived on their own, 7 days by default; 0 leaves them listed

A to-do is work that was **put off**: the user said later, or you found something and
were told not to touch it yet. It is a titled file under `todo/<environment>/`, and the brief is
what you will need in a week: what exactly, why, where to start, what the user said. Not
for imagined work; "it might be nice to refactor this" is a suggestion (`journal suggest`), not a to-do.

**A commit closes the to-do it finishes.** Put a trailer at the start of a line in the
commit message — unindented, anywhere in it, the footer being where it is read — spelled as
the command it performs:

    Journal: todos done 4
    Journal: todos done cli-streamline/4 the placement vocabulary is the Kit's four corners

The journal reads the message off the commit once it exists and closes what it names, with
the commit's subject and sha as the `how` — a citation instead of your summary of it. Write
the trailer whenever the commit is what finishes the to-do; it saves nothing to close by
hand afterwards, and the close is then tied to the change that earned it.

**Prose does not close anything, and neither does an indented example.** "This closes the
placement question" is a sentence, and a matcher loose enough to read it would close the
wrong to-do on a message that only argues about one. Only a line beginning at column 0 with
`Journal:` and spelling the command counts — which is what lets a commit message quote the
protocol, indented, without acting on it.

**The number is per environment.** `4` resolves against the environment you are on, then
against the only environment that has a to-do 4 — and refuses when more than one does.
`<environment>/4` says it outright, which is what a commit made from a worktree or another
environment should say. If a trailer closed the wrong one, `journal todos reopen <n>
"<why>"` puts it back with the close it undid kept beside it.

**Turning auto on means starting a loop, in the same breath.** Auto says the list drains
while the user is away; a session with no loop stops at its first idle stop and the list
sits there — the one thing auto was turned on to prevent. So `journal auto-mode enable` prints
the loop command, and the next write is REFUSED until a loop exists. `journal loop set` says one is running that the journal cannot
see; `journal auto-mode disable` says the list should not drain on its own.

**A to-do is not permission, unless the user has switched it on.** With `auto` off, the
default, the start block COUNTS what is waiting — `journal todos` is what lists it — and an
idle stop says so once; neither is an instruction to begin one. Start a to-do only when the user says so for that one, or
asks you to work through them, in which case offer `journal auto-mode enable`. With auto on
for the environment, the user has already said it: whenever nothing is open, pick up the next
one with `todo start <n>`, do it, `work end "<title>" --todo` it — the row does not close on
its own — and the next idle stop brings the next. Auto
also means a loop: start one with the `loop` skill, `15m journal next`, so an idle session
comes back every fifteen minutes and carries on until nothing is left it can do, and stop
it when the list is empty or everything left waits on the user.

**With auto on, solve it yourself.** The user switched auto on to be away. Every
question you send them stops the list until they return, so a question is the expensive
move and a decision is the cheap one. Read the brief, start the to-do, and make every
choice it leaves open: the name, the signature, the approach, which of the brief's
options. Make it under the rules and pins that stand, write it in `journal work update` so it
can be reviewed and reversed, and carry on. "I would have asked with auto off" is not a
reason to ask; it is the case auto exists for.

**Stop on a to-do in two cases, and no others.** These are about when to STOP working a
row, not about whether a question may be filed: filing one is always allowed, auto or not
(the `journal-questions` skill).

1. **You cannot proceed.** Something only the user can supply is missing: access, a
   credential, a file, a fact that is nowhere in the repo or the transcript. Not "I am
   unsure": unsure is decide.
2. **You are stalled.** The hook tells you when many tool calls have gone by on a to-do
   with no `update` filed. When it does, judge honestly whether there is a measurable
   result. If there is, file it and continue. If there is not, stop pouring time in.

In either case:

    journal work update "<where it got to, and what was tried>"     if you had started it
    journal work end "<the to-do's title>" --todo                   so nothing stays open
    journal todos ask <n> "<what is stuck, and what was tried>"

Say that in your reply, naming the to-do, and stop. The next hold names the next to-do
that is not waiting on the user. The user answers from their terminal with `journal todo
answer <n> "…"`; the next stop tells you which question was answered and what the answer
was, and hands you that to-do first. With auto off, an answer is the user's word to do
that one: start it.

**Ask through the journal.** With auto on, the `AskUserQuestion` tool is refused at the
gate: it halts the session until the user is back, which is the one thing auto was
switched on to prevent. `todos ask` and `questions add` are the questions that do not halt
— the list moves on to the next row and the answer is waiting at a later stop.

**Work that waits on the user is not open work.** When what is left of a piece of work
is a ruling or a review only the user can give, park that remainder as a to-do with the
questions in its brief, and `work end` the work. Otherwise the journal sees work in flight,
nothing else starts, and with auto on the stop hook will hold you to do exactly this.

## A to-do that rests on another: say so

    journal todos add "<title>" --after=<n>[,<n>]   file it waiting on the ones that must land first
    journal todos after <n> <m>[,<m>]               say it later, when the work shows it
    journal todos after <n> --none                  it waits on nothing now

**When one to-do only makes sense once another has landed, record it.** "Waits on" is how
the list knows the order the work allows: `journal next` and auto mode skip a to-do while
anything it waits on is still open, and it becomes ready by itself when the last one closes.
The viewer shows it on the row and in the panel. A dependency held only in a brief, or in
your head, is invisible to all of that, and auto will pick the row up too early.

**Set it while filing, not afterwards.** Before `todos add`, look at what is open
(`journal todos`) and ask: does this build on one of them, change what one of them decides,
or break if it lands first? If yes, `--after=` that number. The user saying "after that",
"once X is in", "on top of", "that depends on", "that weighs on the other one" is the
dependency said out loud: write it down.

**Set it again when the work shows one.** Mid-way through a to-do, finding that it needs
another row finished first is a fact to record, not a detour to take: `journal todos after
<this> <that>`, `work update` what you found, end the work, and pick up `<that>`.

**A dependency is a reason to think it through.** When a to-do waits on another, read that
one's brief before designing this one, and design against what it will leave behind, not
what is there today. If the two could be designed apart and collide, say so in the brief of
the later one.

**`after` waits on a to-do; `block` waits on anything else.** A release, a batch, a
decision outside the list: that is a block. Another row on the list: that is `after`,
because the journal can tell when a to-do closes and cannot tell when a condition came true.

    user: "add a CSV export, and after that a scheduled export that uses it"
    → journal todos add "CSV export" --brief         (to-do 7)
    → journal todos add "scheduled export using the CSV export" --after=7 --brief

    working to-do 9, you find it needs the settings page from to-do 5 first
    → journal todos after 9 5 · journal work update "…needs to-do 5's settings page first" · journal work end "<9's title>"

## A to-do you cannot do yet: block it, do not route around it

    journal todos block <n> "<what has to be true first>"   set it aside on a condition
    journal todos ask <n> "<the question>"                  it waits on the USER to answer
    journal todos start <n>                                 picking it up ends the block

**The list is not a sequence.** Work it in whatever order the work allows. A row you cannot
do is skipped with its reason, and the reason is required — a skipped row with no reason
reads as a gap.

**`ask` waits on a person; `block` waits on a condition.** Nobody has to answer a block: a
batch has not run, a release is not cut, another to-do must land first. You wrote the
condition, you read it back when the row comes round again, and you decide when it is true
— exactly as with a reminder's `--until`. `journal next` and auto mode both skip a blocked
row, so the list stops handing you work you are not allowed to start.

That last sentence is the whole point. When the list keeps offering something forbidden and
there is no way to say "not now, because X", the row stops being a to-do and becomes a
wall — and an agent routes around a wall.
