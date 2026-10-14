from journal.features.briefing.states.catching_up import CatchingUp
from journal.features.feature import Feature
from journal.features.nudge import Nudge


class Briefing(Feature):
    name = "briefing"
    title = "Session briefing"
    states = (CatchingUp,)

    READY = Nudge(name, "ready", "the journal is ready on {{env}}: read the briefing before you write")
    RULES = Nudge(name, "rules", "{{count}} rules in force: {{rows}}")
    FACTS = Nudge(name, "facts", "facts about this environment: {{rows}}")
    REMINDERS = Nudge(name, "reminders", "reminders here: {{rows}}")
    SKILLS = Nudge(name, "skills", "load {{skills}} before anything else")
    nudges = (READY, RULES, FACTS, REMINDERS, SKILLS)
