from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class RecordWorkerReport(Command[Message]):
    """Saves a worker's report and gives its main agent the message number."""

    agent_id: int
    main_agent_id: int
    text: str
