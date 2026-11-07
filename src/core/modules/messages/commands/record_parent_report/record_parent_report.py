from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class RecordParentReport(Command[Message]):
    """Saves what an agent reports to the agent above it, ends the job it reports on, and tells the receiver if asked."""

    agent_id: int
    parent_id: int
    text: str
    job_id: int | None = None
    tells_receiver: bool = True
