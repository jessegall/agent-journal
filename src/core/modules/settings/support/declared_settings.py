from collections.abc import Iterator

from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.base.registry.setting_entry import GROUP_TYPE, SettingEntry


class DeclaredSettings:
    """The settings the installed modules declare, found by their full key, with the groups above each."""

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def entry(self, key: str) -> SettingEntry:
        for entry in self.registry.settings:
            if entry.key == key:
                return entry
        raise Refusal(f"no module declares the setting {key}", "journal setting tree lists every setting")

    def value(self, key: str) -> SettingEntry:
        entry = self.entry(key)
        if entry.type == GROUP_TYPE:
            raise Refusal(f"{key} is a group of settings", f"switch it with journal setting switch {key} on or off")
        return entry

    def groups_above(self, entry: SettingEntry) -> Iterator[SettingEntry]:
        parent = entry.parent
        while parent is not None:
            group = self.entry(parent)
            yield group
            parent = group.parent

    def all(self) -> tuple[SettingEntry, ...]:
        return self.registry.settings
