from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class RecordWorkerReport(Command[Message]):
    """Keeps what a worker said as it stopped with every task handed in, as a message of the worker in the chat
    and a line for its main agent."""

    agent_id: int
    environment_id: int
    main_agent_id: int
    text: str
