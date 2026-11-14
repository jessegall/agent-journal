from dataclasses import dataclass

from engine.command.command import Command
from core.modules.agents.models.enums.stop_reason import StopReason
from core.modules.agents.models.enums.stopped import Stopped


@dataclass(frozen=True)
class StopAgentProgram(Command[Stopped]):
    """Stops the program of an agent and ends its row once the program is gone; the reason is who had it stopped.
    It takes no write lock while it waits for the program to go."""

    lock = False

    agent_id: int
    reason: StopReason
