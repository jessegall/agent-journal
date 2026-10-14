from journal.features.feature import Feature
from journal.features.nudge import Nudge


class Skills(Feature):
    name = "skills"
    title = "Skills"

    UNLOADED = Nudge(name, "unloaded", "no journal skill is loaded in this window")
    STALE = Nudge(name, "stale", "{{skills}} changed since you loaded them")
    REQUIRED = Nudge(name, "required", "load {{skills}} before anything else")
    nudges = (UNLOADED, STALE, REQUIRED)
