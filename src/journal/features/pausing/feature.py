from journal.engine.nudge import Nudge
from journal.features.feature import Feature
from journal.features.pausing.states.paused_by_user import PausedByUser
from journal.features.pausing.support.pausing_conduct import PausingConduct


class PausingFeature(Feature):
    NAME = "pausing"
    PAUSED = Nudge(NAME, "paused", "the user paused you: stop here and wait", "every tool call is held until the user resumes you; say nothing more until then", repeat_after=0)
    RESUMED = Nudge(NAME, "resumed", "the user resumed you: carry on where you stopped", repeat_after=0)

    name = NAME
    title = "Pausing the agent"
    fixed = True
    help = "The pause button on the top bar holds the agent: it finishes the step it is on, then waits until you resume it or write to it."
    states = (PausedByUser,)
    conduct = (PausingConduct,)
    nudges = (PAUSED, RESUMED)
