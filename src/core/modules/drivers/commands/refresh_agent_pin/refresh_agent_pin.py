from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.agent_stack import AgentStack


@dataclass(frozen=True)
class RefreshAgentPin(Command[AgentStack]):
    """Pins one agent to the parts of the new driver that are live in its environment now."""

    agent_id: int
