from collections.abc import Sequence

from engine.enums.access import Access
from engine.errors.refusal import Refusal
from core.base.registry.helper_type_entry import HelperTypeEntry


MAIN_KEY = "main"
HELPER_KEY = "helper"
MAIN_TYPE = HelperTypeEntry(module="journal.core.agents", key=MAIN_KEY, label="Main agent", access=Access.WRITING, separate_folder=False)


class HelperTypeBook:
    """Finds the helper types modules and suites registered, the main agent's type beside them, and follows their
    inheritance. Every registered kind is a helper; only the main agent is not."""

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

    def label(self, key: str) -> str:
        return self.entries[key].label if key in self.entries else key.capitalize()

    def keys_with(self, access: Access) -> tuple[str, ...]:
        return tuple(entry.key for entry in self.startable() if entry.access is access)

    def extends(self, key: str, base: str) -> bool:
        return base in self.entries and base in self.type_chain(key)

    def type_chain(self, key: str) -> tuple[str, ...]:
        chain: list[str] = []
        visited: set[str] = set()
        while key:
            chain.append(key)
            if key in visited or key not in self.entries:
                break
            visited.add(key)
            key = self.entries[key].extends
        return tuple(chain)

    def startable(self) -> tuple[HelperTypeEntry, ...]:
        return tuple(entry for entry in self.entries.values() if entry.key != "main")
