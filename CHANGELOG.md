# Changelog

Newest first. Each entry is what changed, what it makes possible, and what to do about it.
`journal upgrade` prints the entries since the version you had; a session started on a
newer version than the last one it saw is handed the same.

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
