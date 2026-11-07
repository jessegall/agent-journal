from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class RecordParentReport(Command[Message]):
    """Saves an agent's report to its parent and ends the reported job."""

    agent_id: int
    parent_id: int
    text: str
    job_id: int | None = None
    notify_parent: bool = True
