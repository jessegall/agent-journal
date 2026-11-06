from collections.abc import Mapping
from dataclasses import dataclass

from core.base.model.event_form import EventForm
from core.base.model.table import indefinite_article

MODULE_NAME_PREFIX = "journal."
CHANGE_WORDS = {"create": "created", "update": "updated", "delete": "deleted"}
UNEVEN_PAST_WORDS = {"cut": "cut", "make": "made", "send": "sent", "stop": "stopped", "pin": "pinned", "set": "set", "run": "run", "begin": "begun", "plan": "planned"}
WAS_WORD = " was "
BEING_WORD = " being "


@dataclass(frozen=True)
class EventKeyEntry:
    """One event as a plugin names it: its key, its name in the log, the module that owns it, the forms a script may
    take for it, and plain words for it. The key is the module's name without journal., then the first part of the
    log name, then its second part with create, update and delete in the past."""

    key: str
    event: str
    module: str
    forms: tuple[EventForm, ...]
    description: str = ""

    @classmethod
    def built(cls, module: str, event: str, forms: tuple[EventForm, ...]) -> "EventKeyEntry":
        subject, _, change = event.partition(".")
        words = subject.replace("_", " ").replace("-", " ")
        description = f"{indefinite_article(words)} {words}{WAS_WORD}{cls.past_word(change)}"
        return cls(f"{module.removeprefix(MODULE_NAME_PREFIX)}.{subject}.{CHANGE_WORDS.get(change, change)}", event, module, forms, description)

    @classmethod
    def system(cls, module: str, event: str, forms: tuple[EventForm, ...]) -> "EventKeyEntry":
        subject, _, change = event.partition(".")
        entry = cls.built(module, event, forms)
        return cls(entry.key, event, module, forms, f"the {subject} is {change}" if change.endswith("ing") else f"the {subject} {change}")

    @classmethod
    def moment(cls, module: str, name: str) -> "EventKeyEntry":
        return cls(f"{module.removeprefix(MODULE_NAME_PREFIX)}.{name}", name, module, (EventForm.GUARD, EventForm.COMMIT), name.replace("_", " "))

    @classmethod
    def restored(cls, entry: Mapping[str, object]) -> "EventKeyEntry":
        return cls(str(entry["key"]), str(entry["event"]), str(entry["module"]), tuple(EventForm(str(form)) for form in entry["forms"]), str(entry.get("description", "")))

    @staticmethod
    def past_word(change: str) -> str:
        if change in CHANGE_WORDS:
            return CHANGE_WORDS[change]
        if change in UNEVEN_PAST_WORDS:
            return UNEVEN_PAST_WORDS[change]
        if change.endswith("ed"):
            return change
        return f"{change}d" if change.endswith("e") else f"{change}ed"

    def guard_words(self) -> str:
        return f"can stop {self.description.replace(WAS_WORD, BEING_WORD)}"
