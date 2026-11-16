from collections.abc import Sequence

from engine.enums.access import Access
from engine.errors.refusal import Refusal
from engine.helper_type.helper_behaviours import HelperBehaviours
from engine.helper_type.helper_type_entry import HelperTypeEntry
from engine.helper_type.main_agent import MainAgent


MAIN_KEY = MainAgent.key
HELPER_KEY = "helper"
MAIN_TYPE = HelperTypeEntry(module="journal.core.agents", key=MAIN_KEY, label=MainAgent.label, access=Access.WRITING, separate_folder=False, behaviours=MainAgent.behaviours)


class HelperTypeBook:
    """Finds the helper types modules and suites registered, the main agent's type beside them, and answers which
    type extends which. Every registered kind is a helper; only the main agent is not."""

    def __init__(self, entries: Sequence[HelperTypeEntry] = ()) -> None:
        self.entries = {MAIN_KEY: MAIN_TYPE, **{entry.key: entry for entry in entries}}

    def is_helper(self, key: str) -> bool:
        return key in self.entries and key != MAIN_KEY

    def helper_keys(self) -> tuple[str, ...]:
        return tuple(entry.key for entry in self.startable())

    def read_access_keys(self) -> tuple[str, ...]:
        return self.keys_with(Access.READ)

    def find(self, key: str) -> HelperTypeEntry:
        if key not in self.entries:
            raise Refusal(f"{key} is no helper type: no installed module or suite registers it", "register it in a module's or suite's helper_types")
        return self.entries[key]

    def behaviours(self, key: str) -> HelperBehaviours:
        return self.entries[key].behaviours if key in self.entries else HelperBehaviours.retired()

    def takes_tasks(self, key: str) -> bool:
        return self.behaviours(key).takes_tasks

    # an agent of a type no installed module registers any more works in no folder of its own, as it does nothing
    def has_separate_folder(self, key: str) -> bool:
        return key in self.entries and self.entries[key].separate_folder

    def queue_limit_keys(self) -> tuple[str, ...]:
        return tuple(entry.queue_limit_key for entry in self.startable() if entry.queue_limit_key)

    def type_keys(self, key: str) -> tuple[str, ...]:
        return self.entries[key].type_keys() if key in self.entries else (key,)

    def label(self, key: str) -> str:
        return self.entries[key].label if key in self.entries else key.capitalize()

    def keys_with(self, access: Access) -> tuple[str, ...]:
        return tuple(entry.key for entry in self.startable() if entry.access is access)

    def extends(self, key: str, base: str) -> bool:
        return key in self.entries and base in self.entries and self.entries[key].extends(base)

    def startable(self) -> tuple[HelperTypeEntry, ...]:
        return tuple(entry for entry in self.entries.values() if entry.key != "main")
