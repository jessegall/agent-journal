from journal.features.feature import Feature
from journal.features.memory.commands.fact_command import FactCommand
from journal.features.memory.commands.nothing_command import NothingCommand
from journal.features.memory.commands.reminder_command import ReminderCommand
from journal.features.memory.commands.rule_command import RuleCommand
from journal.features.memory.listeners.review_new_rule import ReviewNewRule
from journal.features.memory.listeners.whisper import Whisper
from journal.features.nudge import Nudge
from journal.features.skill import Skill


ONCE = 365 * 86400.0
"""A whisper is said once per row per agent; in practice, not within a year."""


class Memory(Feature):
    name = "memory"
    title = "Memory"
    help = "At 25, 50 and 80 percent of the context window, writes wait until the agent records a fact, a rule or nothing."
    listeners = (Whisper, ReviewNewRule)
    commands = (FactCommand, RuleCommand, ReminderCommand, NothingCommand)

    MARKS = (25, 50, 80)
    """Percent of the context window at which the agent is asked to decide what survives."""

    DECIDE = Nudge(name, "decide", "context {{percent}}% full: decide what to keep from it", "journal fact create \"<what is true here>\", journal rule create \"<Always/Never ...>\", or journal nothing \"<why>\"; writes wait until you do", repeat_after=0)
    HELD = Nudge(name, "held", "writes wait until you decide what to keep from the context", "journal fact create, journal rule create, or journal nothing \"<why>\"")
    RULE_REVIEW = Nudge(name, "rule_review", "does rule {{n}} apply to the whole project?", "keep it only as Always or Never for every environment; otherwise delete it and record a fact or a reminder here")
    WHISPER = Nudge(name, "whisper", "{{noun}} {{n}}: {{text}}", repeat_after=ONCE)
    nudges = (DECIDE, HELD, RULE_REVIEW, WHISPER)

    skill = Skill("memory", 'Decide what to keep from the context window: a fact, a rule or a reminder; load it at a context mark', """
# Memory

At a mark of the context window, writes wait until you decide what must survive it.

- A **fact** is true of this environment: `journal fact create "<what is true here>"`.
- A **rule** binds the whole project, worded as the ruling itself: `journal rule create "Always ..." --reason "<why>"`.
  Only the user makes one; right after, read it again as one.
- A **reminder** is what to keep doing here: `journal reminder create "<do this>"`.
- Nothing worth keeping: `journal nothing survives "<why>"`.
- `--keywords a,b` on any of them: when you write or run one of those words, the row is whispered back to you.
- Facts, rules and reminders are handed to you at every session start.
""", keywords=('fact', 'facts', 'rule', 'rules', 'reminder', 'remember', 'memory'), required_in=('at_mark',))
