from collections.abc import Iterator
from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from core.base.module.setting_check import SettingCheck
    from core.base.registry.setting_entry import SettingEntry


@dataclass(frozen=True)
class SettingReference:
    """Places a setting group another module declares in this module's tree, by the group's full key: the group keeps
    its one key and its one value, and the tree shows it here as well as in its own module."""

    group: str

    @property
    def key(self) -> str:
        return self.group.rsplit(".", 1)[-1]

    def declared(self, module_name: str, key: str, parent: str | None) -> Iterator["SettingEntry"]:
        from core.base.registry.setting_entry import REFERENCE_TYPE, SettingEntry
        from core.base.setting.setting_scope import SettingScope

        yield SettingEntry(key, module_name, parent, self.key, self.group, REFERENCE_TYPE, None, False, SettingScope.LAYERED.value, False, (), False, True, self.group)

    def checked(self, check: "SettingCheck", key: str) -> Iterator[str]:
        return iter(())
