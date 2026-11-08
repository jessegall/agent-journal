from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class SendAgentMessage(Command[Message]):
    """Saves a private message from the caller to an agent and, unless it is only kept, gives that agent a
    line naming it, which wakes it when it is stopped; a helper job's report is recorded whatever it
    repeats, since it ends the job."""

    recipient_agent_id: int
    text: str
    notifies: bool = True
    ends_job: bool = False
