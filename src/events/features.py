"""The moments of the feature resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class FeatureCreated(ResourceEvent):
    on: ClassVar[str] = "feature.created"


@dataclass(frozen=True)
class FeatureUpdated(ResourceEvent):
    on: ClassVar[str] = "feature.updated"


@dataclass(frozen=True)
class FeatureCompleted(ResourceEvent):
    on: ClassVar[str] = "feature.completed"
