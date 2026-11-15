from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class ClaimProcess(Command[Process]):
    """The runner claims a prepared run with its token before its shell starts, once (doc 1310 section 6.7)."""

    process_id: int
    token: str
