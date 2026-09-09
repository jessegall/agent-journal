# Changelog

Newest first. Each entry is what changed, what it makes possible, and what to do about it.
`journal upgrade` prints the entries since the version you had; a session started on a
newer version than the last one it saw is handed the same.

## 1.43.3 — a suite that failed four times and never on demand

`test_migrate.py` reported one failed check, four times in one day, always inside a batch,
never alone. Ninety runs afterwards — alone, six at a time, and four full rounds of every
suite in parallel — were green. Both original sightings were on a machine that was also
running three dispatched agents.

TREATED AS LOAD, AND SAID SO RATHER THAN DRESSED UP AS LOGIC. Every command in these suites
spawns a real CLI, and the package's own start is ~90ms before it does anything; a
60-second subprocess ceiling is generous until a dozen of them compete for one disk, and a
timeout there raises inside the caller and is counted as a failed check with no line printed
— which is exactly the shape that was seen. The ceiling is 180s, in all 128 places that had
it, and the reasoning is written into the suite so the next person to see it knows what was
already ruled out and what to do if it comes back.

One correction to the record while chasing it: the first report said the FAIL line was never
printed. It is printed; the grep that looked for it re-ran the suite, which passed. A
measurement that reruns the thing it is measuring is not a measurement.

## 1.43.2 — `journal next` stops handing back a list the record has moved past

A hold's long half is written to the transcript's runtime file and `journal next` prints it.
Most held details are facts about the MOMENT — the line an untagged message was at, the
reading that tripped a context rung — and are as true later as they were then. A LISTING of
what is waiting is not.

Seen twice in one session: `work end` closed a row, printed "to-do N is done with it", and
the very next `journal next` offered N as the thing to start. Reading the snapshot cleared
it, so the second call was right — which is how it stayed hidden, and why the first attempt
to reproduce it through `todos done` found nothing. `next` is the command auto mode tells an
agent to run, so the one stale read lands on the reader least able to notice it.

The hold now records which to-dos were open when it wrote the text, and `next` shows the
snapshot only while that still describes the list; otherwise it drops it and answers from
the record. Nothing has to know which subjects list rows — a hold whose detail never
mentioned the list is simply never contradicted by it.

## 1.43.1 — a refusal says which journal is speaking

There can be more than one journal within a session's reach, and a subagent dispatched from
here runs under THIS project's hook whatever directory it was sent to work in. So an agent
working in another project, against another journal, is refused by this one and judged
against this one's record — and nothing in the refusal said so.

Measured: a dogfood agent sent to work three directories down in a scratch project spent
most of its run trying flag after flag against a journal that was never the one refusing it.
Every refusal it received was correct and none of them was answerable, because the two
halves of the sentence belonged to different projects. Every refusal now opens with the
project whose journal wrote it.

## 1.43.0 — a printed command carries the flags the reader has to type

`journal todos 1` ended its brief with the commands that act on that row — `journal todos
start 1`, `journal todos done 1 "<how>"`, and the rest — and none of them carried `--env` or
`--as`. A lent agent must put both on every command it runs. So the dispatch prompt said one
thing, the journal's own printed line said another by omission, and an agent that ran what
was printed hit a refusal it had just been told how to avoid. Found by a dogfood agent
working three directories down from the journal.

THE CLI CANNOT KNOW IT IS TALKING TO AN AGENT — that is the identity collision the grant
exists for, and it does not stop applying here. But it knows what THIS command line carried:
an agent that got as far as reading a brief typed the flags to get there, so every command
printed back to it is now spelled the way the one it just ran was. A session passes nothing
and sees nothing added, which is the case that has to stay clean.

ONLY BEFORE A VERB THE CLI ANSWERS TO, from the table `help` already keeps. `journal` is an
ordinary word in most of the sentences this package prints, and "the journal is in force
here" must not become "the --env=… journal is". A table is the difference between a rewrite
and a corruption.

## 1.42.2 — every printed path, not only the executable

1.42.0 rewrote `.journal/journal.py` to whatever runs from where the reader is standing, and
a dogfood agent three directories down found the gap the same afternoon: a to-do's brief
ends with the FILE it was written to — `.journal/environments/x/todo/001-….md` — and that
resolved only from the project root.

Every path this package prints starts with the same four characters, so every one of them
was wrong from the same places, and fixing the one that happened to be a command would have
left the rest to be found one at a time. The rewrite is on the prefix now.

## 1.42.1 — a wait that names what it waits on survives a write about something else

`work await` ends on the first write, on the reasoning that nothing still blocked edits a
file. That is right about the common case and wrong about the case awaiting actually
creates. Measured in this project's own session: it awaited a dispatched agent, shipped a
release while the agent ran — commits, a version bump, four to-dos closed — and the wait was
cancelled by its own writes; the next stop then asked about work that was still genuinely in
flight. "Nothing still blocked edits a file" is true of the session's OTHER work and says
nothing about this piece, and a wait cancelled by an unrelated write punishes exactly the
behaviour awaiting was built to allow.

A wait with `--agent=` or `--pid=` already had three endings that are not somebody typing:
the clock, the process exiting, and an explicit `work update`/`work end` on that subject. It
keeps those and gives up the fourth. A wait that names nothing — "waiting on the build",
with nothing to check — still ends on the first write, because for that one a write really
is the only signal there is. The two are told apart in the sentence `await` prints, so the
reader knows which kind they just filed.

## 1.42.0 — the journal is found by walking up, and a new worktree is handed one

THE LAYOUT THIS BROKE ON IS ORDINARY AND IN DAILY USE:

    worldwatchmarket/        no git here at all — but this is where .journal lives
      chronos/               a repository
        .claude/worktrees/…  Claude Code's own worktrees, three levels down
      site/                  another repository
      site-shopify-fix/      a linked worktree of `site`, sitting as a sibling

Every piece was correct for a session standing at the root and silently wrong from the four
other places an agent actually works. The journal found itself by where its own script sat.
The hook was registered as `"$CLAUDE_PROJECT_DIR"/.journal/hook.py` — and
`.claude/settings.json` is read from the STARTING DIRECTORY'S OWN `.claude/`, with no
parent-directory fallback, so in a repository under that root the hook was simply never
registered. And every printed line said `.journal/journal.py`, a path that exists only at
the top: an agent in `chronos/` ran what it was told and got "No such file or directory",
from a system whose entire job is telling an agent what to run. None of it announced itself,
because a hook that is not registered is silent by definition.

THREE FIXES, AND THEY ARE THE SAME FIX SEEN FROM THREE SIDES.

`worktree.nearest()` walks up for the closest `.journal`. No git, no remote, no assumption
about layout — and it is what a person does: the journal is the nearest one above you.

THE REGISTERED COMMAND WALKS UP TOO, from `${CLAUDE_PROJECT_DIR:-$PWD}`, bounded at forty
levels, exiting 0 in silence when there is nothing above — a journal that is not installed
above you is a different project, not an error. AND EXISTING INSTALLS ARE REWIRED: `install`
used to skip any event that already mentioned `hook.py`, so every project installed before
this would have kept the old command through every upgrade, for ever. It rewrites anything
that runs `hook.py` now, and leaves the rest of the file alone.

EVERY PRINTED COMMAND IS SPELLED FOR WHERE THE READER IS. `fmt.cli()` computes it once from
the journal's real location and the reader's directory: the relative form survives while it
is honest, and the absolute path takes over the moment it would lie. The rewrite happens as
the text leaves, in `fmt.block`, rather than at each of the forty sites that spell it — a
line written tomorrow is right without its author knowing there was a question.

AND A WORKTREE CLAUDE CODE MAKES IS HANDED THE JOURNAL AT CREATION. `WorktreeCreate` fires
for `--worktree`, for `isolation: "worktree"` and for a background session, and it is the
only announcement there is: no hook fires for ENTERING a worktree that already exists. The
new worktree's `.journal` becomes a symlink to the one above it, git in it is made blind to
that, and it is said once. A worktree that checked out its own copy is left exactly alone.

`test_nested.py` builds the whole shape — a non-repository root, two repositories, a
worktree under one and a worktree beside the other — and asserts from all four places that
the hook finds the journal, that the command the block prints runs from there, and that four
directories writing produce one record.

## 1.41.1 — nineteen modules imported for a command that uses two

`journal.py` imported docs, tools, context, migrate, update and verify at module scope for
every invocation, and `import dataclasses` — 5.9ms, pulling `inspect` behind it — for a
decorator whose only work was writing an `__init__` that assigns thirty defaults. `Opts` is
a plain class now; the class body still reads as the declaration it was.

The six modules load on first use, through one small proxy rather than an `import` inside
each of the forty functions that touch them — the same decision written forty times is one
more thing to forget on the forty-first. What is NOT deferred is anything the module-level
block needs while it runs: deferring one of those moves a side effect rather than removing a
cost, and a CLI that resolves its environment lazily is one whose commands can disagree
about which environment they are on.

A LAZY IMPORT IS ONLY AS LAZY AS THE EAGEREST THING ON THE PATH TO IT, and the first attempt
proved it by changing nothing: `pins` imported `docs` at module scope and `journal.py`
imports pins on every invocation, so `docs` loaded anyway. `pins` imports it in the two
places that render a doc citation now.

AND THE ESTIMATE IN THE TO-DO WAS WRONG. It said ~145ms of the CLI's start was those
imports. Measured, interleaved, twenty-four runs a side: 96.2ms to 91.8ms — 4.5ms, or 5%.
The rest of what `-X importtime` attributes to `docs` and `tools` is `shutil`, `subprocess`
and `tempfile`, which `state` and `worktree` pull in regardless and which nothing here can
avoid. `worktree` no longer imports either at module scope — correct on its own terms, since
a main checkout never reaches the code that needs them — but it buys nothing yet, because
`hook.py` still imports `tools` eagerly. That one is left alone deliberately: its handlers
register by decorator at import, and rearranging that at the end of a long session is how a
fast CLI becomes a broken one.

## 1.41.0 — a worktree is orthogonal, and `grant` lends the environment you are on

THE RULING, and it settles a question that had been open since worktrees and subagents were
built in the same week: A WORKTREE IS ORTHOGONAL TO THE JOURNAL. It is not an environment,
it does not hold one, and it never decides one. It exists so several agents can work one
project at once without touching each other's files — a fact about the filesystem, not about
the record. Whoever enters a worktree keeps the environment they were on, and an agent
dispatched from a session works that session's environment with its own ledger under it.

"An agent with its own journal" and "an agent in a worktree" were conflated and are two
different things: THE LEDGER COMES FROM THE GRANT, THE FILES COME FROM THE WORKTREE. The two
meet without knowing about each other, which is why nothing had to change when they did —
`worktree.py` names neither environments nor tracks, and never did.

    journal grant            lend the environment you are on
    journal grant "<other>"  lend a different one — a separate line of work for the agent
    journal grants           what this session has lent; `grant --list` is the same

BARE, IT LENDS WHERE YOU ARE, because that is the ordinary case and it was the one thing the
command could not do. Requiring a name made the unusual case the only case: this session lent
three brand-new environments to three agents in an afternoon because naming one was the only
way to lend anything at all. The bare form had to give up one of its two meanings, and "show
me what I lent" is the one a reader can ask for by another name.

## 1.40.2 — an unstartable list names every reason it is unstartable

The stop's "nothing on the list can be picked up" counted two of the four ways a row can be
unstartable and left out the one the reader can actually act on. Measured here: a list
holding one to-do waiting on the user and one set aside reported "1 set aside on a
condition" and never mentioned the question — while `journal next`, asked the same thing one
command later, reported the question and never mentioned the set-aside row. Two messages,
two different halves of the truth, neither of them wrong on its own, and between them no way
for the reader to learn that both were true.

All four are counted now — waiting on your answer, set aside on a condition, waiting on a
to-do that must land first, held by an agent still working — from one table, with the one
the user can act on first.

## 1.40.1 — a to-do that was ever asked a question stopped lying about itself

`ask()` records a question and nothing ever clears it — correctly, because the exchange is
the record of why a row is what it is. But the state ladder tested `t["asks"]` bare, third
from the top, so any to-do that had EVER been asked a question shadowed every state below
it: started, assigned, reported, blocked, after. A row could be picked up, worked, and
reported finished while still printing "waits on the user", for the rest of the project.

History was being read as state. The predicate is precise now: waiting on the user means a
question with NO answer that nobody has picked up. Starting such a row is an agent saying it
will proceed without an answer — legitimate, and previously invisible.

AND THE LADDER SAYS WHAT IT IS. A first draft of the replacement claimed the nine predicates
could not overlap; 237 of the 256 field combinations do. `blocked` and `started` are both
true of a row that was picked up and then set aside, and that is not a defect — what a
reader needs is why it is not moving NOW. So `_STATES` is a documented PRIORITY ORDER,
answering one question top to bottom: what is the most recent thing that decides what
happens to this row next? And `states_of` exposes every state that matched, because a ladder
returns exactly one answer and a rung in the wrong place shows up only as a wrong answer in
a case nobody thought of — which is how this bug survived as long as it did. The precedence
is asserted in `test_todo` rather than left to the reader.

Found by a dogfood agent folding this listing into the shared one, which preserved the
behaviour and reported it rather than fixing it silently. That was the right call.

## 1.40.0 — journal lent, and the name was already on disk

`journal lent` is the agent's half of `journal grant`, read as a question: what have I been
lent? It answers with the agent's own name, the environment, and the flags every command of
its needs. Until now an agent learned its name as a SIDE EFFECT — it ran whatever tool it
ran first, and the hook attached the briefing to that result. It worked, and the moment was
an accident of whatever the agent happened to do.

    journal lent      what am I, and what was I given

THE CLI CANNOT ANSWER IT, AND SAYS SO. `agent_id` reaches the hook and never the process —
the identity collision this whole mechanism exists for does not stop applying to the command
that asks about it. So the CLI half prints what a SESSION should hear, and the hook answers
an agent on the tool's result, where the id exists. One command, two readers. It answers
every time it is asked, unlike the one-shot briefing, which stays as the rescue for an agent
that never thought to ask.

THE READABLE NAME WAS ALREADY ON DISK AND NOBODY HAD LOOKED. The open question was how a
subagent comes by a name a person can read: `agent_id` is a hex string, and the obvious
alternative was to let the agent invent one — which then has to be checked for collisions
against every live agent and bound back to the real id anyway. None of that is needed.
Claude Code writes each subagent's transcript to `<project>/<session>/subagents/agent-<id>.jsonl`
with a `.meta.json` beside it holding the DESCRIPTION the dispatcher typed. It is unique per
dispatch, written by the one party with the context to name the work, and on disk before the
agent's first tool call. The briefing wears it beside the id:

    YOU ARE AGENT `afdfe440` — "Flag and command tables" WORKING UNDER `flags`

A label on a verified identity, never a substitute for one: every gate still turns on
`agent_id` from the payload.

BOTH FLAGS OR NEITHER. A lent agent's write now needs `--as=<its name>` as well as `--env`.
Without it the write lands in the environment's shared `work.json` instead of the agent's own
ledger — the collision the sub-environment exists to prevent, arriving silently. Measured in
the last release's dogfood: an agent ran `todos start 1` with no `--as`, was answered
"open: …" with no complaint, worked the row, and was refused by `report` with "held by
nobody". THE CHECK IS AT THE GRANT DOOR BECAUSE THE IDENTITY IS THERE — a first attempt put
it in the CLI, where it fired for the parent session too and was still only a guess.

AUTO PREDICTS THE STOP, SO IT ASKS THE STOP'S QUESTION. `todos auto on` named the first OPEN
to-do while the stop hook it was describing picks the first READY one, so it promised to
start rows that wait on the user, are blocked, are held by a live agent, or have unmet
prerequisites. Measured the moment auto was switched on here: it named a to-do that had been
waiting on the user for five hours. And a list that is full but entirely unstartable now says
so, rather than naming one or claiming the list is empty — from the outside those look
identical, and the difference is the half the user has to act on.

## 1.39.0 — the start block is a doorway, and three agents found four bugs in the grant

THE BLOCK STOPPED BEING DELIVERED AT ALL. Measured in a real project: 14,996 characters
against the harness's documented 10,000 ceiling, so the whole of it was replaced with a FILE
PATH — after every compaction that project's agent was handed a path instead of the record,
which is the one delivery this package exists to make. 7,014 of those characters were two
answered to-dos printing the user's answer in full, and no cap could reach them:
`CARRY_CAPS` bounds the NUMBER of entries and nothing bounded the text inside one, so the
halving loop hit its floor and gave up.

So the injected block is a DOORWAY: where the session is, what the commands are, how many of
each thing stands — and the agent reads what it needs.

    journal carry     the full handover, uncapped, on demand

    carried(BRIEF)    what the hook injects        5,067 characters on that same record
    carried(FULL)     what `journal carry` prints

ONE BUILDER WITH A DEPTH, not two functions: a separately written short version is the thing
that drifts from the long one. Reminders leave the block entirely — they fire at every stop
and every `reminder_every` calls, so injecting them paid for the same text twice. The
answers, and the questions waiting on the user, leave with them; rules, pins and docs keep
their last three; a counts block names what is left and the command that reads each. AUTO
SURVIVES AS AN ORDER, not a listing — everything else the doorway drops is readable on
demand, and a standing order is not readable at all: a session in auto that is not told so
simply stops.

LENDING MAKES THE ENVIRONMENT IT LENDS. `journal grant "<name>"` refused an unknown name and
pointed at `prepare`, which CREATES AND SWITCHES — so lending three environments to
subagents cost six moves of a session whose whole definition is "this session does not
move". `tracks.create` is now the one place an environment starts, and `switch` and `grant`
both call it.

PINS AND REMINDERS ARE INHERITED, NEVER WRITTEN, BY A LENT AGENT — the user's ruling, and it
was neither enforced nor true: both were allowed, and `journal grant` printed `pins add` as
its example, so the briefing a dispatcher pastes into a prompt taught a command the design
forbids. The reason is provenance, not blast radius: a pin belongs to one environment
exactly as work does, but it is re-read in full at every compaction by every session that
binds there and nothing revisits it, so a claim whose reasoning nobody in the main
conversation saw would stand in the record's highest-authority position forever.

FOUR BUGS, FOUND BY DOGFOODING. Three sonnet agents were dispatched into three git
worktrees, each lent its own environment, each given a real refactor. They found:

  THE HOOK TOLD ALL THREE THE WRONG ENVIRONMENT. `agents.briefing` took `lent[0]` — the
  first environment the session happened to have lent — and stated it as fact, on the first
  tool call, in the one sentence whose entire purpose is "here is the flag you must put on
  every command". It is the same failure the refusal had and had already been fixed for: a
  message that names an environment nobody told this agent to use will be obeyed. With one
  grant standing it is named; with several it names none and says the dispatch decides.

  `work end` CLOSED A ROW A SUBAGENT MAY ONLY REPORT. `report` refuses to close and says the
  parent does it; then `work end`, on the subject `todos start` itself opened, closed the
  same row through `close_titled` — unconditionally, with no idea who was calling. One agent
  guessed the hint did not apply to it and worked around it; the other followed the
  documented order exactly and marked its own homework. The guarantee held everywhere it was
  written down and nowhere it was wired.

  `todos start` WITHOUT `--as=` HELD NOTHING, SILENTLY. "open: …", no complaint, and then
  `report` refused with "held by nobody" — the command that could have said it said nothing.

  `journal reminders` — A LISTING — HAS COUNTED AS A WRITE for as long as the noun has
  existed: gated behind open work, and refused outright to a lent agent told to read what it
  inherits. It was missing from a chain of five `if verb == …: continue` branches. That is a
  table now, so a noun with no entry is visible rather than silently a write.

WHAT THE AGENTS BUILT

`journal.py:main` is 85 lines, from 515: a flag table and a command table replace ~30
`elif a == "--x"` branches and ~40 verb branches. Aliases are one row with several names —
`environments`, `environment`, `envs`, `env`, `tracks`, `track` is one entry, not six.

`entries.listing` is the loop every listing shares once it has its own items, and
`todo.render`, `docs.catalogue` and `tools.catalogue` fold into it, each supplying only its
own `facts`. The to-do's meta became `_state` plus a table.

`fmt.notice` is the one shape for the `journal: …` line that six places each spelled
differently, and `install.py`'s nine raw prints go through `fmt.say` — the installer had
never touched the formatter at all.

## 1.38.1 — the duplicate 1.38.0 said it had removed

`reminders.render` was still the hand-written 33-line listing that 1.38.0's entry claimed
had been replaced by the shared loop. The new `listing` was added beside it and the old
body was never deleted, so the module carried both and the tests passed because `render`
still worked — nothing asserted it went through `entries.rows`. It does now, and a test
asserts the module holds no second copy.

AND THE WORD "SHARED" IS WRONG FOR CODE IN THIS PACKAGE. Three docstrings said the listing
was "shared with pins and rules", where "shared" has a settled meaning: a rule is visible on
every environment, a pin and a reminder are not. Nothing about scope changed — `state.TRACKED`
still puts pins, work and reminders in the environment's folder and `rules` still lives in
the record, untouched by a switch — but a docstring that borrows the vocabulary of the data
model to describe a refactor is a docstring that will be believed. They say "one loop, three
nouns" now, and say outright that it decides nothing about visibility.

## 1.38.0 — output is described, never formatted at the call site

`fmt.say` was one exit and no shape. Every one of its 546 callers assembled its own string
first — a title, a `\n\n`, a command block, another `\n\n`, a footer — so the blank lines,
the order, the indent and the trimming were re-decided at every site. That is why the same
complaint about a wall of text came back in a different screen three times: there was no
place to fix it once.

A command now describes WHAT it is saying and never how.

    Item(text="…")                    a paragraph
    Item(n=2, text="…", meta="…")     a pin, a to-do, a reminder
    Item(title="journal x", text="…") a command, a setting — anything in a column
    Out(title=, sub=, lead=, items=, footer=, error=)

Which shape a row takes comes from `Item.layout`, decided by what the caller filled in —
there is no way to ask for a shape by name and no way to ask for one the fields do not
support, which is what keeps the vocabulary at three. `fmt._LAYOUTS` maps each to the
function that lays it out: adding a shape is adding an entry, the signatures are uniform,
and no caller can reach a half-applied branch. An `Out` among the items is a SECTION,
rendered by the same function one level in, so a page with several groups is built without
any caller joining two rendered strings together.

`fmt.render` is the only code that decides where the air goes, and it decides it from the
rows: two columns sit together, anything else is separated. A group whose widest name would
leave less than 34 columns to read in stacks instead of columning — measured on
`journal reminders`, where one 58-character command turned every description into a
four-line sliver.

THE THIRD SHARED OPERATION ON A NUMBERED STORE. `entries` already held one `retire` and one
`move` for pins, rules and reminders; the LISTING was still written out per noun — same
enumerate, same paging, same struck-keeps-its-number rule, differing only in which fields
went into the line beneath. `entries.rows` is that loop, and a store supplies its own
`facts` strategy. `pins.listing` and `reminders.listing` return rows rather than text,
because a page handed rendered text can only paste it in as a paragraph — which reflowed a
numbered list into prose the first time it was tried.

A refusal is marked once, on its first line, BEFORE the wrap. Marking after it shifts the
line by four characters without re-wrapping, so the break points move and a command splits
across two lines.

Rule 3 is written into the journal: clean, DRY and idiomatic before it is committed, never
after it is complained about.

## 1.37.3 — the reminder is the message

The block read `REMINDERS — 3 things you asked to be told again:` above the instructions.
That is the package narrating its own delivery — who asked for them, how many there are,
and that this is a repeat — none of which is the instruction, all of it charged to the
reader at every stop for the whole session. The heading is one word now: `REMINDERS:`. A
label survives because a block of numbered lines dropped into a stop with nothing above it
is a list of unattributed orders; the sentence does not.

## 1.37.2 — the README documents the CLI that exists

It described `journal handoff` and `journal delegate` as live features, with a paragraph
each on how to use them, two releases after they were deleted — and said nothing at all
about grants, sub-environments, assignment, reminders, or the rules the journal itself
ships. `.journal/record.json` was still documented as holding pins and work, which stopped
being true in 1.34.0 when an environment became a folder.

Rewritten: what a grant is and why a subagent cannot simply be detected, what a
sub-environment holds and what it may not touch, the reminder, the real storage layout
including `environments/<name>/agents/<id>/work.json`, and the paragraph on worktrees now
carries the half that was only assumed until it was measured — a subagent's FIRST TOOL
CALL is what links a worktree's journal, because no session start fires for one.

DOCUMENTATION DRIFTS SILENTLY: nothing fails when it goes stale, which is why it went stale
for two releases. So a test now asserts that every `journal <verb>` the README prints is a
verb the CLI answers to, and that no retired name is presented as a live one. It cannot
check that prose is true; it can check that the commands are real.

## 1.37.1 — a removed command says what replaced it, and prose keeps its paragraphs

`journal delegate` and `journal handoff` were removed in 1.37.0 and fell through to "No
such command", which reads as a TYPO. The reader is most often an agent working from an
older prompt, a shipped skill, or a colleague's runbook written against a version still
installed somewhere — and an agent told only that a command does not exist retries the
spelling, which is the one thing that cannot work, and then routes around the journal
altogether. Both names still answer, with the shape of what replaced them: the commands
themselves, in order, and what to put in the dispatch. `help.RETIRED` is the one place a
removed name lives, and a test asserts no name in it is one the package still answers to.

PROSE KEEPS THE BREAKS ITS AUTHOR WROTE. `fmt.wrap` is the funnel every command's prose
goes through. It split on the blank line, wrapped each paragraph, and rejoined them with
ONE newline — so every multi-paragraph message in the package arrived as a single block
with its breaks silently removed. Its docstring had claimed the opposite since it was
written, which is why nobody looked: the separator was read once, believed, and never
measured against what came out. It is also why the same complaint kept coming back about
different screens.

AND SEVEN REMINDERS ARE SEVEN READABLE THINGS. The stop's reminder block built its own
lines and wrapped none of them, so seven reminders arrived as seven unbroken
180-character strings stacked with no gap. The user's word for it, twice: a wall of text.
It goes through `fmt.numbered` now — the same renderer the list itself uses — with a blank
line between items. An instruction nobody can find the start of is not being delivered,
however reliably it is printed.

A refusal is also marked once rather than once per paragraph: `fmt.say(error=True)` puts
`!` on the first line of every call, so a refusal built from five calls announced itself
five times, and a marker repeated down a page means nothing.

## 1.37.0 — a subagent writes only what its dispatcher lent it

A subagent cannot be DETECTED. Its shell carries the dispatching session's id, so a
`journal pins add` inside one is, at the operating system, the same act as the parent
running it; `agent_id` exists only in the JSON a hook receives, never in the process the
subagent runs. `journal delegate` worked around that by binding the SESSION, so subagent
writes landed somewhere by accident of sharing an id — and cost nine `is this a subagent`
branches across six functions before it was deleted.

What cannot be detected can be lent.

    journal grant "<environment>"        lend it to this session's subagents
    journal grant                        what this session has lent
    journal grant --off "<environment>"  take it back

The grant is declared TWICE: by the session, in the record; by the subagent, with
`--env="<name>"` on every command. The hook holds the two against each other at ONE door,
and no other line asks what kind of actor is calling. `journal grant` prints the sentence
to paste into the dispatch, because that sentence carries the flag the mechanism turns on.

WHAT A LENT AGENT MAY TOUCH, measured by hashing the tree before and after its whole write
repertoire: `environments/<lent>/work.json`, `pins.json`, `reminders.json` and `todo/`.
Nothing shared. That property is why `rules`, `docs` and `tools` are refused rather than
discouraged — each writes where every session reads. `switch`, `claim`, `prepare`, `grant`
and their `environments` spellings are refused too, for the other reason: they move a
SESSION, and the session they would move is the dispatcher's.

FIVE OF THOSE REFUSALS REFUSED NOTHING when this was first written. `claim`, `grant`,
`environments`, `handoff` and `delegate` were named as forbidden while `_journal_write`
classified them as not-a-write, so a granted subagent could have evicted a live session.
`JOURNAL_WRITES` is the complete definition of a write now, including the noun spellings,
and a test asserts the two lists cannot drift apart. `_journal_write` also missed any verb
with a flag in front of it — `journal --env=x pins add` passed every gate in the package.

A grant dies with its session, which was a sentence before it was a fact.

A LENT AGENT GETS A SUB-ENVIRONMENT, NOT A SHARE OF ONE. Two subagents on the same
environment used to write one `work.json` between them, so either could close the other's
declaration by saying its words. Work is now per-agent —
`environments/<lent>/agents/<id>/work.json` — and only work is: pins and reminders stay the
parent's, read-only, which is what keeps the inheritance one-directional instead of a
cascade with two places to look. A subagent still cannot write a pin.

    journal assign <n> --to="<agent>"     hand a to-do to one agent; --off gives it back
    journal todos start <n> --as=<agent>  claim an unheld row and start it
    journal todos report <n> "<how>"      say it is finished; the parent closes it

A held row leaves the ready list, so nobody else is offered it, and the hold lapses on a
heartbeat rather than a promise, because nothing can tell us a subagent died. It may report
and it may never close: a runner that ticks its own box is a failure this project has
already watched happen.

The agent is TOLD ITS OWN NAME, once, on its first tool call — the CLI cannot see
`agent_id` and the hook can, so the hook answers on the tool's result. `PreToolUse` cannot
carry `additionalContext` in this harness, measured, whatever the reference claims.

STARTING A ROW CLAIMS IT. Found by dogfooding: a subagent started a to-do, worked it, and
was refused by `report` for holding nothing, because `started` and `assigned` were two
facts and only a dispatcher set the second. The row it was working stayed offerable to
anyone the whole time. `start` claims through `assign` now — one funnel for the hold, so
the refusal is the same sentence whichever door it came in by.

A SUBAGENT IN A WORKTREE OF ITS OWN WRITES THE ONE RECORD, and nothing had to change for
that to be true. Nothing fires a `SessionStart` for a subagent, so the linking of a
worktree's checked-out `.journal` cannot depend on one — `resolve` runs at the import of
`hook.py`, so its FIRST TOOL CALL is both the event that names it and the event that
replaces the copy with a symlink. Its ledger, its claim and its report land in the main
checkout; the grant still refuses a rule from inside the worktree; git there sees nothing
of `.journal`. The worktree decides where its files are and the grant decides what it may
write — two mechanisms that do not know about each other, which is why they met without
incident.

ALSO IN THIS RELEASE

`builtin.py` ships the journal's own rules — one today, that a subagent runs on the
cheapest model that meets the task. They cannot be struck, they are numbered apart so no
citation moves, and `install.py` writes them into `AGENTS.md` and `CLAUDE.md` as a managed
block between HTML markers, replaced on every update, everything outside them untouched.
`builtin_rules: false` turns them off.

`journal switch` has printed "0 pin(s), 0 open" since 1.34.0 — it counted from a registry
that stopped holding those numbers. It reads the environment's own files now, and says
which reminders it just silenced on the environment being left.

`carried()` measures itself against the harness's documented 10,000-character ceiling and
tightens its per-store caps until it fits: a record of 125 rules, 194 pins and 163 to-dos
went from 120,360 characters — which the harness replaced with a file path nobody read —
to 5,252, every cut naming what it left and the command that reads it. `journal verify`
reads the transcript back and says whether the last start block ARRIVED.

`journal todos block <n> "<condition>"` sets a row aside on something that is not a
question for the user, and `journal todos after <n> 12,14` on to-dos that must land first;
both are skipped by `next` and by auto, and the second goes ready on its own. `--doc=1.2#a-heading`
cites one section of a doc. A `recall` subject says how many rules and pins stand, a few
times a session, never their text.

And the stop's output is a heading and an indented instruction rather than a run-on line,
said once, in one field — guidance travels in `additionalContext`, which the reference says
holds exactly as `decision: "block"` does without the harness calling it an error.

## 1.36.1 — a reminder comes back every 50 tool calls, not every 15

`reminder_every`'s default. A reminder is the one channel in this package with no
condition on it, which makes it the one channel that can teach the reader to skim — and
everything here that fired on a condition rather than a record ended up doing exactly
that. A repeated line is not read harder for repeating sooner; past some interval it stops
being an instruction and becomes furniture, and the agent it was written for is the reader
least able to notice when that happened. 50 is far enough apart to still land as an
interruption, and still several times in the kind of stretch a reminder is written for.

Set `reminder_every` to go back to 15, or to 0 to leave reminders to the stop entirely.

AND THE REPEATED FORM CARRIES NO FURNITURE. Each firing used to wrap the instruction in a
header, a gloss on what `--until` means and the command that retires one — three lines of
scaffolding around one line of instruction, arriving all session long. That is how a
reader is taught to skim, and what they learn to skim is the reminder. Mid-turn is now the
instruction and its condition, full stop; the command that ends a reminder is still taught
at the head of every stop chain, which is also the copy the user sees.

## 1.36.0 — an instruction you keep having to give is said back to you

A pin is told once. Every channel in this package hands the record over at a start and on
the far side of a compaction, and then it sits in a window that grows by tens of thousands
of characters an hour — an instruction fifty tool calls back is read with less weight than
the result that just landed. That is drift, and pinning harder does not fix it.

    journal reminders add "<the instruction>"                 said again at EVERY stop
    journal reminders add "<…>" --until="<the condition>"     …until the agent judges that true
    journal reminders                                         what is being repeated here
    journal reminders done <n> "<what made it true>"          retire one; the reason is required
    journal reminders move <n> "<env>"                        it belongs to an environment, like a pin

A reminder is the ONE thing here that repeats. The stop queue raises one subject per stop
on purpose — a wall of reminders is read past as one — so a reminder does not join it: it
is folded into whatever the stop was already going to say, and it survives
`hold_stop_on_untagged: false`, which turns the queue off and was never a statement about
what the user asked to be told again. Between two stops there can be an hour of tool
calls, which is the stretch the reminder was written about, so it comes back every
`reminder_every` calls (15; 0 leaves it to the stop) — agent-only at that cadence.

AND THE USER SEES IT AT THE STOP. Every other hook line is the agent's business rendered in
somebody else's terminal, which is why a hold was cut to one line. This is the exception:
they wrote it, and the line coming back is the confirmation it landed. The instruction goes
to the agent in the field the harness folds away, so the terminal gets one added line.

`--until` IS PROSE AND THE AGENT IS WHAT EVALUATES IT. Nothing in here can check "the
migration tests pass on CI", and a condition language would only ever cover the conditions
somebody thought to implement. The condition is handed back at every firing and the agent
retires the reminder itself, the way it strikes a stale rule. Nothing expires on its own:
the reason is required, the text stays under `--all`, and a reminder the user wrote and
nobody retired is one they are still owed.

Reminders belong to an environment, like pins — `reminder_max_chars` caps one (200, tighter
than a pin's, because it is re-read dozens of times in a session), and `silenced:
["reminders"]` turns both halves off.

## 1.35.0 — a claim keeps its reasoning, and `show` reads its noun

A rule is one line because it is re-read in full at every session start, every compaction,
every context rung and by every subagent — 125 rules is 30KB of that in a real consumer.
But the reasoning had to go somewhere, and for want of anywhere it went into docs: 78 of
them, 60 cited by nothing, and a rule citing a doc that exists while the doc is referenced
by the rule, so neither could ever be retired.

    journal rules add "<the ruling>" --brief        the reasoning on stdin
    journal rules show <n>                          the claim and its reasoning
    journal rules <n> --full                        the conversation it was written in
    journal rules amend <n> "<section>" --brief     append a section
    journal rules replace <n> --brief               swap it; the old text goes to struck/

Pins take all five too: `pins.py` is one code path over `key=`, pins are the bigger half in
that consumer (159 entries to 125), and `promote` copies a pin into a rule — so rules-only
would have meant every promoted rule arriving with an empty body. It carries the body across
now, or the argument would be dropped silently while the strike reason claims it went to
rule N.

TWO FIELDS, NOT THREE. The claim stays the one injected line and there is no title: 60 of
those 125 rules have no head clause that could become one, so an agent would invent it, and
an invented title above the claim is a second unversioned claim in the highest-authority
position this system has. `fact` cannot drift from itself. The writers had already invented
titles with punctuation — "RULING: …", "A design file is a SPECIFICATION: …".

THE BODY IS A FILE, uncapped, never injected: `.journal/rules/NNN-<slug>.md`, and
`environments/<name>/pins/` for a pin. The cap exists because injected text is re-read
forever; text that is never injected carries none of that cost, and capping it would only
push the overflow back into a doc.

AND IT DOES NOT SHRINK THE CONTEXT BLOCK. Say so plainly: even a brutal 120-character cap
takes only 40% off, because that block is 30KB from the COUNT of rules, not their length —
the longest standing rule is 345 against a cap of 400. This ships because the argument now
has somewhere it can be judged, and because the doc explosion stops.

`journal rules show <n>` READS THE RULE now, where it used to print a stretch of transcript.
`docs show 4` prints the doc and `todos show 3` prints the to-do; this was the one place
`show` did not read its noun. `rules <n> --full` still opens the conversation, and every
existing spelling still runs.

It is marked wherever a claim is printed — the carried block (one suffix, `·rules show 3`),
the listing, the environment page, and `hook._subagent_rules`, which has its own renderer and
would otherwise hand a subagent a rule with no way to know there is more. `cleanup` scans
bodies for the same rot it scans claims for, and its reading pass NAMES the body rather than
printing it: 125 claims is the point, 125 claims and 125 arguments is a wall nobody reads.

Two pre-existing bugs found on the way and fixed with it. The pre-flight cap gate matched
only `pin`, `remember` and `rule`, so `journal pins add` and `journal rules add` — the
canonical spellings — never reached it; and `JOURNAL_WRITES` was missing the plurals, so a
write spelled the way the skill teaches it was not recognised as a write at all. Both now
match, with a guard so the bare nouns stay reads, which a subagent must keep.

And `docs._load` caches the catalogue per process. `pins.carry` called `ref_label` once per
doc-citing entry and each one re-read all 78 docs off disk: 218ms to build one context block,
now 13ms.

## 1.34.1 — the CLI starts in two thirds of the time

Every `journal` command and every hook event pays the interpreter's start plus this
package's imports, and the suites make a couple of thousand of them — so this is the
slowest part of an iteration, and none of it was doing any work.

`dataclasses` was the cost. It pulls `inspect`, ~6ms, and three modules on the hot path
declared a dataclass for two attributes and an equality nobody uses: `tags.Tag`,
`transcript.Line` and `hook.Ctx`. All three are plain classes with `__slots__` now — which
is also smaller and faster to build, and a transcript makes thousands of `Line`s. `digest`
is imported where it is used rather than at the top of `journal.py`, since only the
transcript commands need it.

And `state._read` caches by path within a process, validated by a stat on every hit. The
record is read many times in one command — by the gate, by the renderer, by the command
itself — and in a large consumer that was a 700KB parse each time. Another process's write
changes the file's mtime or size, so the next read here misses and sees it.

    one journal command   106ms -> 68ms
    the whole suite        80s  -> 62s   (1265 assertions, 18 files)

What is left is a floor: the suite's wall clock is now its slowest single file, and that
file drives the real hook binary as a subprocess, which is what makes it worth having.

## 1.34.0 — an environment is a folder, and upgrades migrate themselves

WHAT BELONGS TO AN ENVIRONMENT NOW LIVES IN THE ENVIRONMENT'S FOLDER:

    .journal/environments/<name>/pins.json
    .journal/environments/<name>/work.json
    .journal/environments/<name>/todo/NNN-*.md

Pins and work sat inside `record.json` under `tracks.<name>`, and to-dos sat in a parallel
`todo/<name>/` tree — so "what is on this environment" was answered in two places that could
disagree, one of them a 700KB JSON blob. The record keeps the REGISTRY: which environments
exist, who holds them, where sessions are. It no longer keeps their contents. Removing an
environment is a folder move now rather than record surgery, and reading one small file
beats parsing the whole record for a list only one environment needs.

Rules and docs do not move. A rule binds every environment and every environment reads
every doc; both stay where they were.

AND MIGRATIONS RUN THEMSELVES. `migrate.py` holds an ordered list of (version, what it does,
how), and everything newer than the record's own `schema` runs, in order — because a
consumer upgrades from whatever version it happens to be on, which is never the version
before this one. A project pulled six weeks ago crosses four releases in one `journal
upgrade`.

It is not a flag and not a step in a changelog somebody reads later. `journal upgrade` runs
it, and so does the first CLI command or hook event that reads an older record — the package
is copied into consumers by file, not installed by a package manager, so "the upgrade
command ran it" is not a guarantee anybody has. The guarantee is that the first process to
notice does it. `journal migrate` says what is pending and what has run.

EVERY MIGRATION IS IDEMPOTENT AND SURVIVES A HALF-RUN. It moves what it finds and leaves
what it does not, so running it twice is a no-op, and a project that is half-migrated has
what the record still holds APPENDED to what the folder already has, rather than either side
being dropped.

## 1.33.0 — a to-do, a pin or a doc can move to another environment

Work gets reframed. What was filed under one name turns out to be a different thing, and
until now nothing moved: the only way to carry a to-do or a pin across was to edit
`record.json` by hand, which is the one operation this package exists to prevent.

    journal todos move <n> "<environment>"
    journal pins move <n> "<environment>"
    journal docs move <doc> "<environment>"

EACH ONE MOVES WHAT IT HONESTLY CAN. A to-do's file moves and its number changes, because
the number is the filename and numbering is per environment — so the reply names both
sides, and `moved_from` keeps the old address for anything that cited it. A pin is STRUCK
where it was and added where it went, which is `promote`'s decision for `promote`'s reason:
a pin's number is its position in the list, and lifting one out would renumber every pin
after it and make "pin 7" in an old transcript name a different fact. The strike says where
it went, so `pins --all` shows the trail from both ends.

A DOC BARELY MOVES AT ALL, and that is the point. A doc is the project's — every
environment reads it, and `environments remove` already refuses to take docs with an
environment. Its `track:` is provenance, not ownership: only that field changes, the folder
and the number stay, and every citation keeps resolving.

A RULE REFUSES TO MOVE. It binds every environment, so there is nowhere to move it to — and
the refusal says what that means: a claim that only describes one line of work was never a
rule. Strike it and pin it there.

Also: `docs.carry` handed the OLDEST twenty docs at every session start. `_load` returns
them ascending by number and `carry` sliced the front; 1.30.0 flipped every paged list to
newest-first and did not reach this one. In a project with 78 docs that hid every doc the
current work was about behind "and 58 more" — at exactly the moment the catalogue exists to
stop somebody re-investigating what a doc settles.

## 1.32.4 — an out-of-date git hook is refreshed, and the CLI starts faster

TWO THINGS. The hook's body is not part of the package a pull refreshes: it is written once
into `.git/hooks` and stays there, so 1.32.3's `--quiet` reached nobody who had already
installed it — the fix shipped and the noise continued. `--git-hook` now rewrites a
`post-commit` that is ours and out of date, and still never touches one that is not.

And `urllib.request` is imported where it is used instead of at the top of `update.py`. It
costs 13ms and drags in `http.client` and the email package, on a CLI whose entire run is
79ms and which almost never reaches the network: every invocation paid for the version
check, and the suites alone make a couple of thousand of them. 79ms to 67ms per call.

## 1.32.3 — the git hook is silent unless it closed something

Installed and used for one commit, the post-commit hook printed "f5dd46419 names no to-do —
a commit closes one with a trailer" on a commit that was never about a to-do. On every
commit. A line printed after every commit is a line that stops being read, including the
one that says a to-do WAS closed, which is the only line here worth anything.

`journal todos from-commit --quiet` says nothing when the message names nothing; the hook
passes it. Run by hand it still answers, because somebody typing it is asking.

## 1.32.2 — the trailer is read at column 0, so a quoted example does nothing

The match allowed leading whitespace. A commit message that DOCUMENTS this protocol shows
an example, and an example is indented — so the changelog entry for 1.32.0, which quotes a
trailer with a to-do number in it, was one line away from closing whatever to-do had that
number. The line must now begin at column 0.

Nothing else narrows. The trailer may sit anywhere in the message, above or below any other
trailer; the footer is simply where a reader looks for it. What changed is that a line with
a space in front of it is a quotation rather than an instruction, which is what lets this
package's own commits explain the feature without triggering it.

## 1.32.1 — the commit trailer works for commits you type yourself

1.32.0 read the trailer at PostToolUse, which covers every commit an agent makes and none
of the ones a person makes in a terminal. `.journal/install.py --git-hook` installs a
`post-commit` hook that runs `journal todos from-commit HEAD`, and `--no-git-hook` takes it
back out.

OPT-IN, AND IT NEVER CLOBBERS. `.git/hooks` is not the journal's to own — husky, lefthook
and pre-commit all live there, and a hook is not committed, so overwriting one costs
somebody a workflow with no diff to find it in. An existing `post-commit` that is not ours
is left exactly as it is and the one line to add is printed instead; `--no-git-hook`
likewise refuses to delete a hook it did not write. The hook itself cannot fail a commit:
git ignores its exit code, and it exits 0 before doing anything if the checkout has no
journal.

The hooks directory is asked of git rather than assumed, so it is right inside a worktree,
where `.git` is a file and not a directory.

## 1.32.0 — a commit closes the to-do it finishes

A to-do is finished by a commit, and closing it was a second command nobody owed anybody —
so the list filled with work that was done. The commit can say so itself now, in a trailer
on its own line, spelled as the command it performs:

    Journal: todos done 990
    Journal: todos done cli-streamline/4 the four corners are the vocabulary

The message is read off the COMMIT, not off the command that made it. That is the whole
design: a commit a gate rejected closes nothing, `-m` and `-F -` and an editor session all
behave identically because none of them are parsed, and the sha and subject are right there
to become the `how` — the record cites the change instead of summarising it.

A TRAILER, NEVER PROSE. Commit messages here argue about to-dos at length; "this closes the
placement question" is a sentence, and a matcher loose enough to read it is loose enough to
close the wrong thing. The line starts with `Journal:` or nothing happens.

THE NUMBER IS PER ENVIRONMENT. `990` resolves against the environment the session is on,
then against the only environment that has one — and refuses, naming them, when more than
one does. `<environment>/990` says it outright.

`journal todos reopen <n> "<why>"` came first and is the reason the rest is affordable.
`done` was a field with no verb that cleared it, so a wrong number could only be undone by
hand-editing markdown, which is not a price to pay for a close nobody typed. The reason is
required and the close it undoes is kept beside it.

It is taught in three places, because a command an agent meets and does not know exists is
a command that is not there: the skill, the `todos start N` output — which prints the exact
trailer for that number — and once a session at the commit itself, when a commit lands with
a to-do started and closes nothing.

`journal todos from-commit [<ref>]` does the same for a commit made outside a session; it
is what the git `post-commit` hook will call. An amend or a rebase re-running it is a no-op
with a note: a sha is acted on once, and an already-closed to-do is left as it is.

## 1.31.1 — `--brief` refuses instead of hanging

`journal todos add "<title>" --brief` with no heredoc behind it hung until the tool timed
out. `--brief` reads stdin to EOF, and the stdin an agent's shell hands a command is often
one nobody ever closes — so the read never returned and the CLI looked like it was
thinking. Reported from a live session: the agent's next several attempts were the same
command again.

The read is BOUNDED now, for the same reason the record lock is: ten seconds, then it
refuses with the spelling that works — pipe the brief in, or drop the flag and pass the
title alone. A read that ends at EOF with nothing in it refuses too, because a to-do or a
doc part filed with a blank brief is the same mistake, filed instead of caught. If some of
the brief arrived and the pipe simply never closed, what arrived is kept and a line on
stderr says so.

It covers every `--brief`: `todos add`, `todos amend`, `todos replace`, `docs add`, `docs
part`, `docs replace` and `tools add`.

## 1.31.0 — a long stretch no longer ends in silence

Seen on a live run: an agent finished four of fifty-six phases, wrote a full report and
stopped — with auto on, fifty-two to-dos waiting, work open and a loop running. Nothing
nudged it and the user had to continue it by hand. Its own footer said how long the stretch
was: eight minutes fifty-five.

`raised_this_turn` was the cause. It is read while `stop_hook_active` is true and cleared
only when it is false, and the subject loop skips anything already in it — so the budget
was ONE hold per stop-chain rather than one per unit of progress. An agent held once, that
answers the hold and then works for nine minutes, meets a stop where every subject it needs
is already marked raised. The longer the stretch, the more certain the silence, which is
exactly backwards.

The memory now expires on PROGRESS. Each subject records the transcript line it was raised
at, and stays quiet only while the transcript has advanced fewer than
`hold_again_after_lines` (25) since. A subject held a moment ago is still quiet; one held
twenty-five lines of work ago is not being nagged about — it is being told at the next stop
after real work. `hold_again_after_lines: 0` restores the old budget exactly.

Raising at every stop instead was tried in 1.29.0 for the loop subject and starved the
queue: a subject that never yields is a queue that never drains. The threshold is precisely
what separates the two, and the suite now holds both ends — a stop straight after the hold
stays silent, a stop after thirty lines speaks.

An older record holding a bare list under that key is read as "raised just now", which is
what it meant, and written back in the new shape at the next hold.

## 1.30.0 — every list that pages reads newest first

Pins, rules, to-dos, docs and tools are append-only, so their natural order is oldest
first — and with a cap that meant page 1 was the oldest fifteen entries and everything
recent was behind a `--page=2` nobody typed. The list a reader opens is a list they are
reading for what happened lately.

All five now read NEWEST FIRST, and `--order=asc` gives back exactly the old reading.
`--order` takes only `asc` or `desc` and says so when given anything else.

THE NUMBER TRAVELS WITH THE ROW. `pin 3` is pin 3 in either order: nothing is renumbered,
the store is untouched, and only the reading is reversed — the same rule that already keeps
a struck entry's number rather than closing the gap. The `… and N more` line carries the
order into the next page, so `--order=asc --page=2` continues where page 1 left off instead
of silently flipping.

Four modules had each sliced their own page by hand, which is four places for "newest
first" to drift apart. They share `fmt.paged` now, and `test_order.py` holds all four to
the same three promises.

## 1.29.1 — the fix a finding offers has to answer the finding

`cleanup` reported a doc whose environment had been removed and offered `journal docs
final <n>` to resolve it. Marking a draft finished has nothing to do with a dangling
environment: the stale thing is the field, not the status. A checker that suggests the one
action which cannot help is worse than one that says nothing, because the reader trusts the
suggestion and stops thinking. That case now says what is true — the doc still stands, edit
its `track:`, or strike the parts that no longer hold.

Found by running the command on this project's own record, which is also where the reading
pass proved its point: pin 12 ruled on a documentation bug that has since been fixed. It
named a real file and a real command, so every mechanical check passed it and always would
have. Only reading it against the code retired it.

## 1.29.0 — auto without a loop is refused, not merely mentioned

Auto is the promise that the list drains while the user is away. A session with no loop
stops at its first idle stop and the list sits exactly where it was, which is the one thing
auto exists to prevent — and the user measured the failure: agents turn auto on and forget
the loop, over and over.

It was a HOLD at the stop, and a hold leaks two ways. A subject fires at most once per
stop-chain, so an agent that worked through it was not asked again for an hour; and a hold
is advice arriving at the moment the agent is trying to finish, which is when advice is
easiest to step over. Three changes, in the order they bite:

`journal todos auto on` now prints the loop command in its own confirmation — the standing
rule is that a command is taught where it is NEEDED, and the moment auto goes on is that
moment, not the stop afterwards.

THE NEXT WRITE IS REFUSED while auto is on, a to-do is ready, and no loop is known. A
denial cannot be stepped over. Reads are never gated and neither is the journal's own CLI,
because `journal loop set` and `journal todos auto off` are the ways out and must always
run. A subagent and a delegated session are exempt, as they already were at the stop.

A third change was tried and rejected, and the rejection is worth keeping: making the loop
hold fire at EVERY stop rather than once per chain. The reasoning was that the loop is not
a reminder but the condition under which every later hold can reach anybody. The suite
answered in one run — it raised itself three stops running while the untagged message and
the open work behind it were never reached, and the chain could not end at all. A subject
that never yields is a queue that never drains. The hold stays once per chain like every
other subject; the forcing lives in the gate, where it can neither be stepped over nor
deadlock.

The transcript is read only on the last step before a refusal: a loop the journal can SEE
but has not recorded still counts, and that read is too expensive to do on every write.

## 1.28.1 — the hook stopped deleting the proof that it ran

`journal verify` and the status page have been reading the journal as DEAD in sessions it
was demonstrably running in, and the cause was the hook itself.

`_prune` drops the runtime file of any transcript this machine no longer has. Its `keep`
argument exists for the session that is starting — but only `tracks.prune` honoured it; the
file loop did not. A transcript is not always on disk when SessionStart fires, since the
harness writes it once there is something to write, so `transcript.find` reported the
starting session as gone and the prune deleted the runtime file that the same handler had
written one line earlier. `session_started` — the one mark that proves the hook fired —
went with it, while keys written after the prune survived, which is why the file looked
present and merely incomplete.

Every test that fires SessionStart created the transcript first, which is exactly why this
survived: the failing case is the one nobody wrote down. Two tests now cover it — the mark
survives a transcript that is not yet on disk, and a runtime file whose transcript really
is gone is still dropped.

 work whose declarer is gone can still be closed

`work end` closes by saying the same words, which assumes the closer is the declarer. That
assumption breaks for the one case nobody planned: work declared by a session that no
longer exists — a runner in a worktree that has been deleted, a crashed agent, a hand-off
nobody picked up. Its subject is unguessable, so it can never be closed, and it stands
forever holding every stop hostage with a hold nobody can answer.

    journal work end --force ["<note>"]

Every open piece closes, whatever the words are, and the words are kept beside each as
`ended_note` — so the record still says who closed it and why. The note is optional,
because requiring words for work nobody can name is the same trap one level down.

## 1.27.0 — a cleanup is two passes, and the mechanical one is the smaller

`journal cleanup` finds what a check can see: a claim naming a file that is gone, a
spelling the CLI does not answer to, an orphaned doc, an empty environment. All of it is a
fact about the world a claim POINTS AT, and none of it is a fact about what the claim
means — which is where the rot that matters actually lives. The rule that sent this whole
thread into being said subagents never write the journal. It named no file, misspelled no
command, and passed every check in the tool forever; what made it false was `journal
delegate` shipping, a fact living in another module's docstring. Only a reader connects
those.

    journal cleanup read      every rule and every pin, in full, with the questions to ask

It prints the claims WHOLE — nothing truncated, because a claim cut at seventy characters
is a claim judged on its opening, and the part that has stopped being true tends to live
further in. Beside each is its strike. Above them are the three questions, cheapest first:
is this still what the project does; does what it asserts still hold (grep before you
decide); would a reader handed this cold be misled by it.

THE RECORD KEEPS WHEN, NEVER WHAT. The pass is stamped per environment — that the claims
were put in front of a reader is all a CLI can witness, and it is enough to tell the next
session "never done on this environment" instead of nothing at all. Nothing expires and
nothing is struck automatically; `READ_DAYS` is only how long before the hook may mention
it.

The stop subject now speaks for both halves, and speaks when there is nothing mechanical
to say: an empty findings list is not a clean record, it is a record nobody has read.

## 1.26.0 — an environment can be removed, and the record can be cleaned

Two things the tool made the user do by hand.

AN ENVIRONMENT CAN BE REMOVED. `tracks.py` opened with "there is no delete", and it meant
it: the tool this package replaced dropped things quietly to stay tidy, and the answer was
to drop nothing ever. That was the wrong half to keep. What matters is that somebody
DECIDES, not that nothing can go — and a list that only grows is a list nobody reads, so
every finished piece of work and every experiment stayed on it forever.

    journal environments remove "<name>"            says what it holds, removes nothing
    journal environments remove "<name>" --yes      archives it under .journal/removed/
    journal environments remove "<name>" --yes --purge   deletes it outright

`--yes` writes the environment's pins and work whole to `environment.json` and moves its
to-do folder beside them, so what came off can be read or put back by hand. It refuses the
project's start environment (a new session would land nowhere), an environment a live
session is on, and this session's own. Docs are the project's and never go with it. The
removal is logged on the record, and stale sessions bound to the dead name are unbound.
`remove`, `rm`, `delete` and `forget` answer only under the noun: there is no top-level
`journal remove`, because a bare deleting verb is the one spelling a mistyped name must
never reach.

THE RECORD CAN BE CLEANED. Rules and pins are re-asserted verbatim at the top of every
compaction, in the highest authority the system has, and nothing revisits them — so the
user was revisiting them, by hand, pasting the same paragraph into session after session:
remove the obsolete rules, clear the docs nobody uses, strike the stale pins. A thing the
user has to say every time is a thing the tool has not learned.

    journal cleanup [--all]        (journal tidy is the same command)

It gathers only what has CHECKABLE evidence against it: a rule or pin naming a file that is
nowhere in the project or a backticked `journal <verb>` the CLI does not answer to, a doc
whose environment is gone or a draft with no parts in a fortnight, a to-do that has waited
on the user for a week, an environment with no pins, no open work, no to-dos and nobody on
it. Each is printed beside the command that retires it, with the evidence in the line so
the reader can disagree with it.

AGE IS NEVER EVIDENCE, and neither is prose that merely contains the word. A three-month-old
pin that still holds is the best kind of pin; a checker that flags it teaches the reader to
skim, and the next real finding goes past with the noise. Both false positives found against
a real record are now tests: the repo is named after the CLI, so a `journal <verb>` counts
only inside backticks, and a file that MOVED is a stale path rather than a dead claim.

WHAT NO CHECK CAN SEE is the rule that quietly stopped describing how anyone works — it
names no file and misspells nothing. So the report always ends with every rule in force,
numbered and aged, with its strike beside it, under a heading that says so. That part is a
reading list, on purpose.

Nothing is struck for anyone. A strike needs a reason and only hides the claim — `journal
rules --all` and `journal pins --all` still show it — so striking one you have read and
judged dead is cheap. The stop queue gained a `cleanup` subject, last and never held: when
the candidate set changes it says once that the record has entries with evidence against
them, because a command reachable only through the skill is a command the agent meets the
moment and does not know exists.

## 1.25.0 — a wait ends when the work starts again

`work await` buys silence: the stop stops nudging work that is in flight on something the
agent cannot hurry. That silence is right while the agent is blocked and wrong the moment it
is not — and the agent that has picked the work back up is the last thing in the system that
will remember to say so. The wait now ends by itself.

A WRITE IS THE SIGNAL, AND A READ IS NOT. Reading is what waiting LOOKS like: polling a log,
tailing an output file, checking whether the build is done. If any tool call cancelled the
wait, `await` would cancel itself on the first thing an agent did after filing it. A write
is different — nothing that is still blocked edits a file — and it is the same line this
package already draws at its gate, where reads are never refused and changes are. The
journal's own writes do not count either: `work update` while still waiting is a status
report, not the work resuming. And only the owning session's write wakes its own wait.

MEASURED, on the runner this came from: it awaited a subagent, resumed on its own, worked
for eighteen minutes and stopped into silence with the record still reading "in flight".
With this, its first edit ends the wait and the next stop holds it properly.

`held_work` is cleared with the wait, so the work can be held for again rather than
remembered as already-said. The `await` confirmation, `journal work help` and the skill all
say so at the moment the command is used.

## 1.24.2 — `work await` is taught where it is needed

`work await` shipped in 1.22.0, was documented in the skill and answered by `journal work
help`, and an agent working this very project still had to be told by the USER that it
exists. Both of those surfaces are opt-in, and the moment the command is needed is a stop —
work open, something in flight — where the hold offered exactly two ways out: `work end` it,
or `work update` where it got to. Neither is right when you are waiting on a build.

The teaching model here is "the block is the rules, the skill is the reasoning", and
`await` had been filed entirely under reasoning. It is in the rules now: the SessionStart
block's work line names it beside start, update and end; the open-work hold and the auto-on
work hold both offer it with `--pid=` and `--agent=`; so do `journal next` and the skill's
hold table.

And it is asserted, in both arms of the start block and in the hold text, because this is
the same failure as a line-count cap that no test measures — a thing documented as true
with nothing holding it true.

## 1.24.1 — the environments noun answers to `env`

`journal env` is `journal environments`, and so are `envs`, `environment`, `tracks` and
`track`. `environments` stays canonical (ruling R10) and every other spelling is a
permanent alias, never printed as deprecated — `--env=<name>` already spelled it short as a
flag, so the noun answering to the same word is the consistent thing.

The four places that listed those spellings inline are one constant now, `ENV_NOUNS`. Four
copies of a list is three chances to forget an alias, and the fifth site would have been
the one that did.

Two assertions in test_tracks.py flipped, and correctly: they held `journal environment
help` to REFUSING, because that spelling dispatched nowhere. It dispatches now, so it must
answer — the "help answers exactly what runs" rule, working in the direction that adds.

## 1.24.0 — a name that is also a verb

Every noun's READ is an explicit verb: `journal tools show <name>`, `journal docs show
<doc>`, `journal environments show "<name>"`, beside the `list` each noun already answers.
The bare spellings — `journal tools <name>`, `journal docs 2`, `journal environments
"<name>"` — all still run, as ruling R3 requires; `show` is the one that always works.

BECAUSE A TOOL CAN BE CALLED `add`. Reading one by putting its name where a verb goes is
fine until somebody catalogues a tool named after a verb, and then the noun's own
vocabulary eats it: `journal tools add` is the add verb, forever, and there is no way to
say "the tool called add". Proved with tools named add, run, index, list, show, strike and
set, and a doc named search — each unreachable before this, each readable now, and
`journal tools run run` runs the one called run.

AND A VERB WITH ITS ARGUMENT MISSING IS AN ERROR, NEVER A PAYLOAD. Found while probing the
same seam: `journal todos show` with no number fell past the check and was read as a TITLE.
It filed a to-do called "show" and reported success. A write that lands wrong while saying
it went right is the one shape this package exists to prevent. It refuses now, and so does
`journal environments show` with no name.

## 1.23.0 — one pattern for every command: `journal <noun> <verb> [<id>] [<payload>]`

AN ENVIRONMENT CAN BE CLAIMED. `journal claim "<name>" "<why>"` takes one a live session
still holds. The guard that refuses a second session on an environment is right almost
always and useless in the one case it is reached for — the holder is gone, a closed
terminal or a crashed session, and the work is not — where the only ways past were to wait
out `session_stale_hours` or to turn the guard off for every environment at once. A guard
whose only override is global is a guard people turn off.

A claim is an EVICTION, never co-tenancy: the holder is unbound, because two sessions on
one environment is the exact thing the guard exists to prevent. The evicted session is
TOLD — the reason lands on its runtime and its next stop reads it out, naming who took the
environment and why, and how to claim it back. Nothing is deleted; the pins, work and
to-dos are untouched. The reason is required, for the same reason `strike` requires one: a
takeover with no reason on the record is indistinguishable from a bug, and the session that
lost the environment is owed the sentence. Every claim is kept on the record — who, from
whom, when, why.

That fixed a wrong explanation, too. An evicted session is unbound, so it fell into the
registered-nowhere path, whose whole story is "the environment you START on is held by
somebody else" — true of the start environment and no answer at all to what happened. A
wrong cause is worse than none: the reader switches somewhere else and never learns its
work moved.

THE ENVIRONMENTS NOUN TAKES ITS VERBS. `journal environments switch|claim|prepare|delegate|
handoff` are twins of the top-level spellings, which ruling R11 keeps because they are
burned into hook.py, handoff.default.md and every generated handoff.md. Top-level was never
meant to be the only spelling: a reader who learned `journal todos start` and `journal pins
add` looks for `journal environments switch`, and finding nothing there is the
inconsistency this whole release exists to end.

Every command now takes its arguments the same way, and names what it does the same way.
Nouns are plural — `pins`, `rules`, `docs`, `tools`, `todo`/`todos` (twins, either
spelling) — and every mutating action has an explicit verb: `add`, `strike`, `promote`,
`list`, `show`, plus each noun's own lifecycle verbs. `strike` is the one word for
retiring anything, everywhere: a struck pin, a repealed rule, a dropped to-do, a removed
tool. The old spellings still work — `journal pin "<x>"`, `journal remember "<x>"`,
`journal rule "<x>"`, `journal rule --strike N "<why>"`, bare `journal strike N "<why>"`,
bare `journal promote N`, `journal todo drop N "<why>"`, `journal tools remove <name>
"<why>"` — calling the exact same function their new alias calls, so the two spellings
can never drift apart; none of them is printed as deprecated. `switch`, `prepare`,
`delegate`, `handoff` and `search` stay top-level verbs, not wrapped under an
`environments` noun — they are lifecycle actions, not collection CRUD.

A to-do's brief can be changed instead of rewritten by hand: `journal todos amend <n>
"<section title>" --brief` appends a new `## <title>` section from stdin; `journal todos
replace <n> ["<section title>"] --brief` swaps one named section, or the whole brief with
no title given. The old text is always kept, copied whole to struck/ before the rewrite.
This needed `todo.show` to stop collapsing an indented list or a `## ` heading into
run-on prose — it renders with `fmt.block` now, the same renderer the hook already used.

Five listings that grew without a cap now have the one `docs.carry`/`tools.carry`
already used: a bare `journal docs`/`tools`/`todo`/`pins`/`rules` shows 15 and says
"… and N more; `--page=2` shows the rest." A single item, a search result, and
`journal environments "<name>"` — the page a runner picks work up from — are never
capped; the cut targets a description or a listing, never a payload. The SessionStart
block taught the retired `journal start`/`update`/`end` spelling in the one place every
session actually learns from; it teaches `journal work start`/`update`/`end` now, and is
shorter besides — one line of tags, with what each means in the `journal` skill. The
unbound-session opening from 1.19.0 is untouched: a session that has taken no environment
is still told so, in the same block.

THE PLURAL IS TAUGHT FIRST, everywhere. Ruling R10 made plural nouns canonical, and the
run that implemented it left `journal.py`'s synopsis and `commands.md` headlining the
singular with the plural as a footnote while `SKILL.md` did the reverse — two shipped
files teaching opposite orders. Every surface now leads with the canonical spelling and
names the singular as a permanent alias.

AND THREE DEFECTS FOUND BY WATCHING A RUNNER WORK. The session that DISPATCHES a runner is
no longer nudged to work the same list: `handoff --run` turns auto on for the environment,
and the dispatching session stops too, so both actors were told to pick up the next to-do
and the record could not say which of them did what. A hold's details are read once —
`journal next` served a snapshot written at the stop that sent you there, so a loop firing
it every fifteen minutes went on offering to-dos that had been closed in between. And
`/.journal` lost its trailing slash in `.gitignore`, because the slash matches a directory
and a worktree's `.journal` is a SYMLINK: it showed as untracked in every worktree, and a
`git add -A` there would have committed a path on one machine.

Run `python3 install.py --check` before pulling. This entry carries the work that shipped
on the branch as 1.18.1, which forked from 1.18.0 while 1.19.0–1.22.0 landed on main; the
lineage is reconciled here, by hand, and there is no 1.18.1 to upgrade from.

## 1.22.0 — work that is waiting is not nudged

`journal work await "<what you wait on>"` marks open work as in flight on something the
agent cannot hurry — a subagent, a build, a review, a person — and the stop hold leaves
that piece alone. Measured on this project's own session: three consecutive stops were
held for work that was correctly open and simply waiting on a subagent, each costing an
update that said the same thing. A hold that fires while nothing can move is noise, and
noise is what teaches a reader to clear a hold without reading it.

NAME WHAT YOU WAIT ON. `--agent=<id>` for a dispatched subagent, `--pid=<n>` for a process.
A sentence is a claim nobody can check; an identifier is a fact the machine can. A pid is
watched with signal 0: when that process exits the wait is over at the very next stop
rather than burning its timeout, and the hold says it exited. An agent id cannot be tested
— nothing exposes a subagent's liveness to a hook — so it is recorded and named back in
the hold, which is what tells you which of three dispatches you are still waiting on.

IT ALWAYS EXPIRES, because a wait with no end is how work is abandoned quietly: the
awaited thing dies, nothing nudges, and the journal reads as busy forever. `--for=<minutes>`
overrides the 20-minute default, capped at two hours (`await_default_minutes`,
`await_max_minutes`). When it expires the hold returns FIRST and by name, saying what was
awaited and for how long, and offering the three ways out: `work update` what you know,
`work await` again, or `work end`. Any update or close ends a wait early — progress means
the waiting is over. When a loop or cron will wake the session, set `--for=` past its next
cycle so the wake-up arrives before the hold.

After updating: reload the journal skill.

## 1.21.0 — handing work over is its own skill, and a run works the list to its end

The hand-off is now a second skill, `journal-handoff`, installed beside `journal`.
Preparing an environment, `journal handoff` and its two prompts, the runner's worktree and
`journal delegate` moved into it whole; the `journal` skill keeps a pointer and loads it
before the first `prepare`, `handoff` or `delegate` of a session. A session that never
hands anything over no longer carries the procedure for doing so, and the half that says
which model to dispatch and what becomes of the runner's branch is now read at the moment
it is needed. `journal install` carries both skills; `skill/references/prepare.md` is gone
and is removed from installed copies by name.

`journal handoff "<name>" --run` now turns AUTO ON for the environment, and the command
does it rather than trusting the prompt to. A runner exists to work a list to its end;
with auto off its stop is not held for the next to-do, so it would stop and ask — which is
the conversation the session dispatched an agent to avoid. It stays on after `--off`;
`journal todo auto off` ends it when what is left is the user's to decide.

After updating: reload the journal skill, and note the new `journal-handoff` one.

## 1.20.0 — a hand-off's runner works in its own worktree

`journal handoff "<name>" --run` now says to dispatch the runner with its own worktree, so
two runs of two environments never edit one checkout. Only the runner: the hand-off agent
writes nothing but the journal, and the journal is shared by every worktree on purpose, so
isolating it would isolate nothing. The runner's `.journal` is a symlink to the main
checkout's — that is what `worktree.py` has always done — so one record survives many
trees, and the runner's pins and to-dos reach the session that dispatched it.

The runner commits as it goes, because work left uncommitted in a worktree is work nobody
can reach, and it hands back a BRANCH. What becomes of that is the session's to settle:
tell the user what is on the branch and offer the merge. When the user has already asked
for the work to be merged, the session says so in the runner's prompt and the runner merges
when it is done; absent those words it does not merge, rebase or push at all.

Fixed, from 1.19.0: a session that had chosen no environment yet recorded the START
environment as "where it was" when it switched or handed off, because `current` falls back
there so that reads work unbound. `switch --back` and `handoff --off` then put it on an
environment it had never chosen — the one thing the unbound start exists to prevent. Where
it was is now NOWHERE for such a session: it returns unbound, and is told so. The same
fallback was making the one-session-per-environment check skip an unbound session, which
could bind it to an environment a live session already held; the check now asks about the
binding, not the fallback.

After updating: reload the journal skill. A project with its own `.journal/handoff.md` keeps
it — copy the runner section of the new `handoff.default.md` if you want the worktree wording.

## 1.19.0 — a new session has no environment until it chooses one

A session used to be bound at its start to the project's start environment — one it had
never been asked about — so its pins, to-dos and work landed there because nothing had
asked. Now it starts on none. The user is shown one line at the start saying so and
naming the environments that exist; the agent is told the same, on the start block and
again on every prompt while it stands, with the instruction to take an environment from
what the user just asked and say in one line which it took, or to ask when the message
names nothing to work on. Reads work unbound. Every write is refused, naming the way out,
so nothing can land in an environment nobody chose.

The old behaviour is one setting: `bind_on_start: true` binds a new session to the start
environment as before. An unbound session holds no environment, so a second session is no
longer told the start one is taken before anybody has taken it; `switch` still refuses one
a live session holds. Subagents are untouched — a delegated one is put on its environment
by the session that dispatched it, and an undelegated one is outside all of this.

After updating: reload the journal skill.

## 1.18.0 — tracks are environments

What was called a track is an environment: a session is bound to one, `journal
environments` lists them, `journal switch "<name>"` moves between them, and
`journal --env=<name> <command>` runs any command on a named one without switching. The
old spellings still work — `journal tracks`, `--track=`, `one_session_per_track`, the
`track` subject in `stop_priority` and `silenced` — and nothing on disk changes shape.

An environment can be prepared and handed off. `journal prepare "<name>"` creates one,
switches the session to it and prints what preparing means; the procedure — the source
whole, the brief as a doc, a Plan agent and a second agent for the steps, pins, one
to-do per unit of work — is in the skill and runs only when the user asks.
`journal environments "<name>"` is the pickup page. `journal delegate "<name>"` makes
the session and every subagent it dispatches act on that environment: a delegated
subagent journals there under the hooks — the write gate, the hints, a hold at its
SubagentStop for open work, the rules as its window fills — and may not switch,
delegate or prepare. Undelegated subagents stay outside, as before. The update wires
the SubagentStop event (the harness treats it as notification-only today; the write
gate is what holds a delegated subagent to the journal).

`journal handoff "<name>" "<source>"` has agents do all of it: it creates and delegates
the environment and prints one prompt; the agent dispatches that one hand-off subagent,
which fetches the source, writes the brief, runs its own planner and critic, pins,
writes the to-dos and validates the page, then reports READY; `--run` prints the
runner's prompt for the second dispatch. What a hand-off means is `.journal/handoff.md`,
the project's copy of the shipped `handoff.default.md`, never touched by an update.

After updating: reload the journal skill.

## 1.17.1 — the cross-checkout lookup is for session ids only

Only a real session id (a UUID) is looked for across every project folder; a subagent's
`agent-…` name or a fixture's stem would have found a stale namesake elsewhere. The
suites are green on the 1.17.0 defaults.

After updating: nothing.

## 1.17.0 — worktrees find their session, and context never gates

A session that moved into a worktree keeps its transcript under the checkout it started
in; `journal nothing` there found no transcript, filed nothing, and the hook went on
denying every call. A session's transcript is now found wherever Claude Code keeps it,
and a decision that cannot be filed says so instead of "no pin is due".

The context window defaults to 1,000,000 and the context rung never gates a tool call by
default: it is a hold at the stop, once per turn, answered with `pin` or `nothing`.
`gate_after_context_rung: true` brings the gate back. `journal verify` reports the
window the hook actually uses. A hold no longer repeats its label in its body.

After updating: nothing.

## 1.16.1 — one way out for every line

Everything a command prints passes through one function, and everything the hook hands
the harness through one other, so the house style is enforced in one place: errors are
one marked line, long paragraphs wrap, shaped lines — columns, commands, the hook's
one-liners — are kept as they are. `docs <doc> files` and the attachments of `docs
<doc>` are a columned table: name, what it is, kind and age, path, a folder's files
indented under it.

After updating: nothing.

## 1.16.0 — a hint to attach what keeps being read

A file that is not source — no source extension, not tracked by git; outside the
project, anything that is not source — read twice in one session earns a hint, once per
file, to attach it to the doc it belongs to. A design's rendered HTML, an export, a PDF
the user sent, a log. Source files (.vue, .blade.php, .py, tracked .html…) are never
hinted. `attach_hint_reads` sets the count; `attach_hint` in `silenced` turns it off.

After updating: reload the journal skill.

## 1.15.1 — one word for a doc

Every command listing says `<doc>` where a doc's number or name goes, and `<doc>.<p>`
for a part, in the synopsis, the skill, the reference and the README alike; `<name>.<p>`
resolves too.

After updating: reload the journal skill.

## 1.15.0 — attachments, and docs by name

A doc holds files as well as parts: `journal docs attach <doc> <path> "<what it is>"`
copies a file or a whole folder into the doc's files/ and lists it with one line saying
what it is; `journal docs <doc> files` shows them as a tree, `journal docs files` every
doc's; `detach` keeps the file under struck/ with the reason. Attachments are found by
`docs search` by name and by what they are, files inside a folder too, and the catalogue
and the start block count them. A file copied in by hand is adopted by `docs index`.

A doc is referenced by name as well as number, everywhere: `journal docs reactivity`,
`docs attach reactivity …`, `--doc=reactivity`. The title, case-insensitive, or a unique
part of it; a citation is stored as the number, so a renamed doc keeps what cites it.

After updating: reload the journal skill.

## 1.14.2 — the skill's start section knows about tracks

The skill says what the start block names — the track this session is bound to — and
what to do when it leads with a taken track.

After updating: reload the journal skill.

## 1.14.1 — a citation names its doc

A pin, rule or to-do that cites a part showed the part's title alone; it shows
"→ doc 1.4: <doc> · <part>" now, in listings and in the start block. `--doc=N` and
`--doc=N.P` are taught where the pin is: the skill's pin section, the synopsis, the
status page and the docs catalogue. The track rule is tested to leave subagents alone.

After updating: reload the journal skill.

## 1.14.0 — a prioritized queue, the loop first, one session per track

The stop queue's subjects carry a priority: track 5, loop 10, context 20, deferral 30,
untagged 40, work 50, auto 60, lowest first, and `stop_priority` in settings.json
reorders them per project. New at the head: with auto on and something to do, a session
without a loop is asked to start one before anything else (`journal loop set` when one
runs that the hook cannot see). A hold is one printed line now, not two.

One running session works a track. A second session that starts on a taken track is
told at its start by whom, held at its stops and refused edits until it has switched;
a switch onto a taken track is refused. A SessionEnd frees the track; a session not seen
for `session_stale_hours` (24) counts as gone. `journal tracks` says who is running.
`one_session_per_track: false` switches the rule off.

After updating: reload the journal skill. With auto on, make sure a loop is running.

## 1.13.0 — sessions are bound to tracks

Two sessions can work two tracks of one project at once. A session is bound to the
project's start track when it starts; `journal switch` from inside a session moves that
session only, `--project` also moves where new sessions start; from a terminal a switch
is always the project's, and it lists the sessions bound elsewhere with how to move one
(`--session=<id>`, `--all-sessions`). Pins and work now live under their track's name in
the record with `current` as a pointer; an old record is moved on first read.

After updating: nothing.

## 1.12.0 — the stop queue

Stop holds are a queue the hook runs one by one: context, deferral, untagged message,
open work, auto — one subject per stop, each at most once per turn, each pending until
its condition is actually resolved. One reply no longer clears three, and nothing can
loop. After a resolved context decision the same turn raises "auto is on, pick up the
next to-do".

After updating: nothing.

## 1.11.2 — the loop is said where auto is explained

The skill's to-do section says that auto mode means keeping a loop running (`loop`
skill, `15m journal next`), and the 1.6.0 entry now says to start it. An agent had read
both places it was documented and acted on neither; it told us why.

After updating: with auto on, start the loop if none is running.

## 1.11.1 — the package's own journal is not part of the package

agent-journal is now developed in its own repository, which keeps its own `.journal/`;
pulls skip it. Nothing to do after updating.

## 1.11.0 — worktrees share the journal; no update-check cache

In a linked git worktree the checked-out copy of `.journal/` becomes a symlink to the
main checkout's at session start, so every worktree reads and writes one record. A copy
with local changes is not deleted: the main journal is used and `journal worktree link`
replaces the copy when you say so.

Nothing to do after updating.

## 1.10.0 — holds form a queue; the update check is hourly

A hold stays pending until its condition is resolved — the message tagged, the context
decision made, the work noted or ended — and the next condition is raised only after,
so one reply no longer clears three. At most three holds per turn, so nothing loops.
The update check asks the repository every time; the cached answer is used only when
the network is down.

After updating: reload the `journal` skill.

## 1.9.0 — `journal pin`

A pin is written with `journal pin "<claim>"`, the same word everything else uses.
`journal remember` still works.

After updating: reload the `journal` skill.

## 1.8.0 — tool-shaped work is noticed; reload the skill after an update

A script written into a scratch or scripts folder, the same long inline script run twice,
or a scratch script run by name earns a one-time hint to catalogue it as a tool. After an
update the agent is told to reload the journal skill.

After updating: reload the `journal` skill.

## 1.7.0 — tools

Scripts the agent keeps for repeated work, catalogued under `.journal/tools/<name>/` with
a `tool.md` (title, summary, usage, when, entry point) and run with `journal tools run
<name> …`. Every session is handed the catalogue. `journal tools index` adopts folders
already there; `--entry` can point at a script anywhere in the project.

After updating: catalogue the scripts you already have.

## 1.6.0 — one-line holds, `journal next`, and a loop for auto mode

Every hold at a stop is one line; anything longer is behind `journal next`, which the
line names. With auto on, the agent is asked to keep a loop running that prompts
`journal next` every `auto_loop_minutes` (default 15), so an idle session comes back and
carries on until nothing is left it can do. The auto texts say "auto mode is on" rather
than "the user is away".

After updating: with auto on, start the loop — the `loop` skill with `15m journal next`.

## 1.5.2 — two fixes from a multi-repo workspace

`install.py --alias` removes the alias 1.3.x wrote into your shell rc, which shadowed the
new launcher and kept `journal` broken; an alias it did not write is named so you can
delete it. The gates read `python3 .journal/journal.py …` as the journal, so a context
warning can be answered in that form too.

After updating: run `.journal/install.py --alias` once, then open a new terminal.

## 1.5.1 — the `journal` command works without git

It finds the project by walking up to the nearest `.journal/`. Run `.journal/install.py
--alias` once to get the new launcher.

## 1.5.0 — `journal work start|update|end`; `journal update` updates the journal

The work commands are a family: `journal work start "…"`, `journal work update "…"`,
`journal work end "…"`. That frees `journal update` to mean updating the journal itself
(`journal upgrade` still works). The old `journal start` and `journal end` keep working;
`journal update "<text>"` now tells you to use `work update`.

After updating: use `journal work update` for notes on the open work.

## 1.4.0 — a `journal` command for every shell

`--alias` now installs a `journal` script in ~/.local/bin instead of a zsh/bash alias, so
it works in any shell; the installer says the one PATH line to add if needed. The README
explains the tags that appear at the start of the agent's messages.

After upgrading: run `.journal/install.py --alias` once to get the command; the old alias
in your shell rc keeps working and can be removed.

## 1.3.2 — a short install

The installer prints what it changed, "Installed.", and the one next step. Nothing to do after upgrading.

## 1.3.1 — install ends with next steps

The installer no longer runs checks that cannot pass before Claude Code has started; it
says what it wired and what to do next. `journal verify` from a plain terminal reports
"not fired yet" and "window not yet known" as facts, not failures.

Nothing to do after upgrading.

## 1.3.0 — the context window is learned

No setting needed: the window is learned at the first compaction (the peak before it is
the window) or from the session's peak once it rules out every window but one. The
`context_window` setting is an override. The README gained a settings section.

Nothing to do after upgrading; a `context_window` you set still wins.

## 1.2.3 — README commands, two columns again

Nothing to do after upgrading.

## 1.2.2 — README wording

How it works says the transcript is Claude Code's default behaviour, built on rather than replaced. Nothing to do after upgrading.

## 1.2.1 — README commands

One command per line with its meaning beneath; agent-only commands marked. Nothing to do after upgrading.

## 1.2.0 — docs live in .journal/docs

The catalogue's folder is `.journal/docs/` by default, beside the record and the to-dos,
so everything the journal keeps is in one place. A project that keeps its docs elsewhere
sets `docs_dir` in `.journal/settings.json`. Pulls never touch a project's docs.

After upgrading: if you had catalogued docs under `docs/`, move them to `.journal/docs/`
or set `"docs_dir": "docs"`.

## 1.1.6 — README: how does it work

A section at the bottom on the transcript, tags, line numbers, tracks, compaction and the hooks. Nothing to do after upgrading.

## 1.1.5 — README wording

The commands section opens with who runs what and nothing else. Nothing to do after upgrading.

## 1.1.4 — README features as headings

Each feature in the README has its own small heading. Nothing to do after upgrading.

## 1.1.3 — holds are one line; the README rewritten

Every hold at a stop now carries only its one-line instruction; the reasoning is in the
skill's hold table. Only the context warning keeps its text, because that text is what the
agent decides with. The README is rewritten: what it is, what it does, install, features,
commands — with the commands you run and the agent runs told apart.

Nothing to do after upgrading.

## 1.1.2 — a pull from a URL no longer copies the clone's .git

Upgrading from the repository copied the clone's `.git` folder into `.journal/`, a nested
repository nobody wanted. It is excluded. If you upgraded on 1.1.1, `rm -rf .journal/.git`.

## 1.1.1 — a pull no longer runs the test suites

`journal upgrade` and `install.py --from` copy the package and stop. The suites ran in a
staging directory before every pull and cost minutes per upgrade; they run where the
package is developed now. `install.py --from <src> --test` runs them if you want.

Nothing to do after upgrading.

## 1.1.0 — the README, and a fix to `install.py --from <url>`

The package now ships its README: what the journal is, how to install it in one line,
every command with what it does, and how it holds the agent to the rules. Read it once;
it is the human-readable version of the skill.

`install.py --from` takes a git URL as well as a path (1.0.0 folded the URL into a path).
`journal upgrade` was unaffected.

Nothing to do after upgrading.

## 1.0.0 — the first public release

The journal as it stands: tags on every message, declared work with a gate on writes,
pins and rules, to-dos with `ask`, `answer` and `auto`, a docs catalogue over `docs/`,
tracks, the context ladder that forces a decision, search across a track's sessions, and
`verify` that tells wired from fired.

Nothing to do after installing: `.journal/install.py --alias` wires the hooks and the
skill; `journal verify` says whether it is live.
