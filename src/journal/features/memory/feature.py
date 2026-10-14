from journal.features.feature import Feature
from journal.features.memory.states.at_mark import AtMark
from journal.features.nudge import Nudge


class Memory(Feature):
    name = "memory"
    title = "Memory"
    states = (AtMark,)

    DECIDE = Nudge(name, "decide", "context {{percent}}% full: record a fact, a rule or nothing", "journal fact create, journal rule create, or journal nothing \"<why>\"")
    MENTIONED = Nudge(name, "mentioned", "{{kind}} {{n}}: {{title}}")
    RULE_REVIEW = Nudge(name, "rule_review", "is rule {{n}} a ruling for the whole project?")
    REREAD = Nudge(name, "reread", "the reading pass over every rule and fact is owed")
    nudges = (DECIDE, MENTIONED, RULE_REVIEW, REREAD)
