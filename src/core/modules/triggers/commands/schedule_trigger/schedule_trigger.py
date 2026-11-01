from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.triggers.models.trigger import Trigger


@dataclass(frozen=True)
class ScheduleTrigger(Command[Trigger]):
    """Writes a trigger that gives its text at a time, every so many minutes or by a cron line, up to an end or a
    number of times."""

    text: str
    start_text: str = ""
    interval_minutes: int | None = None
    cron_line: str = ""
    end_text: str = ""
    limit: int | None = None
