from journal.features.feature import Feature
from journal.features.nudge import Nudge


class Triggers(Feature):
    name = "triggers"
    title = "Triggers"

    NUDGE = Nudge(name, "nudge", "{{title}}")
    INSTRUCT = Nudge(name, "instruct", "do this now: {{title}}")
    HELD = Nudge(name, "held", "{{title}}: {{text}}")
    DENIED = Nudge(name, "denied", "your message used words a trigger denies: {{title}}")
    nudges = (NUDGE, INSTRUCT, HELD, DENIED)
