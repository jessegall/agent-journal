from journal.features.entry import Entry
from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.models.option import Option
from journal.models.node_kind import NodeKind
from journal.features.skill import Skill
from journal.features.sequences.commands.sequence_command import SequenceCommand
from journal.features.sequences.listeners.carry_runs_to_the_next_session import CarryRunsToTheNextSession
from journal.features.sequences.listeners.end_runs_of_a_cancelled_row import EndRunsOfACancelledRow
from journal.features.sequences.listeners.end_runs_of_a_deleted_row import EndRunsOfADeletedRow
from journal.features.sequences.listeners.end_runs_of_a_deleted_sequence import EndRunsOfADeletedSequence
from journal.features.sequences.listeners.hold_writes_for_the_step import HoldWritesForTheStep
from journal.features.sequences.listeners.record_run_changes import RecordRunChanges
from journal.features.sequences.listeners.say_the_step_at_a_pace import SayTheStepAtAPace
from journal.features.sequences.listeners.say_the_step_at_a_stop import SayTheStepAtAStop
from journal.features.sequences.listeners.say_the_step_at_start import SayTheStepAtStart
from journal.features.sequences.listeners.say_the_step_when_a_wait_ends import SayTheStepWhenAWaitEnds
from journal.features.sequences.listeners.start_on_created import StartOnCreated
from journal.features.sequences.seeds.shipped_sequences import ShippedSequences


class Sequences(Feature):
    name = "sequences"
    title = "Sequences"
    help = "Steps the agent follows one at a time."
    commands = (SequenceCommand,)
    listeners = (StartOnCreated, CarryRunsToTheNextSession, SayTheStepAtStart, SayTheStepAtAStop, HoldWritesForTheStep, SayTheStepWhenAWaitEnds, SayTheStepAtAPace, EndRunsOfADeletedSequence, EndRunsOfADeletedRow, EndRunsOfACancelledRow, RecordRunChanges)
    actions = (
        Entry(NodeKind.ACTION, 'start_sequence', 'Start a sequence', 'starts the sequence named in the text at its first step', takes_text=True),
    )
    seeds = (ShippedSequences,)

    STEP = Nudge(name, "step", "sequence {{n}}, step {{step}}: {{text}}", "`journal sequence follow` to take it up, `journal sequence next` when it is done", repeat_after=0)
    FOLLOWING = Nudge(name, "following", "following sequence {{n}}, step {{step}}: {{text}}", "`journal sequence next` when it is done", repeat_after=0)
    HELD = Nudge(name, "held", "a write waits for sequence {{n}}, step {{step}}: {{text}}", "`journal sequence follow` takes it up; `journal sequence park --why \"<why>\"` sets the run aside", repeat_after=0)
    STALE = Nudge(name, "stale", "{{writes}} writes since sequence {{n}}, step {{step}} was taken up: {{text}}", "`journal sequence next` if it is done, `journal sequence follow` to carry on with it, or `journal sequence park --why \"<why>\"`", repeat_after=0)
    PARKED = Nudge(name, "parked", "sequence {{n}} is parked at step {{step}}: {{why}}", "`journal sequence follow` resumes it", repeat_after=0)
    ENDED = Nudge(name, "ended", "sequence {{n}} ran its last step", repeat_after=0)
    ABANDONED = Nudge(name, "abandoned", "sequence {{n}} abandoned", repeat_after=0)
    CANNOT_FINISH = Nudge(name, "cannot_finish", "sequence {{n}} ended: {{why}}", repeat_after=0)
    SKIPPED = Nudge(name, "skipped", "the user skipped step {{step}} of sequence {{n}}", repeat_after=0)
    ENDED_BY_USER = Nudge(name, "ended_by_user", "the user ended sequence {{n}}", repeat_after=0)
    nudges = (STEP, FOLLOWING, HELD, STALE, PARKED, ENDED, ABANDONED, CANNOT_FINISH, SKIPPED, ENDED_BY_USER)

    STALE_AFTER = Option("sequences.stale_after", "Hold writes again after", "Writes since a step was taken up before the next write waits for the step to be moved on, followed again or parked", 25)
    SAY_EVERY = Option("sequences.say_every", "Say the step again after", "Minutes a step stands unheard before it is said again to a quiet agent; three times as long while the agent waits", 10, unit="minutes")
    options = (STALE_AFTER, SAY_EVERY)

    skill = Skill("sequences", 'Follow a sequence of steps one at a time; load it when a sequence is run or written', """
# Sequences

Steps followed in order, one at a time. A running sequence stays with you through tasks, waits and new sessions
until its last step is done.

- `journal sequence run <n>` starts one and tells you step 1. Creating a plan starts Building a plan on its own.
- `journal sequence follow` takes the step in hand up: until you do, a write waits, while reads and journal commands
  go through. A command the step names, in backticks, also takes it up when you run it.
- `journal sequence next` when the step is done: you are told the next one, or that the sequence ended and what
  you were doing before it. A step never taken up cannot be moved on.
- A step taken up that stands for many writes holds the next write again: move it on, follow it again, or park it.
- `journal sequence park --why "<why>"` sets the run aside, its holds quiet; `journal sequence follow` resumes it.
- A sequence about a row ends only when the row is where it promises: Building a plan's last step waits for a ready
  plan. A row cancelled or deleted, or the sequence deleted, ends the run and you are told.
- `journal sequence abandon --why "<why>"` names the steps it would leave undone; again with `--sure` it gives the run
  up and tells the user. Take the step up first.
- One started while another runs is followed first; when it ends, the other is said again. Only the user's own
  words start a sequence by its trigger.
- A stop with a step open is told the step once; a wait, an open question or a debt to the journal keeps it quiet.
- `journal sequence create "<title>" --steps "first | second | third"` writes one; `--starts-on plan.created`
  makes a row you create start it on its own.
""", keywords=('sequence', 'sequences', 'steps'))
