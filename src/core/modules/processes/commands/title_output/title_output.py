from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.models.output import Output


@dataclass(frozen=True)
class TitleOutput(Command[Output]):
    """Names what a run does, for its card and its mark."""

    process_id: int
    title: str
