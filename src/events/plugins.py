"""The moments of the plugin resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class PluginCreated(ResourceEvent):
    on: ClassVar[str] = "plugin.created"


@dataclass(frozen=True)
class PluginUpdated(ResourceEvent):
    on: ClassVar[str] = "plugin.updated"


@dataclass(frozen=True)
class PluginCompleted(ResourceEvent):
    on: ClassVar[str] = "plugin.completed"
