"""The moments of the rule resource type."""

from dataclasses import dataclass
from typing import ClassVar

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
