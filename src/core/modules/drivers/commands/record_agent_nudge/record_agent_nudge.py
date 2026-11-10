from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.nudge import Nudge


@dataclass(frozen=True)
class RecordAgentNudge(Command[None]):
    lock = False

    agent_id: int
    nudge: Nudge
    source: str
