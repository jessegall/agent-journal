"""What organization recognises: a to-do of a role that closed, which lets the next one waiting for its role begin and the role's agent end."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class RoleTodoToStart(Fact):
    """A to-do waited for the one that closed, in this environment, and may begin: the role's agent is started for it with these words."""

    environment: str
    n: int
    task: str
    role: str
    title: str
    cardinality: str
    runs: str


@dataclass(frozen=True, kw_only=True)
class RoleAgentToStop(Fact):
    """A to-do's agent has nothing left to do for the role: the one running in this environment ends."""

    environment: str
