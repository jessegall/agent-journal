from dataclasses import dataclass

from core.base.command.command import Command
from core.base.driver.nudge import Nudge
from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class StartMerger(Command[None]):
    """Something waits for the merger: it is given the job, or the main agent hears when no merger can start.
    With since set, the main agent is told once from that moment, however many times the job is tried again."""

    lock = False

    fallback_line: str | Nudge
    started_at: Timestamp | None = None
