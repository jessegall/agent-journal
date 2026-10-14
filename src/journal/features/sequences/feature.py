from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.sequences.states.running_sequence import RunningSequence


class Sequences(Feature):
    name = "sequences"
    title = "Sequences"
    states = (RunningSequence,)

    STEP = Nudge(name, "step", "sequence {{n}}, step {{step}}: {{text}}")
    STALLED = Nudge(name, "stalled", "sequence {{n}} has stood at step {{step}} for {{minutes}} minutes")
    ENDED = Nudge(name, "ended", "sequence {{n}} ran its last step")
    nudges = (STEP, STALLED, ENDED)
