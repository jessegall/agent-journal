from collections.abc import Sequence
from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.support.request_log_entry import RequestLogEntry


@dataclass(frozen=True)
class RecordRequestRuns(Command[None]):
    """Writes the rows of the journal commands and viewer requests of one environment that the request log held,
    and prunes the oldest rows past the newest kept."""

    entries: Sequence[RequestLogEntry]
