from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import Any

from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingDefault, SettingValue

GROUP_TYPE = "group"
ANY_KEY = "*"


@dataclass(frozen=True)
class SettingEntry:
    """A registered setting or setting group: its full key, the module that declares it and the group above it, its
    title and description, its type (group for a group), default, scope and choices, whether it is a secret
    (whose default is never kept) or a value an agent may set, and for a group whether it can be switched off."""

    key: str
    module: str
    parent: str | None
    title: str
    description: str
    type: str
    default: SettingDefault
    secret: bool
    scope: str
    agent_writable: bool
    choices: Sequence[str]
    toggleable: bool
    enabled: bool

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "SettingEntry":
        return cls(stored["key"], stored["module"], stored["parent"], stored["title"], stored["description"], stored["type"], stored["default"],
                   stored["secret"], stored["scope"], stored["agent_writable"], tuple(stored["choices"]), stored["toggleable"], stored["enabled"])

    def accepts(self, value: object) -> bool:
        if self.type == GROUP_TYPE:
            return isinstance(value, bool)
        return SettingValue(self.key, self.title, self.description, SettingType(self.type), choices=self.choices).accepts(value)
