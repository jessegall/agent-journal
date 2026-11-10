from dataclasses import dataclass

from engine.enums.event_form import EventForm


CEILING_SETTING = "journal.core.plugins.hold_window_ms"


@dataclass(frozen=True)
class PluginEventEntry:
    """A named event subscription and its script."""

    event: str
    key: str
    form: EventForm
    script: str
