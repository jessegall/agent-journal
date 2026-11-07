from collections.abc import Sequence
from dataclasses import dataclass

from core.base.driver.reminder_declaration import ReminderDeclaration
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.drivers.commands.record_reminder_passes.record_reminder_passes import RecordReminderPasses
from core.modules.drivers.models.reminder_pass import ReminderPass


@dataclass(frozen=True)
class ReminderSubject:
    """One thing a reminder names, and when it last moved."""

    subject: str
    moved_at: Timestamp


@dataclass(frozen=True)
class ReminderRound:
    """The things a due reminder only tells the agent of, the things it now holds the agent for, and the counts to keep."""

    passing: tuple[str, ...]
    holding: tuple[str, ...]
    record: RecordReminderPasses


class ReminderPasses:
    """Counts the times in a row an agent let a repeating reminder pass for each thing it names; a thing that moved since
    the last count starts again at one."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def round(self, agent_id: int, reminder: ReminderDeclaration, due: Sequence[ReminderSubject]) -> ReminderRound:
        row = self.queries.query(ReminderPass).filter(session_agent_id=agent_id, key=reminder.key).first()
        counted = row.passes_by_subject() if row is not None else {}
        passing: list[str] = []
        holding: list[str] = []
        counts: list[tuple[str, int]] = []
        for item in due:
            previous = counted.get(item.subject)
            passes = 1 if previous is None or item.moved_at > previous[1] else previous[0] + 1
            held = passes > reminder.allowed_passes
            (holding if held else passing).append(item.subject)
            counts.append((item.subject, 0 if held else passes))
        return ReminderRound(tuple(passing), tuple(holding), RecordReminderPasses(agent_id, reminder.key, tuple(counts)))
