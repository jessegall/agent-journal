from collections.abc import Sequence
from dataclasses import dataclass

from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.type_guards import is_text_list, is_tuple

SettingDefault = str | int | float | bool | tuple[str, ...] | None


@dataclass(frozen=True)
class SettingValue:
    """One setting a module declares: its short key, the title and one plain sentence the settings window shows,
    its type and default, whether it is a secret such as a token, where it may be set and whether an agent may set it."""

    key: str
    title: str
    description: str
    type: SettingType
    default: SettingDefault = None
    secret: bool = False
    scope: SettingScope = SettingScope.BOTH
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
