from dataclasses import dataclass, field


@dataclass(frozen=True)
class PluginSubscription:
    """A plugin's script for one form of one event."""

    plugin: str
    script: str
    plugin_id: int = field(default=0, compare=False)
    allows_skip: bool = field(default=True, compare=False)
    limit_ms: int | None = field(default=None, compare=False)
