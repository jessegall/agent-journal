from dataclasses import dataclass

from core.base.model.event_form import EventForm


CEILING_SETTING = "journal.core.plugins.hold_window_ms"


@dataclass(frozen=True)
class PluginDeclaredEvent:
    """A named event subscription and its script."""

    event: str
    key: str
    form: EventForm
    script: str
