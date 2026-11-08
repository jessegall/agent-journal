from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.processes.models.reader_request import ReaderRequest


@dataclass(frozen=True)
class AskForReader(Command[ReaderRequest]):
    """A person asks the agent that ran a run, whose box is empty, to draw a reader for it."""

    process_id: int
