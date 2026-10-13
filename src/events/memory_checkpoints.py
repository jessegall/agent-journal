"""What memory checkpoints recognises: a context mark the agent has not yet decided, the decision, and what the agent wrote down."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class ContextMarkReached(Fact):
    """The agent's context filled to this percent and it has not yet decided what to keep."""

    agent: int
    percent: int


@dataclass(frozen=True, kw_only=True)
class ContextDecided(Fact):
    """The agent decided at its context mark, by writing a fact or a rule or saying nothing is worth keeping."""

    agent: int


@dataclass(frozen=True, kw_only=True)
class AgentKeptSomething(Fact):
    """The agent wrote a fact, a rule or a reminder, which the chat marks with this card."""

    agent: int
    label: str
    icon: str
    detail: str
    ref: str
