from collections.abc import Mapping
from dataclasses import dataclass

from core.base.change.event_form import EventForm

MODULE_NAME_PREFIX = "journal."
PAST_CHANGES = {"create": "created", "update": "updated", "delete": "deleted"}


@dataclass(frozen=True)
class EventKeyEntry:
    """One event as a plugin names it: its key, its name in the log, the module that owns it, and the forms a script
    may take for it."""

    key: str
    event: str
    module: str
    forms: tuple[EventForm, ...]

    @classmethod
    def named(cls, module: str, event: str, forms: tuple[EventForm, ...]) -> "EventKeyEntry":
        """The key is the module's name without journal., then the first part of the log name, then its second part
        with create, update and delete in the past."""
        subject, _, change = event.partition(".")
        return cls(f"{module.removeprefix(MODULE_NAME_PREFIX)}.{subject}.{PAST_CHANGES.get(change, change)}", event, module, forms)

    @classmethod
    def restored(cls, entry: Mapping[str, object]) -> "EventKeyEntry":
        return cls(str(entry["key"]), str(entry["event"]), str(entry["module"]), tuple(EventForm(str(form)) for form in entry["forms"]))
