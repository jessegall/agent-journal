from collections.abc import Mapping
from dataclasses import dataclass

from core.base.checkout import Checkout
from core.base.timestamp import Timestamp
from core.modules.plugins.support.plugin_event import PluginEvent
from core.modules.plugins.support.plugin_manifest import PluginManifest


@dataclass(frozen=True)
class PluginCall:
    """One run of a plugin's program: the plugin's manifest, the event, the environment and time it came from,
    the settings the program reads, the agent it came from, which the plugin writes back on what it
    queues, and for an event about a file the checkout that holds the file, which may not be the agent's own."""

    manifest: PluginManifest
    event: PluginEvent
    environment: str
    timestamp: Timestamp
    settings: Mapping[str, object]
    agent_id: int | None = None
    file_checkout: Checkout | None = None
