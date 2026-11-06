from dataclasses import dataclass

from core.modules.plugins.support.plugin_event_state import PluginEventState


@dataclass(frozen=True)
class PluginEventRow:
    """One line of what a plugin listens to: the key and form it names, its script, how it stands, what a renamed key
    is called now, when its script started if it is running, the journal's limit on it, if any, and when its script was last left out, and why."""

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
