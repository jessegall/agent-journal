from dataclasses import dataclass, field

from journal.events.event import Event


@dataclass(frozen=True, kw_only=True)
class PluginUpdated(Event):
    """The user changed a plugin's settings: told to that plugin alone, so it can apply them."""

    settings: dict = field(default_factory=dict)

    @property
    def key(self) -> str:
        return "plugin.updated"
