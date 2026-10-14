"""What helper worktrees recognises: a call made in a helper's checkout while the working branch has moved on."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class WorktreeChecked(Fact):
    """The working branch was at this tip when a worktree was last measured against it."""

    n: int
    working_tip: str


@dataclass(frozen=True, kw_only=True)
class WorktreeBehind(Fact):
    """A worktree's branch lacks commits of the working branch, which its helper is told to rebase onto."""

    working: str
    commits: str
    path: str
