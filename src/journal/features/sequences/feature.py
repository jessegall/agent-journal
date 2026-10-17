from journal.features.entry import Entry
from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.option import Option
from journal.models.node_kind import NodeKind
from journal.features.skill import Skill
from journal.features.sequences.commands.sequence_command import SequenceCommand
from journal.features.sequences.listeners.carry_runs_to_the_next_session import CarryRunsToTheNextSession
from journal.features.sequences.listeners.hold_writes_for_the_step import HoldWritesForTheStep
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
    listeners = (StartOnCreated, CarryRunsToTheNextSession, SayTheStepAtStart, SayTheStepAtAStop, HoldWritesForTheStep, SayTheStepWhenAWaitEnds, SayTheStepAtAPace)
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
    nudges = (STEP, FOLLOWING, HELD, STALE, PARKED, ENDED)

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
- A stop with a step open is told the step once; a wait, an open question or a debt to the journal keeps it quiet.
- `journal sequence create "<title>" --steps "first | second | third"` writes one; `--starts-on plan.created`
  makes a row you create start it on its own.
""", keywords=('sequence', 'sequences', 'steps'))
