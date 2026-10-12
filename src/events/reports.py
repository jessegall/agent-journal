"""The moments of the report resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class ReportCreated(ResourceEvent):
    on: ClassVar[str] = "report.created"


@dataclass(frozen=True)
class ReportUpdated(ResourceEvent):
    on: ClassVar[str] = "report.updated"


@dataclass(frozen=True)
class ReportCompleted(ResourceEvent):
    on: ClassVar[str] = "report.completed"


@dataclass(frozen=True)
class ReportLinked(ResourceEvent):
    on: ClassVar[str] = "report.linked"
    to: str = ""
