from collections.abc import Iterator, Sequence
from dataclasses import dataclass, field, replace
from typing import TYPE_CHECKING

from core.base.setting.setting_reference import SettingReference
from core.base.setting.setting_value import SettingValue

if TYPE_CHECKING:
    from core.base.module.setting_check import SettingCheck
    from core.base.registry.setting_entry import SettingEntry


@dataclass(frozen=True)
class SettingGroup:
    """A group of settings a module declares, holding values, other groups and references to groups other
    modules declare; a toggleable group can be switched off as a whole, which switches off every setting
    inside it, and is on or off by default as enabled says; a group with any_key also admits any key under
    it as a setting like that value, for keys made at run time, such as one per role or per window."""

    key: str
    title: str
    description: str
    children: Sequence["SettingGroup | SettingValue | SettingReference"] = field(default_factory=tuple)
    toggleable: bool = False
    enabled: bool = True
    any_key: SettingValue | None = None

    def declared(self, module_name: str, key: str, parent: str | None) -> Iterator["SettingEntry"]:
        from core.base.registry.setting_entry import ANY_KEY, GROUP_TYPE, SettingEntry
        from core.base.setting.setting_scope import SettingScope

        yield SettingEntry(key, module_name, parent, self.title, self.description, GROUP_TYPE, None, False, SettingScope.LAYERED.value, False, (), self.toggleable, self.enabled)
        for child in self.children:
            yield from child.declared(module_name, f"{key}.{child.key}", key)
        if self.any_key is not None:
            yield from replace(self.any_key, key=ANY_KEY).declared(module_name, f"{key}.{ANY_KEY}", key)

    def checked(self, check: "SettingCheck", key: str) -> Iterator[str]:
        return check.group_problems(self, key)
