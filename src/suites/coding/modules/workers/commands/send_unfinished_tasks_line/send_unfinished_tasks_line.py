from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.nudge import Nudge
from core.modules.drivers.models.agent_line import AgentLine


@dataclass(frozen=True)
class SendUnfinishedTasksLine(Command[AgentLine]):
    """Gives a stopped worker that holds started work the line that tells it to go on, which resumes it."""

    worker_id: int
    line: Nudge
    source: str
