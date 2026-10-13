"""The moments of the plugin resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events import Fact
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


@dataclass(frozen=True, kw_only=True)
class PluginRemoved(Fact):
    """The last plugin of a name was removed, so what it left is to go: its services, its skills, its rows and its folder."""

    plugin: int


@dataclass(frozen=True, kw_only=True)
class PluginManifestChanged(Fact):
    """A linked plugin's manifest changed on disk since it was last read."""

    plugin: int


@dataclass(frozen=True, kw_only=True)
class PluginsWorthOffering(Fact):
    """An agent has worked long enough in a project whose offers are stale or undecided, so plugins that fit it are to be looked for."""

    agent: int
