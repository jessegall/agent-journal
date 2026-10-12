"""The moments of the plan resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class PlanCreated(ResourceEvent):
    on: ClassVar[str] = "plan.created"


@dataclass(frozen=True)
class PlanUpdated(ResourceEvent):
    on: ClassVar[str] = "plan.updated"


@dataclass(frozen=True)
class PlanCompleted(ResourceEvent):
    on: ClassVar[str] = "plan.completed"
