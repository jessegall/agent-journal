from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.sequences.commands.sequence_command import SequenceCommand
from journal.features.sequences.states.running_sequence import RunningSequence


class Sequences(Feature):
    name = "sequences"
    title = "Sequences"
    states = (RunningSequence,)
    commands = (SequenceCommand,)

    STEP = Nudge(name, "step", "sequence {{n}}, step {{step}}: {{text}}", "journal sequence next when it is done", repeat_after=0)
    ENDED = Nudge(name, "ended", "sequence {{n}} ran its last step", repeat_after=0)
    nudges = (STEP, ENDED)
