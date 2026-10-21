from journal.features.feature import Feature
from journal.features.sequences.support.sequences_data_reader import SequencesDataReader
from journal.engine.nudge import Nudge
from journal.support.option import Option
from journal.support.skill import Skill
from journal.features.sequences.commands.sequence_command import SequenceCommand
from journal.features.sequences.listeners.carry_runs_to_the_next_session import CarryRunsToTheNextSession
from journal.features.sequences.listeners.end_runs_of_a_cancelled_row import EndRunsOfACancelledRow
from journal.features.sequences.listeners.end_runs_of_a_deleted_row import EndRunsOfADeletedRow
from journal.features.sequences.listeners.end_runs_of_a_deleted_sequence import EndRunsOfADeletedSequence
from journal.features.sequences.listeners.record_run_changes import RecordRunChanges
from journal.features.sequences.listeners.follow_step_by_command import FollowStepByCommand
from journal.features.sequences.listeners.start_on_created import StartOnCreated
from journal.features.sequences.support.sequences_conduct import SequencesConduct
from journal.features.sequences.seeds.shipped_sequences import ShippedSequences


class Sequences(Feature):
    name = "sequences"
    title = "Sequences"
    help = "Steps the agent follows one at a time."
    commands = (SequenceCommand,)
    listeners = (StartOnCreated, CarryRunsToTheNextSession, FollowStepByCommand, EndRunsOfADeletedSequence, EndRunsOfADeletedRow, EndRunsOfACancelledRow, RecordRunChanges)
    data = (SequencesDataReader,)
    conduct = (SequencesConduct,)
    seeds = (ShippedSequences,)

    PENDING_STEP = Nudge(name, "step_to_follow", "sequence {{n}}, step {{step}}: {{text}}", "`journal sequence follow` to take it up, `journal sequence next` when it is done", repeat_after=0)
    CURRENT_STEP = Nudge(name, "following_the_step", "following sequence {{n}}, step {{step}}: {{text}}", "`journal sequence next` when it is done", repeat_after=0)
    STEP_EDIT_BLOCK = Nudge(name, "write_held_for_the_step", "a write waits for sequence {{n}}, step {{step}}: {{text}}", "`journal sequence follow` takes it up; `journal sequence park --why \"<why>\"` sets the run aside", repeat_after=0)
    STALE_STEP = Nudge(name, "step_stale_move_it_on", "{{writes}} writes since sequence {{n}}, step {{step}} was taken up: {{text}}", "`journal sequence next` if it is done, `journal sequence follow` to carry on with it, or `journal sequence park --why \"<why>\"`", repeat_after=0)
    SEQUENCE_SUSPENDED = Nudge(name, "sequence_parked", "sequence {{n}} is parked at step {{step}}: {{why}}", "`journal sequence follow` resumes it", repeat_after=0)
    SEQUENCE_ENDED = Nudge(name, "sequence_ended", "sequence {{n}} ran its last step", repeat_after=0)
    SEQUENCE_ABANDONED = Nudge(name, "sequence_abandoned", "sequence {{n}} abandoned", repeat_after=0)
    SEQUENCE_CANNOT_FINISH = Nudge(name, "sequence_cannot_finish", "sequence {{n}} ended: {{why}}", repeat_after=0)
    STEP_OMISSION = Nudge(name, "the_user_skipped_a_step", "the user skipped step {{step}} of sequence {{n}}", repeat_after=0)
    SEQUENCE_CANCELLED = Nudge(name, "the_user_ended_the_sequence", "the user ended sequence {{n}}", repeat_after=0)
    nudges = (PENDING_STEP, CURRENT_STEP, STEP_EDIT_BLOCK, STALE_STEP, SEQUENCE_SUSPENDED, SEQUENCE_ENDED, SEQUENCE_ABANDONED, SEQUENCE_CANNOT_FINISH, STEP_OMISSION, SEQUENCE_CANCELLED)

    STALENESS_LIMIT = Option("sequences.stale_after", "Hold writes again after", "Writes since a step was taken up before the next write waits for the step to be moved on, followed again or parked", 25)
    STEP_REPEAT_INTERVAL = Option("sequences.say_every", "Say the step again after", "Minutes a step stands unheard before it is said again to a quiet agent; three times as long while the agent waits", 10, unit="minutes")
    options = (STALENESS_LIMIT, STEP_REPEAT_INTERVAL)

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
