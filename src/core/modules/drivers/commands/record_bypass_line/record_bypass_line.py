from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.agent_line import AgentLine


@dataclass(frozen=True)
class RecordBypassLine(Command[AgentLine]):
    """Leaves the agent a line naming how many of its hooks went through unchecked."""

    lock = False

    agent_id: int
    count: int
