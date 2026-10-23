from journal.features.feature import Feature
from journal.features.memory.listeners.start_memory import StartMemory
from journal.features.memory.listeners.memory_hint_card import MemoryHintCard
from journal.features.memory.listeners.context_threshold_check import ContextThresholdCheck
from journal.features.memory.memory_conduct import MemoryConduct
from journal.features.memory.support.memory_data_reader import MemoryDataReader
from journal.features.memory.support.memory_data import MemoryData
from journal.features.memory.commands.fact_command import FactCommand
from journal.features.memory.commands.memory_skip_command import MemorySkipCommand
from journal.features.memory.commands.reminder_command import ReminderCommand
from journal.features.memory.commands.rule_command import RuleCommand
from journal.features.memory.listeners.compaction_card import CompactionCard
from journal.features.memory.listeners.memory_row_card import MemoryRowCard
from journal.features.memory.listeners.memory_strike_card import MemoryStrikeCard
from journal.features.memory.listeners.due_reminder_strike import DueReminderStrike
from journal.engine.nudge import Nudge
from journal.support.option import Option
from journal.support.skill import Skill


YEAR_SECONDS = 365 * 86400.0


class Memory(Feature[MemoryData]):
    CONTEXT_THRESHOLDS = (25, 50, 80)
    STALENESS_LIMIT = Option("memory.stale_after", "Ask about old facts after", "Days a fact, rule or reminder stands before the agent is asked at a session start whether it still holds", 7, unit="days")
    name = "memory"
    title = "Memory"
    help = "At 25, 50 and 80 percent of the context window, writes wait until the agent records a fact, a rule or nothing."
    conduct = (MemoryConduct,)
    listeners = (ContextThresholdCheck, MemoryHintCard, CompactionCard, MemoryRowCard, MemoryStrikeCard, StartMemory, DueReminderStrike)
    data = (MemoryDataReader,)
    commands = (FactCommand, RuleCommand, ReminderCommand, MemorySkipCommand)


    CONTEXT_DECISION = Nudge(name, "decide_at_the_mark", "context {{percent}}% full: decide what to keep from it", "`journal fact create \"<what is true here>\"`, `journal rule create \"<Always/Never ...>\"`, or `journal memory skip \"<why>\"`; writes wait until you do", repeat_interval=0)
    DECISION_EDIT_BLOCK = Nudge(name, "write_held_until_decided", "writes wait until you decide what to keep from the context", "`journal fact create`, `journal rule create`, or `journal memory skip \"<why>\"`")
    UNDECIDED_STOP = Nudge(name, "stopped_at_mark", "you stopped while the journal awaits a decision at the context mark, {{percent}}% full", "`journal fact create`, `journal rule create`, or `journal memory skip \"<why>\"` first, or `journal stuck \"<why>\"` if you are truly stuck", repeat_interval=0)
    CHECK_STALE_MEMORY = Nudge(name, "check_stale_memory", "these are {{stale_after}} days old or more, check they still hold: {{stale}}", "strike what no longer holds (`journal fact strike <n>`), reword what drifted, and keep the rest", repeat_interval=86400)
    RULE_SCOPE_QUESTION = Nudge(name, "does_the_rule_apply_project_wide", "does rule {{n}} apply to the whole project?", "keep it only as Always or Never for every environment; otherwise delete it and record a fact or a reminder here")
    REMINDER_DUE = Nudge(name, "reminder_due", "reminder {{n}} is due: {{text}}", "it is struck now that you are told: act on it", repeat_interval=YEAR_SECONDS)
    MEMORY_READ_REQUEST = Nudge(name, "memory_whispered_back", "{{noun}} {{n}} is about this and not in your context: journal {{noun}} read {{n}}", repeat_interval=YEAR_SECONDS)
    nudges = (CONTEXT_DECISION, DECISION_EDIT_BLOCK, UNDECIDED_STOP, CHECK_STALE_MEMORY, RULE_SCOPE_QUESTION, MEMORY_READ_REQUEST, REMINDER_DUE)
    options = (STALENESS_LIMIT,)

    skill = Skill("memory", 'Decide what to keep from the context window: a fact, a rule or a reminder; load it at a context mark', """
# Memory

At a mark of the context window, writes wait until you decide what must survive it.

- A **fact** is true of this environment: `journal fact create "<what is true here>"`.
- A **rule** binds the whole project, worded as the ruling itself: `journal rule create "Always ..." --reason "<why>"`.
  Only the user makes one; right after, read it again as one.
- A **reminder** is what to keep doing here: `journal reminder create "<do this>"`.
  With `--at "2026-10-24 09:30"` it is set for that moment instead: quiet until then, told once then, and struck.
- One that no longer holds: `journal <fact|rule|reminder> strike <n>`.
- Nothing worth keeping: `journal memory skip "<why>"`.
- `--keywords a,b` on any of them: when you write or run one of those words and the row is not in your context
  window, you are told to read it, `journal reminder read <n>`, `journal fact read <n>` or `journal rule read <n>`; the
  read puts it in your context, and so do the session's start block and the look, until the next compaction.
- Facts, rules and reminders are handed to you at every session start.
""", keywords=('fact', 'facts', 'rule', 'rules', 'reminder', 'remember', 'memory'), required_states=('at_mark',))

    @classmethod
    def threshold_due(cls, context: float, highest: int) -> int:
        return max([threshold for threshold in cls.CONTEXT_THRESHOLDS if context * 100 >= threshold > highest], default=0)
