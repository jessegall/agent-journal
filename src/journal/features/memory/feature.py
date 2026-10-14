from journal.features.feature import Feature
from journal.features.memory.commands.fact_command import FactCommand
from journal.features.memory.commands.nothing_command import NothingCommand
from journal.features.memory.commands.reminder_command import ReminderCommand
from journal.features.memory.commands.rule_command import RuleCommand
from journal.features.memory.listeners.hold_at_mark import HoldAtMark
from journal.features.memory.states.at_mark import AtMark
from journal.features.nudge import Nudge


class Memory(Feature):
    name = "memory"
    title = "Memory"
    states = (AtMark,)
    listeners = (HoldAtMark,)
    commands = (FactCommand, RuleCommand, ReminderCommand, NothingCommand)

    MARKS = (25, 50, 80)
    """Percent of the context window at which the agent is asked to decide what survives."""

    DECIDE = Nudge(name, "decide", "context {{percent}}% full: record what must survive it", "journal fact create \"<what is true here>\", journal rule create \"<Always/Never ...>\", or journal nothing \"<why>\"; writes wait until you do", repeat_after=0)
    HELD = Nudge(name, "held", "writes wait until you decide what survives the context", "journal fact create, journal rule create, or journal nothing \"<why>\"")
    RULE_REVIEW = Nudge(name, "rule_review", "is rule {{n}} a ruling for the whole project?", "keep it only as Always or Never for every environment; otherwise strike it and file a fact or a reminder here")
    nudges = (DECIDE, HELD, RULE_REVIEW)
