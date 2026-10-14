"""The moments of the rule resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events import Fact
from events.resources import ResourceEvent


@dataclass(frozen=True)
class RuleCreated(ResourceEvent):
    on: ClassVar[str] = "rule.created"


@dataclass(frozen=True)
class RuleUpdated(ResourceEvent):
    on: ClassVar[str] = "rule.updated"


@dataclass(frozen=True)
class RuleCompleted(ResourceEvent):
    on: ClassVar[str] = "rule.completed"


@dataclass(frozen=True)
class RuleChanged(ResourceEvent):
    on: ClassVar[str] = "rule"


@dataclass(frozen=True, kw_only=True)
class RulesToInject(Fact):
    """A rule changed while the rules feature is on, so the briefing files that carry the injected rules are written again."""


@dataclass(frozen=True, kw_only=True)
class RuleMentioned(Fact):
    """A word the rule is keyed to came up in what the agent did or wrote, so it is whispered to it."""

    agent: int
    n: int
    title: str


@dataclass(frozen=True, kw_only=True)
class RulesStanding(Fact):
    """The standing rules that bind the agent, to be read again as it works."""

    agent: int
    count: str
    rows: str
