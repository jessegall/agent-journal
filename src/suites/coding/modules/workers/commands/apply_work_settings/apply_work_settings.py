from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.support.work_settings import WorkSettings


@dataclass(frozen=True)
class ApplyWorkSettings(Command[WorkSettings]):
    """Changes workflow controls together, as pairs of key and text, from the reading with the given revision."""

    revision: str
    changes: tuple[tuple[str, str], ...]
