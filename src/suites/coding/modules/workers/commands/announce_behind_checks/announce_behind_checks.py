from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.nudge import Nudge


@dataclass(frozen=True)
class AnnounceBehindChecks(Command[tuple[Nudge, ...]]):
    """Leaves the merger a line for each worktree one look found behind its base, and answers the lines."""

    worktree_ids: tuple[int, ...]
