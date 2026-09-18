---
name: journal
description: "The project's journal, core skill: the first decision on every request (the current work, a to-do, or work to do now), the tag on each message, declaring work, choosing the environment, looking before you answer, and what to do at a start, after a compaction or when a hook holds you. Use it whenever the user asks for a feature, a fix or any piece of work, even a small one; whenever a hook holds your stop or refuses a tool call; when the user says later, not yet, also or by the way; when you are about to say 'I think we decided'; and at every start and after every compaction. The detail lives in nine focused skills that load beside it: journal-todos, journal-questions, journal-messages, journal-memory, journal-docs, journal-agents, journal-plans, journal-reports and journal-transcripts. It also carries the one rule for every dispatch: name the model. Not for subagents: a subagent reports what it found and the main conversation files it."
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
command reference, environments, what is shared, and why the design is what it is are in
[references/commands.md](references/commands.md); read it when you need an option or a
verb you do not remember.

## When the user asks for work

Every request is one of three things, and deciding which comes before anything else.

1. **It is the current work**, a step of it, or a correction to it. Carry on. If the
   direction changes, `journal work update "<what changed>"` says so.
2. **It is different. This is a to-do — the default, and it needs no justification.**
   `journal todos add "<title>" --brief` with the brief on stdin, then say in your reply
   that it is parked as to-do n, and carry on with what is open. If it builds on or has to
   wait for another open to-do, add `--after=<n>` (the `journal-todos` skill). **Do not `work end` to
   make room**: ending work is not finishing a row, and the row you are on stays yours.
3. **It is different and the user said to do it NOW.** That is the exception and it is
   THEIR word, not your judgement — "now", "first", "stop", "instead", "actually" — or it
   blocks the open work, or it makes the open work wrong. `update` the open work with where
   it got to, then `work start` the new one. If you are genuinely abandoning the old work,
   `work end` it — and know that the to-do of that title STAYS OPEN unless you pass
   `--todo`, because abandoning work is not finishing a row.

With nothing open, the request *is* the work: read until you can name it, `work start` it, go.

**THE DEFAULT IS 2, AND THE BURDEN IS ON 3.** The question is not "can this wait?" — that
puts the call on you, and you will get it wrong in the user's favour every time, because
answering feels helpful. The question is "did they tell me to do it now?" If the sentence
does not say so, it is a to-do. "Later", "after this", "also", "by the way", "when you get
to it" are not needed to make it one; they only confirm what was already true.

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
→ `journal todos add "align the login form's error banner" --brief` with what they said, and
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

**One message in a stretch may matter more than the rest, and you can say so.** `[!]` after the
tag — `[!discovery][!] the cause was a font ligature` — outlines that turn in the user's chat.
It is your own call and it is optional; nothing is refused for lacking it, and a stretch where
everything is outlined has said nothing. Use it for the thing they would be sorry to scroll past.

When in doubt, `[!reply]`. It is honest for any answer, and it is what makes the rule
keepable: every message can carry a tag, so the check needs no judgement. Only the last
message of a turn is judged; connective lines before a tool call are scaffolding. If the
user interrupts you, nothing in that turn is judged.

**When the user works from the viewer** (Settings, *Work from the viewer*, per environment),
keep each terminal message to its one tagged line and put the answer where they read it: a
reply on their message (`journal messages reply`), a report for research, a question for a
decision. The session start says when it is on. The tag still opens the line.

## Declare work

    journal work start "<the work, in your own words>"
    journal work update "<what moved>" [--on="<work>"]
    journal work await "<what you wait on>" [--agent=<id>|--pid=<n>] [--for=<minutes>] [--on="<work>"]
    journal work park "<why it is set aside>" [--on="<work>"]   it stays open, off the nudging, until the first update
    journal work end "<the same words>"
    journal work end "<the same words>" --todo   and close the to-do of that title; without it the row stays open, because ending work is not finishing a row
    journal work end --force ["<note>"]      close work whose declarer is GONE: a deleted worktree, a crashed session — its subject is unguessable, so the note replaces the match

Declare before the first write, never before the first read: edits, `rm`, `git commit`
are refused while nothing is open, and reads never are, because reading is what tells you
what the work is. A good subject is a sentence you will say again. `update` is for where
it got to, not every step: a decision inside the work, a dead end, a change of approach.
`work end` asks whether the work taught anything a later reader would get wrong without;
"nothing" is the usual answer and a fine one.

**`work await` when the work is in flight on something you cannot hurry** — a subagent
running, a build, a review, a person. The stop stops nudging that piece, because a hold
that fires while nothing can move is noise, and noise is what teaches a reader to clear a
hold without reading it.

**Name what you are waiting on.** `--agent=<id>` for a subagent you dispatched, `--pid=<n>`
for a process you started. A sentence is a claim nobody can check; an identifier is a fact
the machine can. A pid is watched: when that process exits, the wait is over at the very
next stop instead of burning its whole timeout. An agent id cannot be tested — nothing
exposes a subagent's liveness to a hook — so it is recorded and named back to you in the
hold, which is what tells you WHICH of three dispatches you are still waiting on.

**It always expires** — 20 minutes by default, `--for=` to say otherwise, capped at two
hours. When it does, the hold returns naming what was awaited and for how long, and the
only question worth asking is whether it is still coming: `work update` what you know,
`work await` again to keep waiting, or `work end` it. A wait with no end is how work is
abandoned quietly — the awaited thing dies, nothing nudges, and the journal reads as busy
forever. If you are waiting on a loop or a cron to wake you, set `--for=` past its next
cycle, so the wake-up arrives before the hold does.

**`work park` is for being STUCK, or for doing something else in the meantime.** Those are
the two things it means, and it means nothing else. It is not a way to wait for an answer
that the work itself could have asked by producing something: a draft asks a better question
than a question does, because the user corrects a sentence instead of answering three. Before
parking, ask whether there is anything you could still be DOING — if there is, do it, and let
what you make carry the question. Under auto mode a wrong park is worse than idle, because
the list stops with it.

**The wait ends by itself when the work resumes.** The first write — an edit, a `rm`, a
command that changes something — cancels it, because nothing that is still blocked edits a
file. Reading does not: polling a log or checking a build is what waiting LOOKS like. Any
`work update` or `work end` ends it too, because progress means the waiting is over. Never await something already finished, and never re-await to dodge a hold you owe
an answer to. A line that opens the work first,
`journal work start "…" && …`, may write in the same line.

## Pin, rule, reminder, or nothing

Rules, pins, open work and to-dos are the **only** things handed back after a compaction
and to every new session. Tagged messages become retrievable, not present.

**A pin is a FACT. A reminder is an INSTRUCTION.** This is the line agents blur most, so
here it is four ways:

    would a later reader be WRONG without it?          a pin
    will you stop DOING it, though you already know?   a reminder
    is it one thing to do, later?                      a to-do
    does it bind every environment?                    a rule

**When the context warning arrives, decide.** At 50%, 70%, 90% and 95% of the window the stop
asks for `pin`, `rule` or `nothing "<why>"`. It forces a decision, not a pin; `nothing` with a
reason is the right answer more often than not. It is also the moment to park any work you are
holding for later, because that lives only in the window. **With `gate_after_context_rung` on —
off by default — it is more than a question: no other tool runs until one of the three has.**

Everything else about them — when a pin earns its place, the reasoning under a claim, reminders and their `--until`, moving claims, and cleaning out what stopped being true — is in the `journal-memory` skill. Load it before you write one.

## The focused skills: load the one the moment needs

This skill decides what a request is and keeps the record honest. The detail for each part is
its own skill, and each loads by itself when its situation comes up. If one has not, load it
before you act:

| skill | load it when |
|---|---|
| `journal-todos` | you park, start, block or close a to-do; auto mode is on; a commit should close a row |
| `journal-questions` | you are about to ask the user anything; the question tool is refused; a question was answered; you would propose a change |
| `journal-messages` | the user left a message or a comment; you are about to notify them; the viewer or its channel comes up |
| `journal-memory` | you are about to pin, rule or remind; a context warning asks for a decision; a cleanup report is ready |
| `journal-docs` | the user asks for something checked or researched; something was ruled and should be written down; you would write a reusable script |
| `journal-agents` | before every subagent dispatch; a subagent must write; a subagent's journal command is refused |
| `journal-plans` | the user asks for a plan, a roadmap or phases; you are about to draft one; a plan is active, refuses to start or stalls; a plan should be stopped |
| `journal-reports` | the user asks you to check, research, compare or review something; a dispatch comes back with findings; a report should be archived or become a doc |
| `journal-transcripts` | a message arrives declared as a transcript; a long paste reads like one; you are about to file to-dos or a plan out of either |

**One rule from `journal-agents` belongs here, because a dispatch does not wait for a skill to load:
name the model on every subagent you dispatch** — `haiku` for mechanical work with a known answer,
`sonnet` for care without invention, `opus` only where the task turns on judgement. It is rule B1,
shipped to every project and injected at every start.

## The environment is chosen once, and never by you again

**You choose an environment at the START, by asking the user, and you never switch again on
your own initiative.** Not to tidy up. Not to park work you cannot do. Not because another
environment already exists and looks like a precedent for making one.

    at the start        `journal environments` lists them → ask the user which → `journal switch "<name>"`
    ever after          only when the user names one

This is not a style preference, and here is the failure it is written from. An agent met a
to-do it was forbidden to start while the stop hook refused its stop. It reasoned, fairly,
that the list should stop offering work it could not do — and then made a new environment
to park it on. Two things made that feel sanctioned: a stray environment from its own
earlier session was sitting there looking like an established convention, and `prepare`
creates AND switches in one command, so the switch was a second effect it never looked for.
**Reminders are per-environment. The moment it switched, every guardrail it had went
silent**, and it only noticed by chance.

So: an environment somebody's session left behind is not evidence that making one is
normal. Housekeeping is not an exception. If the list is offering work you cannot do, the
answer is on the to-do — `todos block` or `todos ask` — never a new place to put it.

## Look before you answer

    journal search <term> [--all]     this environment's whole transcript, every session, 25 hits a page newest first
                                      (the viewer's Search page also finds the journal's to-dos, pins, rules, docs and messages)

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

**ASKING IS THE LAST RESORT, AND THE RECORD IS THE FIRST.** A question costs the user their
attention and costs you the rest of the turn; a search costs one command and answers most of
them. Before `journal questions add`, before "which did you mean?", before a message that ends
in a question mark: `journal search <term>`, `journal conversation --back=1`, `journal user`.
Ask only what the record CANNOT hold — a preference nobody has stated, a judgement that is
theirs, a fact about the world outside this project. Anything they have already said, ruled,
struck or chosen is in there, and asking again tells them you did not look.

**And when a mechanism is what you are unsure about, RELOAD THE SKILL rather than remember
it.** What you are holding after a compaction is a summary of these files, and a summary of a
rule is not the rule — it is the rule with its exceptions filed off. The skills are on disk,
they are current, and reading one costs less than being confidently wrong about what it says.
Reload the core skill and the focused one for what you are doing whenever a hook holds you,
whenever you are about to say what the journal "does", and always after a compaction.

## After a compaction, or at a start

    journal conversation --back=1   the stretch the last summary REPLACED
    journal user                    the user's own words, in full
    journal open                    work declared and never closed, with its notes

After a compaction, read `conversation --back=1` and `user` before you touch anything;
they are precisely what the summary dropped. At a fresh start, the block lists the standing
rules, pins, open work and to-dos, and says which environment this session is on.

**A new session is on none.** It is not given one: you choose it, from the first thing the
user says, because you are the one who has read it. **The one exception is not a choice at all**:
where the project has exactly one environment AND a message is waiting on it, the session is bound
to it before your first prompt — there is nothing to choose between, and asking would leave the
message unread. If that message names or plainly implies
an environment, take it — `journal switch "<name>"` — and say in one line which you took, so
a wrong guess costs one word to correct. If the work is real and belongs on none of them,
`journal prepare "<name>"`. If the message asks for nothing to work on — a greeting, a
question about the record — ask which environment before you answer it. Never fall back to
the first on the list: an environment nobody chose is how work lands where nobody looks.
Reads work unbound; every write is refused until one is taken. The user sees a line saying
so at the start, so the question is expected. `bind_on_start` puts the old behaviour back,
where a session began on the project's start environment.

If the block leads with "ENVIRONMENT … IS TAKEN", another running session holds that
environment: tell the user, ask which environment this session works on, and `switch` before
anything else. Work opened by an
earlier session is listed so you know it exists, not held against you; before continuing
it, `open` shows where it got to.

**When the holder is gone, claim it** — `journal claim "<name>" "<why>"`. One session works
an environment, so a switch onto a held one is refused; but a holder can be a closed
terminal or a crashed session, and then the refusal protects nobody and blocks the work. A
claim unbinds that session and binds you. It is not free and not silent: the reason is
required, the claim is kept on the record with who took it from whom, and the evicted
session is told at its next stop what happened and how to take it back. Nothing of the
environment is deleted. **Ask the user first** unless they have already said to take it —
the holder may be a session they are using.

`switch`, `claim` and `prepare` each answer under the noun too:
`journal environments switch "<name>"` is the same command as `journal switch "<name>"`.
(`delegate` and `handoff` were removed in 1.37.0; both now answer with a refusal saying why.)
The noun answers to `env`, `envs`, `environment`, `tracks` and `track` as well.

## If a hook holds or denies you

Read what it says and do that one thing. A hold is one line, and holds come one per
stop in a fixed order — claimed, environment, inbox, comments, loop, context, deferral, untagged, questions, suggestions, suggest_hint, work, skills, auto, recall, cleanup — so what
you are shown is the first thing owed, and the next stop shows the next. When the line ends with
"details: `.journal/journal.py next`", run that first: it prints the full text of the
hold, which to-do is next, the questions the user answered, or what is filling the
context. `journal next` also answers the loop prompt in auto mode: it says the one
thing to do now.

| it says                                                        | do                                                     |
|----------------------------------------------------------------|--------------------------------------------------------|
| *the user left N message(s) for you*                      | `journal messages`; split each into parts with `messages process`, a question for any part you do not understand, then `messages done` |
| *the user left N new message(s) for you — … nothing is blocked* | finish the step you are on, then process them the same way |
| *the user commented on to-do N*                                | act on what it asks, then `comments done <n> "<what was done>"` |
| *the user answered question N*                                 | act on the answer; `journal questions show <n>` reads it in full |
| *the user decided suggestion N*                                | accepted or adjusted: a to-do was filed, work it like any other; declined: drop it and do not file it again |
| *your reply proposes a change nobody asked for*                | a hint: `journal suggest "<the change>" --brief` if the user should decide it; otherwise ignore |
| *A subagent dispatch must name its model*                       | add `model`: haiku, sonnet or opus. A fork, or an agent whose definition sets its model, goes through |
| *AUTO IS ON, so the question tool is refused*                  | `questions add "<question>" --about=<ref>` and carry on with what does not depend on it |
| *N untagged message(s)*                                        | tag your next message; it will not hold for those lines again |
| *this session has not opened a journal skill*                  | load the `journal` skill and the focused one for what you are doing. It fires after a dozen tool calls, because a session working from memory is working from a summary of these files |
| *what you searched for is attached to a doc*                   | read the doc's own copy before grepping the repo: `journal docs <n>` — somebody already filed it |
| *work still open* / *auto is on, work still open*              | `work end` it, `update` where it got to, or `work await "<what>"` if it is in flight |
| *auto is on, but the open work was opened by another session*  | not yours to end: leave it to that session; if that session is gone, `work end --force "<note>"` if it is finished, or ask the user |
| *Nothing is open, so this edit would not be filed*             | `work start` the work, then edit                            |
| *context N% full — decide before any other tool runs*          | `pin`, `rule` or `nothing "<why>"`                |
| *work deferred in words, not parked*                           | `todo "<title>" --brief`, then say so. If nothing was put off: at a stop, say so in one line; before a tool call, run the call again |
| *journal: work is open — … If this asks for something else*    | decide: same work, park it, or `update` and `work start` |
| *auto is on, N to-do(s) waiting*                               | `journal next`, then `todo start <n>`                  |
| *auto is on for `x`, but nothing on the list can be picked up* | nothing to start: each reason is named. Answer or wait; a row reported finished by an agent is yours to close with `todos done <n>` |
| *N to-do(s) waiting on `x`*                                    | shown to the user: delayed work, not an instruction to start any of it |
| *auto is on, no loop running*                                  | start one: the `loop` skill with `15m journal next`; `journal loop set` if one already runs. While it stands the next WRITE is refused — auto without a loop is a promise nothing keeps |
| *a cleanup report is ready — N entr(ies) …*                     | when you reach a pause: `journal cleanup`, then `cleanup read`; strike what you judge dead. Never a hold |
| *N thing(s) in the record have evidence against them*          | `journal cleanup`, then `cleanup read`, then strike what you judged dead |
| *the reading pass … was never done / N d ago*                  | `journal cleanup read` — judge every rule and pin against the code you just worked in |
| *… are in force here, and the block that handed them to you is far behind* | `journal cleanup read` if the reading pass is owed; otherwise `journal rules` and `journal pins` read them back |
| *environment `x` is taken by another session*                        | ask the user which environment this session works on, then `switch "<name>"`; if the holder is gone and they say so, `claim "<name>" "<why>"` |
| *environment `x` was claimed by another session*                     | another session took it and said why; you are bound to nothing — `switch "<name>"`, or `claim "<name>" "<why>"` to take it back |
| *THIS SESSION HAS NO ENVIRONMENT*                              | take one from what the user just asked — `switch "<name>"` — and say which; ask them if it named none |
| *That pin would be refused*                                    | cut it to the claim, or drop the scratch path          |
| *`journal <verb>` from a subagent is refused*                  | you are a subagent: report; the main conversation files |
| *THAT … CALL RETURNED N CHARACTERS*                            | nothing to undo; read narrower next time               |
| *… is a markdown file written outside the journal*             | a hint: `docs add` or `docs part` if it is a design or a report; otherwise ignore |
| *… is a script you wrote / has now run twice / scratch script*  | a hint: `tools add` if the job comes back; otherwise ignore |
| *… has been read N times … not a source file*                  | a hint: `docs attach <doc> <path> "<what it is>"` if it is reference material; otherwise ignore |

Each row's detail lives in a focused skill: messages and comments in `journal-messages`; answered questions, decided suggestions and the refused question tool in `journal-questions`; to-dos, auto and the loop in `journal-todos`; the context decision, pins and cleanup in `journal-memory`; subagent refusals in `journal-agents`; the markdown, script and attachment hints in `journal-docs`; a transcript and what it becomes in `journal-transcripts`.
