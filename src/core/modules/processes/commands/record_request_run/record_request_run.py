from dataclasses import dataclass

from engine.command.command import Command
from engine.enums.process_kind import ProcessKind
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class RecordRequestRun(Command[Process]):
    """Keeps the process row of a hook, journal command or viewer request as it comes in."""

    agent_id: int
    kind: ProcessKind
    line: str
