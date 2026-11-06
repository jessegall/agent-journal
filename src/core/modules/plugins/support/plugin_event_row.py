from dataclasses import dataclass

from core.modules.plugins.support.plugin_event_state import PluginEventState


@dataclass(frozen=True)
class PluginEventRow:
    """One line of what a plugin listens to: the key and form it names, its script, how it stands, what a renamed key
    is called now, and when its script started if it is running."""

    id: str
    plugin: str
    key: str
    form: str
    script: str
    state: PluginEventState
    current_key: str = ""
    started_at: str = ""
