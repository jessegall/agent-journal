from dataclasses import dataclass

from core.base.command.command import Command
from core.base.driver.nudge import Nudge


@dataclass(frozen=True)
class StartMerger(Command[None]):
    """Something waits for the merger: it is given the job, or the main agent hears when no merger can start."""

    lock = False

    fallback_line: str | Nudge
