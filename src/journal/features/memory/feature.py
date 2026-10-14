from journal.features.feature import Feature
from journal.features.memory.commands.fact_command import FactCommand
from journal.features.memory.commands.nothing_command import NothingCommand
from journal.features.memory.commands.reminder_command import ReminderCommand
from journal.features.memory.commands.rule_command import RuleCommand
from journal.features.memory.listeners.hold_at_mark import HoldAtMark
from journal.features.memory.states.at_mark import AtMark
from journal.features.nudge import Nudge
from journal.features.skill import Skill


class Memory(Feature):
    name = "memory"
    title = "Memory"
    help = "At 25, 50 and 80 percent of the context window, writes wait until the agent records a fact, a rule or nothing."
    states = (AtMark,)
    listeners = (HoldAtMark,)
    commands = (FactCommand, RuleCommand, ReminderCommand, NothingCommand)

    MARKS = (25, 50, 80)
    """Percent of the context window at which the agent is asked to decide what survives."""

    DECIDE = Nudge(name, "decide", "context {{percent}}% full: record what must survive it", "journal fact create \"<what is true here>\", journal rule create \"<Always/Never ...>\", or journal nothing \"<why>\"; writes wait until you do", repeat_after=0)
    HELD = Nudge(name, "held", "writes wait until you decide what survives the context", "journal fact create, journal rule create, or journal nothing \"<why>\"")
    RULE_REVIEW = Nudge(name, "rule_review", "is rule {{n}} a ruling for the whole project?", "keep it only as Always or Never for every environment; otherwise strike it and file a fact or a reminder here")
    nudges = (DECIDE, HELD, RULE_REVIEW)

    skill = Skill("memory", 'Decide what survives the context window: a fact, a rule or a reminder; load it at a context mark', """
# Memory

At a mark of the context window, writes wait until you decide what must survive it.

- A **fact** is true of this environment: `journal fact create "<what is true here>"`.
- A **rule** binds the whole project, worded as the ruling itself: `journal rule create "Always ..." --reason "<why>"`.
  Only the user makes one; right after, read it again as one.
- A **reminder** is what to keep doing here: `journal reminder create "<do this>"`.
- Nothing worth keeping: `journal nothing survives "<why>"`.
- Facts, rules and reminders are handed to you at every session start.
""", keywords=('fact', 'facts', 'rule', 'rules', 'reminder', 'remember', 'memory'), required_in=('at_mark',))
