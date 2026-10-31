from collections.abc import Iterator, Sequence
from dataclasses import dataclass, field, replace

from core.base.setting.setting_declaration import ANY_KEY, GROUP_TYPE, SettingDeclaration, SettingNode
from core.base.setting.setting_limits import length_problems
from core.base.setting.setting_reference import SettingReference
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_value import SettingValue


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

    def declaration(self) -> SettingDeclaration:
        return SettingDeclaration(self.title, self.description, GROUP_TYPE, None, False, SettingScope.LAYERED.value, False, (), self.toggleable, self.enabled)

    def members(self) -> Sequence[SettingNode]:
        any_key = [] if self.any_key is None else [replace(self.any_key, key=ANY_KEY)]
        return [*self.children, *any_key]

    def problems(self, key: str) -> Iterator[str]:
        yield from length_problems(self.title, self.description, key)
        if not self.children and self.any_key is None:
            yield f"the setting group {key} holds no setting"
        for child in self.children:
            yield from child.problems(f"{key}.{child.key}")
