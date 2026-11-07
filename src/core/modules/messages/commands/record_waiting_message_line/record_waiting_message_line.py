from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.drivers.models.agent_line import AgentLine


@dataclass(frozen=True)
class RecordWaitingMessageLine(Command[AgentLine | None]):
    """Tells the environment's idle main agent of the first message waiting for it."""

    agent_id: int | None = None
