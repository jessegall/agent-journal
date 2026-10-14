"""What the git actions feature recognises: a checkout on another branch, and a git command that changed something."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class BranchNoted(Fact):
    """The branch a checkout was first seen on, which is only noted."""

    agent: int
    checkout: str
    branch: str


@dataclass(frozen=True, kw_only=True)
class BranchSwitched(Fact):
    """A checkout that is on another branch than it was, or a linked one first seen, to be marked in the chat."""

    agent: int
    checkout: str
    branch: str
    label: str


@dataclass(frozen=True, kw_only=True)
class GitActionDone(Fact):
    """A git command the agent ran that changed something, in the words the chat marks it with."""

    agent: int
    label: str
