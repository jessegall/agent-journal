"""What the pull requests feature recognises: a pull request the agent opened, and one it merged or closed."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class PullRequestOpened(Fact):
    """A pull request the agent opened, with the link its command printed."""

    agent: int
    number: str
    url: str


@dataclass(frozen=True, kw_only=True)
class PullRequestEnded(Fact):
    """A pull request the agent merged or closed, whose pin is to be taken away."""

    agent: int
    notice: int
    how: str
