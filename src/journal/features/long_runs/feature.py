from journal.features.feature import Feature
from journal.features.long_runs.listeners.hold_long_runs import HoldLongRuns
from journal.features.long_runs.listeners.time_runs import TimeRuns
from journal.features.nudge import Nudge


class LongRuns(Feature):
    name = "long_runs"
    title = "Long commands"
    listeners = (HoldLongRuns, TimeRuns)

    BACKGROUND = Nudge(name, "background", "{{command}} took {{seconds}}s last time", "run it in the background and carry on; you are told when it ends", repeat_after=600)
    nudges = (BACKGROUND,)
