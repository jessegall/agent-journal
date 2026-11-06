from dataclasses import dataclass

from core.modules.plugins.support.plugin_event_state import PluginEventState


@dataclass(frozen=True)
class PluginEventRow:
    """A plugin subscription and its current status."""

    id: str
    plugin: str
    key: str
    form: str
    script: str
    state: PluginEventState
    current_key: str = ""
    started_at: str = ""
    limit_ms: int = 0
    last_skipped_at: str = ""
    skip_reason: str = ""
