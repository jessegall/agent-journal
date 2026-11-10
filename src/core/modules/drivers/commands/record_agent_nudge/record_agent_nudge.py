from dataclasses import dataclass

from engine.command.command import Command
from core.base.driver.nudge import Nudge


@dataclass(frozen=True)
class RecordAgentNudge(Command[None]):
    lock = False

    agent_id: int
    nudge: Nudge
    source: str
