from dataclasses import dataclass

from engine.command.command import Command
from core.base.driver.nudge import Nudge


@dataclass(frozen=True)
class SendMergerReport(Command[None]):
    """Sends the main agent a message of the merger."""

    text: str | Nudge
