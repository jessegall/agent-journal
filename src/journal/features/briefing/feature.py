from journal.features.briefing.listeners.brief_at_start import BriefAtStart
from journal.features.feature import Feature
from journal.features.nudge import Nudge


class Briefing(Feature):
    name = "briefing"
    title = "Session briefing"
    listeners = (BriefAtStart,)

    READY = Nudge(name, "ready", "the journal is ready on {{env}}", repeat_after=0)
    RULES = Nudge(name, "rules", "{{count}} rules in force: {{rows}}", repeat_after=0)
    FACTS = Nudge(name, "facts", "facts about this environment: {{rows}}", repeat_after=0)
    REMINDERS = Nudge(name, "reminders", "reminders here: {{rows}}", repeat_after=0)
    nudges = (READY, RULES, FACTS, REMINDERS)
