from collections.abc import Iterator
from dataclasses import replace

from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.base.registry.setting_entry import SettingEntry
from core.base.setting.setting_declaration import ANY_KEY, GROUP_TYPE, REFERENCE_TYPE


class SettingCatalogue:
    """The settings the installed modules declare, found by their full key or by the key of a place a group is placed
    at, with the groups above each."""

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def entry(self, key: str) -> SettingEntry:
        for entry in self.registry.settings:
            if entry.key == key and entry.type != REFERENCE_TYPE:
                return entry
        for entry in self.registry.settings:
            if entry.type == REFERENCE_TYPE and (key == entry.key or key.startswith(f"{entry.key}.")):
                return self.entry(f"{entry.target}{key.removeprefix(entry.key)}")
        for entry in self.registry.settings:
            group = entry.key.removesuffix(f".{ANY_KEY}")
            if entry.key.endswith(f".{ANY_KEY}") and key.startswith(f"{group}."):
                return replace(entry, key=key)
        raise Refusal(f"no module declares the setting {key}", "journal setting tree lists every setting")

    def value(self, key: str) -> SettingEntry:
        entry = self.entry(key)
        if entry.type == GROUP_TYPE:
            raise Refusal(f"{key} is a group of settings", f"switch it with journal setting switch {key} on or off")
        return entry

    def enclosing_groups(self, entry: SettingEntry) -> Iterator[SettingEntry]:
        parent = entry.parent
        while parent is not None:
            group = self.entry(parent)
            yield group
            parent = group.parent

    def all(self) -> tuple[SettingEntry, ...]:
        return self.registry.settings

    def children(self, key: str) -> list[SettingEntry]:
        return [entry for entry in self.registry.settings if entry.parent == key]
