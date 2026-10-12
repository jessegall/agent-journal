"""The moments of the template resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class TemplateCreated(ResourceEvent):
    on: ClassVar[str] = "template.created"


@dataclass(frozen=True)
class TemplateUpdated(ResourceEvent):
    on: ClassVar[str] = "template.updated"


@dataclass(frozen=True)
class TemplateCompleted(ResourceEvent):
    on: ClassVar[str] = "template.completed"
