# Changelog

Newest first. Each entry is what changed, what it makes possible, and what to do about it.
`journal upgrade` prints the entries since the version you had; a session started on a
newer version than the last one it saw is handed the same.

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
