from dataclasses import dataclass


@dataclass(frozen=True)
class PluginSubscription:
    """A plugin's script for one form of one event."""

    plugin: str
    script: str
