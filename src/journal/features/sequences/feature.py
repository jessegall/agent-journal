from journal.features.entry import Entry
from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.models.node_kind import NodeKind
from journal.features.skill import Skill
from journal.features.sequences.commands.sequence_command import SequenceCommand
from journal.features.sequences.listeners.start_on_created import StartOnCreated
from journal.features.sequences.seeds.shipped_sequences import ShippedSequences
from journal.features.sequences.states.running_sequence import RunningSequence


class Sequences(Feature):
    name = "sequences"
    title = "Sequences"
    help = "Steps the agent follows one at a time."
    states = (RunningSequence,)
    commands = (SequenceCommand,)
    listeners = (StartOnCreated,)
    actions = (
        Entry(NodeKind.ACTION, 'start_sequence', 'Start a sequence', 'starts the sequence named in the text at its first step', takes_text=True),
    )
    seeds = (ShippedSequences,)

    STEP = Nudge(name, "step", "sequence {{n}}, step {{step}}: {{text}}", "journal sequence next when it is done", repeat_after=0)
    ENDED = Nudge(name, "ended", "sequence {{n}} ran its last step", repeat_after=0)
    nudges = (STEP, ENDED)

    skill = Skill("sequences", 'Follow a sequence of steps one at a time; load it when a sequence is run or written', """
# Sequences

Steps followed in order, one at a time.

- `journal sequence create "<title>" --steps "first | second | third"` writes one; `--starts-on plan.created`
  makes a row you create start it on its own.
- `journal sequence run <n>` starts it: you are told step 1. `journal sequence next` when the step is done;
  the last step takes you back to what you were doing.
- Creating a plan starts Building a plan: follow its steps before you do anything else to the plan.
""", keywords=('sequence', 'sequences', 'steps'), required_in=('running_sequence',))
