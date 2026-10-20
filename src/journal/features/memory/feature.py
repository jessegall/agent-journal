from journal.support.entry import Entry
from journal.features.feature import Feature
from journal.features.memory.commands.fact_command import FactCommand
from journal.features.memory.commands.nothing_command import NothingCommand
from journal.features.memory.commands.reminder_command import ReminderCommand
from journal.features.memory.commands.rule_command import RuleCommand
from journal.features.memory.listeners.hold_at_mark import HoldAtMark
from journal.features.memory.listeners.hold_writes_while_mark_owed import HoldWritesWhileMarkOwed
from journal.features.memory.listeners.mark_compacted import MarkCompacted
from journal.features.memory.listeners.mark_memory_row_made import MarkMemoryRowMade
from journal.features.memory.listeners.mark_memory_row_struck import MarkMemoryRowStruck
from journal.features.memory.listeners.keep_from_stopping_while_mark_owed import KeepFromStoppingWhileMarkOwed
from journal.features.memory.listeners.review_new_rule import ReviewNewRule
from journal.features.memory.listeners.whisper import Whisper
from journal.engine.nudge import Nudge
from journal.support.option import Option
from journal.models.node_kind import NodeKind
from journal.support.skill import Skill


ONCE = 365 * 86400.0
"""A whisper is said once per row per agent; in practice, not within a year."""


class Memory(Feature):
    name = "memory"
    title = "Memory"
    help = "At 25, 50 and 80 percent of the context window, writes wait until the agent records a fact, a rule or nothing."
    listeners = (HoldAtMark, HoldWritesWhileMarkOwed, KeepFromStoppingWhileMarkOwed, Whisper, ReviewNewRule, MarkCompacted, MarkMemoryRowMade, MarkMemoryRowStruck)
    checks = (
        Entry(NodeKind.CHECK, 'context_over_mark', 'Context reached the next mark?', "the agent's context window has crossed a mark, a quarter, a half or four fifths, that it has not been asked at yet"),
        Entry(NodeKind.CHECK, 'memory_older_than', 'Facts, rules or reminders N days old?', "a fact, rule or reminder here has stood at least N days; the text is N or a setting's name", takes_text=True),
        Entry(NodeKind.CHECK, 'context_over', 'Context over N percent?', "the agent's context window is fuller than N percent, as the event reports it; the text is N or a setting's name", takes_text=True),
        Entry(NodeKind.CHECK, 'mark_owed', 'Has a context mark still to record?', 'the agent crossed a context mark and has not yet decided what survives it: a fact, a rule or nothing'),
    )
    commands = (FactCommand, RuleCommand, ReminderCommand, NothingCommand)

    MARKS = (25, 50, 80)
    """Percent of the context window at which the agent is asked to decide what survives."""

    DECIDE_AT_THE_MARK = Nudge(name, "decide_at_the_mark", "context {{percent}}% full: decide what to keep from it", "`journal fact create \"<what is true here>\"`, `journal rule create \"<Always/Never ...>\"`, or `journal nothing \"<why>\"`; writes wait until you do", repeat_after=0)
    WRITE_HELD_UNTIL_DECIDED = Nudge(name, "write_held_until_decided", "writes wait until you decide what to keep from the context", "`journal fact create`, `journal rule create`, or `journal nothing \"<why>\"`")
    STOPPED_AT_MARK = Nudge(name, "stopped_at_mark", "you stopped while the journal awaits a decision at the context mark, {{percent}}% full", "`journal fact create`, `journal rule create`, or `journal nothing \"<why>\"` first, or `journal stuck \"<why>\"` if you are truly stuck", repeat_after=0)
    CHECK_STALE_MEMORY = Nudge(name, "check_stale_memory", "these are {{stale_after}} days old or more, check they still hold: {{stale}}", "strike what no longer holds (`journal fact strike <n>`), reword what drifted, and keep the rest", repeat_after=86400)
    STALE_AFTER = Option("memory.stale_after", "Ask about old facts after", "Days a fact, rule or reminder stands before the agent is asked at a session start whether it still holds", 7, unit="days")
    DOES_THE_RULE_APPLY_PROJECT_WIDE = Nudge(name, "does_the_rule_apply_project_wide", "does rule {{n}} apply to the whole project?", "keep it only as Always or Never for every environment; otherwise delete it and record a fact or a reminder here")
    MEMORY_WHISPERED_BACK = Nudge(name, "memory_whispered_back", "{{noun}} {{n}}: {{text}}", repeat_after=ONCE)
    nudges = (DECIDE_AT_THE_MARK, WRITE_HELD_UNTIL_DECIDED, STOPPED_AT_MARK, CHECK_STALE_MEMORY, DOES_THE_RULE_APPLY_PROJECT_WIDE, MEMORY_WHISPERED_BACK)
    options = (STALE_AFTER,)

    skill = Skill("memory", 'Decide what to keep from the context window: a fact, a rule or a reminder; load it at a context mark', """
# Memory

At a mark of the context window, writes wait until you decide what must survive it.

- A **fact** is true of this environment: `journal fact create "<what is true here>"`.
- A **rule** binds the whole project, worded as the ruling itself: `journal rule create "Always ..." --reason "<why>"`.
  Only the user makes one; right after, read it again as one.
- A **reminder** is what to keep doing here: `journal reminder create "<do this>"`.
- One that no longer holds: `journal <fact|rule|reminder> strike <n>`.
- Nothing worth keeping: `journal nothing survives "<why>"`.
- `--keywords a,b` on any of them: when you write or run one of those words, the row is whispered back to you.
- Facts, rules and reminders are handed to you at every session start.
""", keywords=('fact', 'facts', 'rule', 'rules', 'reminder', 'remember', 'memory'), required_in=('at_mark',))
