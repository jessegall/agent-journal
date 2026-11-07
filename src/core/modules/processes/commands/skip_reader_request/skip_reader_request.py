from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.processes.models.reader_request import ReaderRequest


@dataclass(frozen=True)
class SkipReaderRequest(Command[ReaderRequest]):
    """Completes a reader request with a reason instead of a reader."""

    request_id: int
    reason: str
