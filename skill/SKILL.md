---
name: journal
description: "The project's journal: how to file what happens so it survives a compaction and reaches every later session — the tag on each message, declared work, pins, rules, to-dos, and reading the transcript back instead of answering from memory. Use it whenever the user asks for a feature, a fix, an implementation or any piece of work, because the first decision is whether that is the current work, work to do now, or work to park as a to-do. Also use it whenever a hook holds your stop or denies a tool call; before your first pin, rule, declaration or search in a session; when a context warning asks for a decision; when the user says later, not yet, or after X; when the user rules something project-wide or asks to promote a pin; when you are about to say 'I think we decided…'; and at a fresh start or after a compaction. Load it even when the request seems small — the decision it teaches is the one most often skipped. Not for subagents: a subagent reports what it found and the main conversation files it."
---

# The journal

**If you are a subagent, stop here.** The journal is the main conversation's. You cannot
write it and its rules do not apply to you; report what you found, and the conversation
that dispatched you files what matters. Reads like `journal search` are fine if you need
something said earlier.

A compaction keeps what was **done** and drops what was **decided**. The transcript on disk
loses nothing. The journal is the index that gets you back to it, and the small set of
facts that must be handed to you again after the loss.

Everything runs through one script, `.journal/journal.py <command>`; `journal` is an alias
for it. Bare `journal` shows where things stand. This file is about *when*. The full
command reference, tracks, what is shared, and why the design is what it is are in
[references/commands.md](references/commands.md); read it when you need an option or a
verb you do not remember.

## When the user asks for work

Every request is one of three things, and deciding which comes before anything else.

1. **It is the current work**, a step of it, or a correction to it. Carry on. If the
   direction changes, `journal work update "<what changed>"` says so.
2. **It is different, and it can wait.** Park it and keep going:
   `journal todo "<title>" --brief` with the brief on stdin, then say in your reply that it
   is parked as to-do n. This is the usual case when something is open and the request is
   about something else.
3. **It is different, and it cannot wait.** The user said so ("now", "first", "stop"), or
   it blocks the open work, or it makes the open work wrong. `update` the open work with
   where it got to, `work end` it if it is being abandoned, then `work start` the new one.

With nothing open, the request *is* the work: read until you can name it, `work start` it, go.

"Can wait" means finishing the open work first loses nothing: the request does not depend
on it, does not invalidate it, and was not asked for first. The words settle most cases.
"Later", "after this", "also", "by the way", "when you get to it" mean it can wait.
"Wait", "actually", "instead", "first" mean it cannot.

**"I'll do it after this" is a to-do, every time**, even when "after this" is five
minutes away. The sentence you are about to write — "once the agent finishes", "next",
"I'll come back to that" — is the title of a to-do; write the to-do before the reply goes
out. Held only in words, the work is one distraction or one compaction from gone. The
hooks enforce this: when the user asks for work while something is open, a reminder rides
in with the prompt; if your reply then defers work and nothing was parked, your next tool
call is refused once, naming the sentence.

When unsure, park it and say so. Parking is cheap and visible, the user decides with one
word, and nothing is lost in either direction. Switching silently is the expensive mistake:
the open work is left half done with no note, and the new work has no declaration. A
parked request is answered, never ignored: the reply names the to-do and its number.

**Example 1.** Open work: "convert the widgets to state-only". The user: "also the login
form's error banner is misaligned, can you fix that at some point".
→ `journal todo "align the login form's error banner" --brief` with what they said, and
the reply says: "Parked as to-do 4; I'll keep going on the widgets."

**Example 2.** Same open work. The user: "wait, the Dropdown is throwing 500s on every
recompose now".
→ It makes the open work wrong. `journal work update "Dropdown recompose returns 500 since the
state-only change; stopping to fix it"`, then `journal work start "fix the Dropdown recompose
500"`.

**Example 3.** Nothing open. The user: "can you add a --json flag to the export command".
→ Read the export command until the change is clear, then `journal work start "add a --json
flag to export"` and build it.

## Tag every message

Open every message with exactly one tag. Talking *about* a tag is not using one.

| tag              | the message…                                                            |
|------------------|-------------------------------------------------------------------------|
| `[!discovery]`   | reports the real shape of something you did not know: a cause, a constraint, a measurement |
| `[!correction]`  | says something you had wrong is now right, including your own earlier message |
| `[!blocked]`     | says you cannot proceed, and on what                                    |
| `[!info]`        | reports something happening that is not work progress: an agent started, a build running |
| `[!reply]`       | answers what was asked, directly. Routine; kept out of the digest        |

When in doubt, `[!reply]`. It is honest for any answer, and it is what makes the rule
keepable: every message can carry a tag, so the check needs no judgement. Only the last
message of a turn is judged; connective lines before a tool call are scaffolding. If the
user interrupts you, nothing in that turn is judged.

## Declare work

    journal work start "<the work, in your own words>"
    journal work update "<what moved>" [--on="<work>"]
    journal work end "<the same words>"

Declare before the first write, never before the first read: edits, `rm`, `git commit`
are refused while nothing is open, and reads never are, because reading is what tells you
what the work is. A good subject is a sentence you will say again. `update` is for where
it got to, not every step: a decision inside the work, a dead end, a change of approach.
`work end` asks whether the work taught anything a later reader would get wrong without;
"nothing" is the usual answer and a fine one. A line that opens the work first,
`journal work start "…" && …`, may write in the same line.

## Pin, rule, or nothing

    journal pin "<the claim, in one line>"     a pin: for this track
    journal rule "<the ruling, in one line>"        a rule: for every track
    ... --doc=N or --doc=N.P                        on either, and on todo: the doc (or part) it rests on
    journal nothing "<why nothing here needs pinning>"
    journal promote <n>                             lift pin n into a rule

Rules, pins, open work and to-dos are the **only** things handed back after a compaction
and to every new session. Tagged messages become retrievable, not present.

**Pin only when all three hold.** Somebody *decided* it. The next reader would get it
*wrong* without it, not merely not know it. It will still be true *tomorrow*. A status, a
count, a percentage, or what you just did fails the third and rots into a confident
falsehood wearing the same authority as the facts that still hold.

    the user ruled motion.ts FORBIDDEN — the CSS transition replaces it        earned its place
    a subagent's hook payload carries the PARENT's session_id; only agent_id tells it apart
    converted 14 of 22 components                                               a status; wrong by tomorrow
    tests pass on the rethink branch                                            a count; wrong by the next commit

**A rule answers one more question:** would it be wrong on any *other* track? "Components
never hold a component as a State field" binds every line of work; write it as a rule, or
`promote` a pin that turns out to. Switching tracks never moves a rule.

**A pin is a claim, not its reasoning.** There is a length cap and no count cap. The
reasoning stays in the transcript; `journal pins <n> --full` reads around it. Several
claims are several pins. Never cite the scratchpad or `/tmp`: those paths exist for one
session, and a pin naming one is refused.

**When the context warning arrives, decide.** At 50%, 70%, 90% and 95% of the window, no
other tool runs until `pin`, `rule` or `nothing "<why>"` has. It forces a decision,
not a pin; `nothing` with a reason is the right answer more often than not. It is also the
moment to park any work you are holding for later, because that lives only in the window.

## Delayed work: the to-do

    journal todo "<title>" [--brief]   add one; --brief reads a longer brief from stdin
    journal todo                       the titles
    journal todo <n>                   the brief
    journal todo start <n>             open work under that title; `work end` closes both
    journal todo done <n> "<how>"      resolved without starting it
    journal todo ask <n> "<question>"  it waits on the user; auto moves on to the next
    journal todo answer <n> "<answer>" the user's answer; the agent is told at its next stop
    journal todo auto [on|off]         work through the list without asking, or wait for the word

A to-do is work that was **put off**: the user said later, or you found something and
were told not to touch it yet. It is a titled file under `todo/<track>/`, and the brief is
what you will need in a week: what exactly, why, where to start, what the user said. Not
for imagined work; "it might be nice to refactor this" is a message with a tag.

**A to-do is not permission, unless the user has switched it on.** With `auto` off, the
default, the start block lists what is waiting and an idle stop says so once; neither is
an instruction to begin one. Start a to-do only when the user says so for that one, or
asks you to work through them, in which case offer `journal todo auto on`. With auto on
for the track, the user has already said it: whenever nothing is open, pick up the next
one with `todo start <n>`, do it, `work end` it, and the next idle stop brings the next. Auto
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

**Ask in two cases, and no others.**

1. **You cannot proceed.** Something only the user can supply is missing: access, a
   credential, a file, a fact that is nowhere in the repo or the transcript. Not "I am
   unsure": unsure is decide.
2. **You are stalled.** The hook tells you when many tool calls have gone by on a to-do
   with no `update` filed. When it does, judge honestly whether there is a measurable
   result. If there is, file it and continue. If there is not, stop pouring time in.

In either case:

    journal work update "<where it got to, and what was tried>"     if you had started it
    journal work end "<the to-do's title>"                          so nothing stays open
    journal todo ask <n> "<what is stuck, and what was tried>"

Say that in your reply, naming the to-do, and stop. The next hold names the next to-do
that is not waiting on the user. The user answers from their terminal with `journal todo
answer <n> "…"`; the next stop tells you which question was answered and what the answer
was, and hands you that to-do first. With auto off, an answer is the user's word to do
that one: start it.

**Work that waits on the user is not open work.** When what is left of a piece of work
is a ruling or a review only the user can give, park that remainder as a to-do with the
questions in its brief, and `work end` the work. Otherwise the journal sees work in flight,
nothing else starts, and with auto on the stop hook will hold you to do exactly this.

## Docs: what was settled, catalogued

    journal docs                                the catalogue: number, title, status, parts, abstract
    journal docs <n>  |  journal docs <n>.<p>   read a doc, or one part
    journal docs add "<title>" --abstract="<one line>" --brief    a new doc, its intro on stdin
    journal docs part <n> "<title>" --brief     a report, a section, a finding — as one part
    journal docs strike <n>.<p> "<why>"         drop a part, on the record
    journal docs final <n>                      when it is settled
    journal docs search <term>                  every line of every doc mentioning it

A pin is a claim, a rule binds, a to-do is work. A **doc** is a finding: a design once it
is ruled, a subagent's report, an investigation with its numbers. It lives in the
project's `docs/` folder as ordinary markdown the user reads and edits, and the journal
catalogues it: every session is handed the catalogue, one line per doc, so nobody
re-investigates what a doc settles.

**Write a doc at the moment something is ruled**, with the ruling as its first line, and
give it an abstract that says what it settles, because the abstract is all a later
session sees until it opens the doc. A subagent's report goes in as a part of the doc it
belongs to, filed by you, which is the moment to judge whether it is worth keeping.
Everything else that is long — a survey, the numbers behind a decision — is a part too.
One doc, many parts; a part is what you replace or strike when it stops being true.

**Cite it.** `--doc=<n>` or `--doc=<n>.<p>` on `pin`, `rule` and `todo` ties the entry
to the doc; the entry shows "→ doc 4.2: <doc> · <part>" beside it, and the doc shows what
cites it. Cite whenever the claim came out of a doc or a doc explains it: the pin is the
one line, the doc is the reasoning a later reader will want. A
pin that only says "read docs/x.md before touching Y" is an abstract wearing a pin; give
the doc that abstract and cite it instead.

**Before re-investigating, read the catalogue.** If a doc covers it, read the doc. If a
doc is wrong, do not write beside it: strike the part, or write the new doc and
`supersede` the old one so every later reader is pointed at the current one.

A markdown file written by hand outside the catalogue earns a hint, once: not a problem,
but if it is a design or a report, file it as a doc so it is handed on and found.

## Tools: scripts kept for repeated work

    journal tools                       every tool: what it does, how to call it
    journal tools <name>                read one
    journal tools run <name> …          run it from the project root
    journal tools add <name> "<title>" --summary="…" --usage="…" --entry=<file> [--brief]

A script you wrote for a job that will come again — move a class with every reference,
list uncovered methods, run a fixer on one directory — is a tool. Put it under
`.journal/tools/<name>/`, or leave it where it is and point `--entry` at it, and
catalogue it with its summary and usage. Every session is handed the catalogue, so the
next agent runs yours instead of writing it again. Before writing a script, read the
catalogue. Running a tool is a write: declare the work first.

## Look before you answer

    journal search <term> [--all]     this track's whole transcript, every session, 25 hits a page newest first

Search when any of these is about to leave your mouth: "I think we decided…", "as
discussed…", "earlier you said…"; the name of a command, flag, option or file the user
chose or rejected; "the user wants X" where X was said more than a summary ago; anything
about work that was open when a compaction happened; an answer to "why did we…" or
"didn't we already…".

A compaction keeps roughly 25,000 characters standing in for the whole session, and it
keeps what was *done* far better than what was *decided*. A half-remembered ruling feels
like knowledge and is subtly wrong: the wrong flag, the rejected option, the constraint
backwards. That is worse than an admitted gap, because nobody questions it. `search`
prints line numbers, which are citations. If it comes back empty, say the record does not
have it rather than filling the space.

## After a compaction, or at a start

    journal conversation --back=1   the stretch the last summary REPLACED
    journal user                    the user's own words, in full
    journal open                    work declared and never closed, with its notes

After a compaction, read `conversation --back=1` and `user` before you touch anything;
they are precisely what the summary dropped. At a fresh start, the block names the track
this session is bound to and lists the standing rules, pins, open work and to-dos. If it
leads with "TRACK … IS TAKEN", another running session holds that track: tell the user, ask
which track this session works on, and `switch` before anything else. Work opened by an
earlier session is listed so you know it exists, not held against you; before continuing
it, `open` shows where it got to.

## If a hook holds or denies you

Read what it says and do that one thing. A hold is one line, and holds come one per
stop in a fixed order — track, loop, context, deferral, untagged, work, auto — so what
you are shown is the first thing owed, and the next stop shows the next. When the line ends with
"details: `.journal/journal.py next`", run that first: it prints the full text of the
hold, which to-do is next, the questions the user answered, or what is filling the
context. `journal next` also answers the loop prompt in auto mode: it says the one
thing to do now.

| it says                                                        | do                                                     |
|----------------------------------------------------------------|--------------------------------------------------------|
| *N message(s) carried no tag*                                  | tag your next message; it will not hold for those lines again |
| *N piece(s) of work still open*                                | `work end` it, or `update` where it got to                  |
| *Nothing is open, so this edit would not be filed*             | `work start` the work, then edit                            |
| *context N% full — decide before any other tool runs*          | `pin`, `rule` or `nothing "<why>"`                |
| *your reply puts work off — park it as a to-do*                | `todo "<title>" --brief`, then say so; or run the call again if nothing is deferred |
| *journal: work is open — … If this asks for something else*    | decide: same work, park it, or `update` and `work start` |
| *auto is on, N to-do(s) waiting*                               | `journal next`, then `todo start <n>`                  |
| *auto is on, no loop running*                                  | start one: the `loop` skill with `15m journal next`; `journal loop set` if one already runs |
| *track `x` is taken by another session*                        | ask the user which track this session works on, then `switch "<name>"` |
| *That pin would be refused*                                    | cut it to the claim, or drop the scratch path          |
| *`journal <verb>` from a subagent is refused*                  | you are a subagent: report; the main conversation files |
| *THAT … CALL RETURNED N CHARACTERS*                            | nothing to undo; read narrower next time               |
| *… is a markdown file written outside the journal*             | a hint: `docs add` or `docs part` if it is a design or a report; otherwise ignore |
| *… is a script you wrote / has now run twice / scratch script*  | a hint: `tools add` if the job comes back; otherwise ignore |
