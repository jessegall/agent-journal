from journal.features.feature import Feature
from journal.features.nudge import Nudge


class Commands(Feature):
    name = "commands"
    title = "Long commands"

    HELD = Nudge(name, "held", "{{command}} has run for {{seconds}}s: it was moved to the background as run {{run}}")
    FORGOTTEN = Nudge(name, "forgotten", "run {{run}} finished {{minutes}} minutes ago and nothing read it")
    nudges = (HELD, FORGOTTEN)
