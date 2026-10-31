from collections.abc import Iterator, Sequence
from dataclasses import dataclass
from typing import TYPE_CHECKING

from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.type_guards import is_list, is_text_list, is_tuple

if TYPE_CHECKING:
    from core.base.module.setting_check import SettingCheck
    from core.base.registry.setting_entry import SettingEntry

SettingDefault = str | int | float | bool | tuple[str, ...] | tuple[int, ...] | None


@dataclass(frozen=True)
class SettingValue:
    """One setting a module declares: its short key, the title and one plain sentence the settings window
    shows, its type and default, whether it is a secret such as a token, where it may be set and whether an
    agent may set it."""

    key: str
    title: str
    description: str
    type: SettingType
    default: SettingDefault = None
    secret: bool = False
    scope: SettingScope = SettingScope.LAYERED
    agent_writable: bool = False
    choices: Sequence[str] = ()

    def accepts(self, value: object) -> bool:
        match self.type:
            case SettingType.TEXT:
                return isinstance(value, str)
            case SettingType.NUMBER:
                return isinstance(value, int | float) and not isinstance(value, bool)
            case SettingType.FLAG:
                return isinstance(value, bool)
            case SettingType.CHOICE:
                return isinstance(value, str) and value in self.choices
            case SettingType.LIST:
                return is_text_list(list(value) if is_tuple(value) else value)
            case SettingType.ANY:
                return True
            case SettingType.NUMBER_LIST:
                items = list(value) if is_tuple(value) else value
                return is_list(items) and all(isinstance(item, int) and not isinstance(item, bool) for item in items)

    def declared(self, module_name: str, key: str, parent: str | None) -> Iterator["SettingEntry"]:
        from core.base.registry.setting_entry import SettingEntry

        yield SettingEntry(key, module_name, parent, self.title, self.description, self.type.value, None if self.secret else self.default, self.secret,
                           self.scope.value, self.agent_writable, tuple(self.choices), False, True)

    def checked(self, check: "SettingCheck", key: str) -> Iterator[str]:
        return check.value_problems(self, key)
