---
name: journal-plans
description: "Journal plans: when a piece of work is a plan rather than a list, shaping the goal with the user before drafting, writing it (plans add, plans phase, plans todos, plans from-doc), what a phase and a checkpoint are, who approves it and who continues it past a checkpoint, how auto mode works a plan, and abandoning one. Use it when the user asks for a plan, a roadmap or a phased approach, before you draft one, when a plan is active and you are picking up its to-dos, when a plan refuses to start or stalls, when the user approves or continues a plan in the viewer, and when a plan should be stopped. Not for subagents."
---

# Journal plans

**Not for subagents.** A subagent reports what it found; the main conversation files it.
It is one of the journal's skills; the core `journal` skill says when each applies.
Every command runs through `.journal/journal.py`; `journal` is an alias for it.

## Is it a plan?

    a handful of things to do, in any order                a to-do list
    one thing, now                                          work
    work with a SHAPE — areas that must land in order,
    somewhere the user wants to look before it goes on      a plan

A plan is the to-do list **with an order and a goal on it**. Everything in it is still
to-dos, worked the ordinary way; what the plan adds is which of them come first, what each
group is for, and where the agent stops to let the user look. If nothing in the work has to
wait for anything else, it is a list, and calling it a plan buys the user a document to
approve and nothing else.

**The user asking to "plan" something is asking for a plan.** So is a request phrased as
phases, a roadmap, a redesign, or "first … then …". Do not park such a request as a to-do
and carry on: it is the work being asked for.


**The user moves a plan from the viewer, and an idle session is told.** Approving a draft and
continuing past a checkpoint both wake a session that is sitting idle — *the user approved plan 3*,
*the user continued plan 3 past phase 2* — and the line says what is ahead. Nothing files itself
from it: read the plan and carry on with the phase that is now open.


## Shape the goal with the user BEFORE drafting

**A plan is drafted WITH the user, not handed to them.** Ask what is true when it is done,
in their words — that sentence is the plan's `--goal`, and it is the one thing the whole
plan is judged against. Say back what you understood, name what you would put in the first
phase and what you would leave out, and let them correct it. Then draft.

Drafting first and asking after wastes the part they most wanted to steer: a plan that is
already written reads as a decision, and correcting it costs them a paragraph instead of a
word. Measured here: a plan drafted without that conversation had to be rewritten.

## Writing one

    journal plans add "<title>" --goal="<what is true when it is done>" [--brief]   the brief on stdin
    journal plans phase <n> "<title>" [--when="<what is true when the phase is complete>"] [--checkpoint]
    journal plans phase <n> "<title>" --before=<p>       put it BEFORE phase p, not at the end
    journal plans rephrase <n> <p> ["<title>"] [--when=] [--checkpoint|--no-checkpoint]   correct one
    journal plans todos <n> <p> 4 5 6          put existing to-dos in phase p
    journal plans todos <n> <p> 4 --off        take one out
    journal plans from-doc <doc>               a draft from a document's "Phase …" parts
    journal plans                              every plan here, with its status
    journal plans show <n>                     the plan, its phases and their to-dos
    journal plans link <n> "doc 4"|"doc 4.2"|"report 1"   what it rests on
    journal plans edit <n> ["<title>"] [--goal=] [--brief]   reword the plan itself, or its goal
    journal plans park <n> "<why>"             set it aside without abandoning it; it can be taken up again
    journal plans acknowledge <n>              you have read a plan the USER wrote, and will work it
    journal plans abandon <n> "<why>"          it is stopped, and why

The order is **add, then phase, then todos**: a phase belongs to a plan and a to-do belongs
to a phase. To-dos are written the ordinary way (`journal todos add "<title>" --brief`) and
then placed; a plan does not have a private kind of to-do.

**A phase that belongs in the middle goes in the middle.** `--before=<p>` inserts it there and the
phases after it move along, carrying their to-dos and their checkpoints — nothing is renumbered by
hand, because a phase's number is its position and every reader derives it. Write the plan you can
see and correct it when the work teaches you more; a plan abandoned and rewritten because a phase
could only be appended is a plan the user has to approve twice.

**A phase written wrong is corrected, not lived with.** `plans rephrase` changes its title, what
completes it, or whether it is a checkpoint — for the same reason `--before` exists, that a plan is
written before the work is understood. The checkpoint is the one that changes what is HAPPENING, so
it says so: taking one off a phase the plan is stopped at sets the plan moving, and putting one on a
phase already passed changes nothing that has happened. Both are allowed and both are named.

**A to-do sits in ONE phase**, and a row written into the wrong one is corrected in a
single command: `journal plans todos <n> <p> 4 --move` takes it out of the phase it is in
and puts it here. Without `--move` it is refused, naming where the row already sits.

**A phase is an area of work, not a schedule.** "Everything the viewer shows about a plan"
is a phase; "Tuesday" and "the next two hours" are not. `--when` says what is true when the
phase is complete, which is what makes "is this phase done?" a question with an answer.

**A checkpoint is where you STOP.** `--checkpoint` on a phase means: when its to-dos are
done, the agent does not start the next phase — the user looks, and continues the plan in
the viewer. Put one where the work would be expensive to undo, or where the next phase
depends on something only the user can judge. Nothing else stops a plan.

**A plan can arrive from a paste.** When the user pastes a transcript or a summary, anything
in it that reads as a plan is DRAFTED, never activated: `plans add` leaves a draft, its
to-dos wait, and the user approves it in the viewer — the same rule as any other plan, and
the reason a paste may file to-dos on its own but not start a plan. Record which message it
came from (`journal messages process <n> --part="<their words>" --became="plan <p>"`), so the
plan page shows the words behind the proposal before the user approves it. The
`journal-messages` skill says how a long paste is read.

## Who does what

**Only the user activates a plan.** `journal plans activate` refuses from an agent, saying
so: they approve it in the viewer. A plan that is still a draft holds its to-dos — `next`
says "plan N is a draft: its to-dos wait until the user approves it in the viewer" — and
that wait is correct, not something to work around by starting the rows by hand.

**Only the user continues a plan past a checkpoint**, in the viewer, for the same reason.

**One plan is active at a time on an environment.** Activating another is refused while one
is running. Drafts are free: write as many as the work needs.

**A plan being written cannot be declared ready while a phase is empty.** `journal plans
ready <n>` refuses and names the phase: until every phase has its to-dos the plan stays
*being written*, so the user never sees a Start button on something the agent is still
filling in. Write the phases AND their rows, then say it is ready.

**A plan cannot start with an empty first phase** — "plan N cannot start: its first phase
has no to-dos". A phase with no to-dos in the middle of a run stalls it the same way, and
says the same thing: break it down with `journal todos add` and `journal plans todos`.

## Running one

With a plan active, `journal next` picks to-dos **from the current phase only**, in order,
and auto mode works them the way it works any list. When a phase's rows are all closed the
phase is complete and the next becomes current — unless it was a checkpoint, and then the
plan waits.

**There is one auto switch, and it is the JOURNAL's.** A plan has none of its own, and
neither does an environment — switching environments never turns it off: if
auto is on, the list is worked AND checkpoints are passed; if it is off, the plan stops at
them. `journal auto-mode [enable|disable]`.

**A phase never wedges the list.** Auto takes rows from the current phase while it has
any that are ready; when every row there is waiting on the user, blocked or held by an
agent, the next phase is offered instead of nothing. The one thing that really stops the
run is a checkpoint the user has not continued past — which is what a checkpoint is for.

**The plan is handed back at every start and every compaction**, as a line saying which
plan is active, which phase is current and what completes it. So the plan, unlike your
memory of it, survives; read `journal plans show <n>` rather than reconstructing it.

**Abandoning is a close, with a reason.** `journal plans abandon <n> "<why>"` — its to-dos
stay on the list, because stopping a plan is not finishing its rows, the same way ending
work is not finishing a to-do.
