from collections.abc import Iterator, Sequence
from dataclasses import dataclass

from core.base.setting.setting_declaration import REFERENCE_TYPE, SettingDeclaration, SettingNode
from core.base.setting.setting_scope import SettingScope


@dataclass(frozen=True)
class SettingReference:
    """Places a setting group another module declares in this module's tree, by the group's full key: the group keeps
    its one key and its one value, and the tree shows it here as well as in its own module."""

    group: str

    @property
    def key(self) -> str:
        return self.group.rsplit(".", 1)[-1]

    def declaration(self) -> SettingDeclaration:
        return SettingDeclaration(self.key, self.group, REFERENCE_TYPE, None, False, SettingScope.LAYERED.value, False, (), False, True, self.group)

    def members(self) -> Sequence[SettingNode]:
        return ()

    def problems(self, key: str) -> Iterator[str]:
        return iter(())
