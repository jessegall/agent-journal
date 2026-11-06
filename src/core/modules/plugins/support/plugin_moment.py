from dataclasses import dataclass

from core.base.model.event_form import EventForm


CEILING_SETTING = "journal.core.plugins.hold_window_ms"


@dataclass(frozen=True)
class PluginMoment:
    """A listen entry on a key of a moment a plugin hears by name: the moment's name, its key, the form and the script."""

    event: str
    key: str
    form: EventForm
    script: str
