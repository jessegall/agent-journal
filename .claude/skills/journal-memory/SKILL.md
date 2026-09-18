---
name: journal-memory
description: "What the journal hands to every later session: pins (facts that stay true), rules (bind every environment), reminders (instructions said again until retired), the context-warning decision, moving claims between environments, and cleaning out what stopped being true. Use it before writing a pin, rule or reminder; whenever the user says remember this, always, never, from now on, that is a rule, or has had to say something twice; when a context warning asks you to decide; and when a cleanup report is ready or a claim looks stale. Not for subagents."
---

# Journal pins, rules and reminders

**Not for subagents.** A subagent reports what it found; the main conversation files it.
It is one of the journal's skills; the core `journal` skill says when each applies.
Every command runs through `.journal/journal.py`; `journal` is an alias for it.

## Pin, rule, or nothing

    journal pins add "<the claim, in one line>"     a pin: for this environment (also: `journal pin "<claim>"`)
    journal rules add "<the ruling, in one line>"   a rule: for every environment (also: `journal rule "<ruling>"`)
    ... --doc=N or --doc=N.P                        on either, and on todo: the doc (or part) it rests on
    journal nothing "<why nothing here needs pinning>"
    journal pins promote <n>                        lift pin n into a rule (also: bare `journal promote <n>`)
    journal pins move <n> "<env>"                   carry a claim to another environment
    journal docs move <doc> "<env>"                 point a doc at another environment

Rules, pins, open work and to-dos are the **only** things handed back after a compaction
and to every new session. Tagged messages become retrievable, not present.

**A pin is a FACT. A reminder is an INSTRUCTION.** This is the line agents blur most, so
here it is four ways:

    would a later reader be WRONG without it?          a pin
    will you stop DOING it, though you already know?   a reminder
    is it one thing to do, later?                      a to-do
    does it bind every environment?                    a rule

A pin is true whether or not anyone acts on it — "a subagent's payload carries the parent's
session_id", "the harness caps hook output at 10,000 characters". Nobody has to do anything
for it to stay true. A reminder is not true or false; it is obeyed or forgotten — "run the
suites before saying a change works". It exists because of drift, not ignorance.

Getting it wrong costs both ways. An instruction written as a pin is re-read at every
compaction and obeyed by nobody, because a pin is handed over as knowledge and nothing
repeats it. A fact written as a reminder is shouted every fifty tool calls forever and can
never be retired, because its `--until` will never come true — it was never a condition.

**Pin only when all three hold.** Somebody *decided* it. The next reader would get it
*wrong* without it, not merely not know it. It will still be true *tomorrow*. A status, a
count, a percentage, or what you just did fails the third and rots into a confident
falsehood wearing the same authority as the facts that still hold.

    the user ruled motion.ts FORBIDDEN — the CSS transition replaces it        earned its place
    a subagent's hook payload carries the PARENT's session_id; only agent_id tells it apart
    converted 14 of 22 components                                               a status; wrong by tomorrow
    tests pass on the rethink branch                                            a count; wrong by the next commit

**A rule answers one more question:** would it be wrong on any *other* environment? "Components
never hold a component as a State field" binds every line of work; write it as a rule, or
`promote` a pin that turns out to. Switching environments never moves a rule.

**A pin is a claim, and its reasoning goes underneath it.** There is a length cap on the
claim, because the claim is what is re-read at every session start, every compaction and by
every subagent — shortened there to a line, with `journal pins` beside it reading every one
in full. So write the claim to survive being cut to its first line: put what it rules FIRST
and the qualification after. The argument is not cut, it is MOVED: `--brief` on the same
command takes it on stdin, uncapped, and it is never injected anywhere.

    journal rules add "<the ruling>" --brief        the reasoning on stdin
    journal rules show <n>                          the claim and its reasoning
    journal rules <n> --full                        the conversation it was written in
    journal rules amend <n> "<section>" --brief     append a section
    journal rules replace <n> --brief               swap it; the old text goes to struck/

Pins take all five too. **Write the long form when the argument is worth having and the
transcript will not survive to carry it** — a rule promoted from a pin, a ruling another
repo will read, anything a later reader would otherwise have to reconstruct. An empty one
is honest: nothing asks for it and nothing nags.

Several claims are still several pins. Never cite the scratchpad or `/tmp`: those paths
exist for one session, and a pin naming one is refused.

**When the context warning arrives, decide.** At 50%, 70%, 90% and 95% of the window the stop
asks for `pin`, `rule` or `nothing "<why>"`. It forces a decision, not a pin; `nothing` with a
reason is the right answer more often than not. It is also the moment to park any work you are
holding for later, because that lives only in the window. **With `gate_after_context_rung` on —
off by default — it is more than a question: no other tool runs until one of the three has.**

**When work is reframed, move what belongs to it.** A piece of work that turns out to be a
different thing gets its own environment, and the to-dos, pins and docs already filed under
the old name go with it: `todos move`, `pins move`, `docs move`. A to-do's file moves and
its number changes, so the reply names both. A pin is STRUCK where it was and added where it
went — a pin's number is its position in the list, and lifting one out would renumber every
pin after it. A doc does not move at all: only its `track:` does, so every citation of it
keeps working. A RULE cannot move: it binds every environment, so if it only describes one
line of work it was never a rule — strike it and pin it there.

**Retire what has stopped being true, and do not wait to be asked.**

    journal cleanup [--all]        what has EVIDENCE against it, beside the command that retires it
    journal cleanup read           every rule and pin in full — the half only reading finds
    journal rules strike <n> "<why>"     |  journal pins strike <n> "<why>"
    journal rules inject <n>             the user wants it in CLAUDE.md too; `rules uninject <n>` takes it out

Rules and pins are re-asserted verbatim at the top of every compaction, in the highest
authority the system has, and nothing revisits them. `cleanup` finds the entries with
something checkable against them — a claim naming a file that is gone or a `journal <verb>`
the CLI does not answer to, a doc whose environment no longer exists, a to-do that has been
waiting on the user, an environment with nothing on it. Age is never evidence on its own.

**A cleanup is two passes, and the mechanical one is the smaller.** What no command can
find is the rule that quietly stopped describing how anyone works: it names no file,
misspells nothing, and passes every check forever. `journal cleanup read` is the second
pass — every rule and every pin in full, with the questions to ask of each — and it is not
optional. Run it after the mechanical pass, judging each claim against the code you have
just been working in, because you are the only reader who has both in front of them. The
record keeps when it was last done, never what was decided.

**Strike what you have read and judged dead**: the reason is required, and a strike hides
the claim rather than erasing it — `journal rules --all` and `journal pins --all` still
show it — so being wrong is cheap and leaving a dead rule standing is not. `pins add
"<the claim now>" --supersedes=<n>` when it is right but out of date.

## When you keep having to be told: the reminder

    journal reminders add "<the instruction>"                 said again at EVERY stop
    journal reminders add "<…>" --until="<the condition>"     …until you judge that true
    journal reminders                                         what is being repeated here
    journal reminders done <n> "<what made it true>"          retire one; the reason is required
    journal reminders move <n> "<env>"                        it belongs to an environment, like a pin

**A pin is told once; a reminder is told again.** Everything else in the record is handed
over at a start and on the far side of a compaction, and then it sits in a window that
grows by tens of thousands of characters an hour — an instruction fifty tool calls back is
read with less weight than the result that just landed. That is drift, and it is not
solved by pinning harder. A reminder is the one channel here that repeats: it is said at
every stop, ahead of the stop queue and without spending its one slot, and again every
`reminder_every` tool calls (50 by default) in between. Once per stop CHAIN, not per stop
event — a stop that returns anything is re-entered, and a reminder that answered its own
re-entry would wake the session in a loop with nobody asking for anything.

**Write one when the user has had to say something twice**, or says it in a way that means
*keep doing this*: "always run the suites first", "stop asking me before you commit",
"check the shipped skill copy after every edit". If the next reader would merely be
*wrong* without it, that is a pin. If *you* will be wrong about it again in an hour, that
is a reminder. If neither, it is a message, and a message is free.

**The user sees it too, and that is the point.** They wrote it; the line that comes back at
each stop is how they know it landed. So keep it to the instruction — the cap is tighter
than a pin's, and the reasoning behind it belongs in a pin or a doc.

**`--until` is prose, and YOU are what evaluates it.** Nothing in the CLI can check "the
migration tests pass on CI" — the condition is handed back to you at every firing, and you
retire the reminder yourself the moment it reads true, the way you strike a stale rule and
without asking. The reason is required and the text stays under `--all`, so being wrong
costs one line to undo. Nothing here ever expires on its own: a reminder the user wrote
and nobody retired is one they are still owed.

## What belongs to an environment lives in its folder

    .journal/environments/<name>/pins.json    what is pinned there
    .journal/environments/<name>/work.json    what is open there
    .journal/environments/<name>/todo/        its to-dos, one file each

A RULE IS THE PROJECT'S and sits outside the environments — it binds all of them. A DOC HAS
A SCOPE: it belongs to the environment it was written on, or to the project with
`--global`, and `journal docs move <n> "<env>"|--global` changes which. Scope decides what
is LISTED, never what can be read: every doc stays readable by number from every
environment, so a rule that binds everywhere can cite one without the citation going dark. Nothing here is edited by hand; the commands own these
files. An older layout is carried across the first time a new version reads it, by whichever
process gets there first — `journal migrate` says what is pending and what has run.
