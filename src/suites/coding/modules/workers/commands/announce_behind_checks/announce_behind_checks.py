from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.agent_message import AgentMessage


@dataclass(frozen=True)
class AnnounceBehindChecks(Command[tuple[AgentMessage, ...]]):
    """Leaves the merger a line for each worktree one look found behind its base, and answers the lines."""

    worktree_ids: tuple[int, ...]
