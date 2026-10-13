"""What the worktrees feature recognises: an agent starting in a linked checkout."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class WorktreeToLink(Fact):
    """A session started in a linked checkout, which is to share the project's journal, skills and hooks."""

    agent: int
    top: str
