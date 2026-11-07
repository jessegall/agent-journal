from collections.abc import Sequence

from core.base.driver.reminder_declaration import ReminderDeclaration
from core.base.query.queries import Queries
from core.modules.drivers.commands.record_reminder_passes.record_reminder_passes import RecordReminderPasses
from core.modules.drivers.models.reminder_pass import ReminderPass
from core.modules.drivers.support.reminder_round import ReminderRound
from core.modules.drivers.support.reminder_subject import ReminderSubject


class ReminderPasses:
    """Counts the times in a row an agent let a repeating reminder pass for each thing it names; a thing that
    moved since the last count starts again at one."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def round(self, agent_id: int, reminder: ReminderDeclaration, due: Sequence[ReminderSubject]) -> ReminderRound:
        row = self.queries.query(ReminderPass).filter(session_agent_id=agent_id, key=reminder.key).first()
        earlier = row.subject_counts() if row is not None else {}
        reminded: list[str] = []
        blocking: list[str] = []
        counts: list[tuple[str, int]] = []
        for item in due:
            last = earlier.get(item.subject)
            passes = 1 if last is None or item.moved_at > last[1] else last[0] + 1
            exceeded = passes > reminder.allowed_passes
            (blocking if exceeded else reminded).append(item.subject)
            counts.append((item.subject, 0 if exceeded else passes))
        return ReminderRound(tuple(reminded), tuple(blocking), RecordReminderPasses(agent_id, reminder.key, tuple(counts)))
