from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.models.watch import Watch


@dataclass(frozen=True)
class ConfirmOutput(Command[Watch]):
    """The caller says a run it waits on still does its work, which moves its next wake to the next step."""

    process_id: int
