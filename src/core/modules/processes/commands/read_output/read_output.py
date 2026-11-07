from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.processes.commands.support.output_lines import OutputLines


@dataclass(frozen=True)
class ReadOutput(Command[OutputLines]):
    """Reads what a run printed in one way: summary, all, lines, tail or reader; the output counts as read."""

    process_id: int
    summary: bool = False
    all: bool = False
    lines: str = ""
    tail: int = 0
    reader: str = ""
    is_repeat_allowed: bool = False
    reader_process_id: int | None = None
    json_output: bool = False
