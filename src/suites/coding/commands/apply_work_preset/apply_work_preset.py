from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.support.work_settings import WorkSettings


@dataclass(frozen=True)
class ApplyWorkPreset(Command[WorkSettings]):
    """Writes every control of a named preset together, from the reading with the given revision."""

    name: str
    revision: str
