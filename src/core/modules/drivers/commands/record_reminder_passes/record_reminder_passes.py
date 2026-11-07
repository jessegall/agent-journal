from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.drivers.models.reminder_pass import ReminderPass


@dataclass(frozen=True)
class RecordReminderPasses(Command[ReminderPass]):
    """Keeps how many times in a row an agent let a reminder pass for each thing it named; 0 starts that count again."""

    agent_id: int
    key: str
    counts: tuple[tuple[str, int], ...]
