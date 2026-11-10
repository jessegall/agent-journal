from collections.abc import Mapping
from dataclasses import dataclass

from engine.enums.event_form import EventForm
from engine.model.table import indefinite_article
from engine.types.type_guards import is_list

MODULE_NAME_PREFIX = "journal."
CHANGE_EVENT_SUFFIXES = {"create": "created", "update": "updated", "delete": "deleted"}
IRREGULAR_EVENT_SUFFIXES = {"cut": "cut", "make": "made", "send": "sent", "stop": "stopped", "pin": "pinned", "set": "set", "run": "run", "begin": "begun", "plan": "planned"}
SUFFIX_SEPARATOR = " was "
PROGRESS_SEPARATOR = " being "


@dataclass(frozen=True)
class EventKeyEntry:
    """An event key and the forms and description shown to plugins."""

    key: str
    event: str
    module: str
    forms: tuple[EventForm, ...]
    description: str = ""

    @classmethod
    def built(cls, module: str, event: str, forms: tuple[EventForm, ...]) -> "EventKeyEntry":
        subject, _, change = event.partition(".")
        subject_text = subject.replace("_", " ").replace("-", " ")
        event_text = f": {change.replace('_', ' ')}" if "_" in change else f"{SUFFIX_SEPARATOR}{cls.past_tense(change)}"
        description = f"{indefinite_article(subject_text)} {subject_text}{event_text}"
        return cls(f"{module.removeprefix(MODULE_NAME_PREFIX)}.{subject}.{CHANGE_EVENT_SUFFIXES.get(change, change)}", event, module, forms, description)

    @classmethod
    def system(cls, module: str, event: str, forms: tuple[EventForm, ...]) -> "EventKeyEntry":
        subject, _, change = event.partition(".")
        entry = cls.built(module, event, forms)
        return cls(entry.key, event, module, forms, f"the {subject} is {change}" if change.endswith("ing") else f"the {subject} {change}")

    @classmethod
    def plugin_event(cls, module: str, name: str) -> "EventKeyEntry":
        return cls(f"{module.removeprefix(MODULE_NAME_PREFIX)}.{name}", name, module, (EventForm.GUARD, EventForm.COMMIT), name.replace("_", " "))

    @classmethod
    def restored(cls, entry: Mapping[str, object]) -> "EventKeyEntry":
        forms = entry["forms"]
        if not is_list(forms):
            raise TypeError(f"the forms of an event key are a list, not {forms!r}")
        return cls(str(entry["key"]), str(entry["event"]), str(entry["module"]), tuple(EventForm(str(form)) for form in forms), str(entry.get("description", "")))

    @staticmethod
    def past_tense(change: str) -> str:
        if change in CHANGE_EVENT_SUFFIXES:
            return CHANGE_EVENT_SUFFIXES[change]
        if change in IRREGULAR_EVENT_SUFFIXES:
            return IRREGULAR_EVENT_SUFFIXES[change]
        if change.endswith("ed"):
            return change
        return f"{change}d" if change.endswith("e") else f"{change}ed"

    def guard_words(self) -> str:
        return f"can stop {self.description.replace(SUFFIX_SEPARATOR, PROGRESS_SEPARATOR)}"
