from dataclasses import dataclass

from engine.command.command import Command
from engine.enums.process_type import ProcessType
from core.modules.processes.models.request_run import RequestRun


@dataclass(frozen=True)
class RecordRequestRun(Command[RequestRun]):
    """Keeps the row of a hook, journal command, viewer request or run of the journal's own, once it ended."""

    agent_id: int
    process_type: ProcessType
    line: str
    exit_code: int
