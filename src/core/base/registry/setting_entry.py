from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import Any

from core.base.setting.setting_declaration import GROUP_TYPE, SettingDefault
from core.base.setting.setting_rule_text import SettingRuleText
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue


@dataclass(frozen=True)
class SettingEntry:
    """A registered setting or setting group: its full key, the module that declares it and the group above
    it, its title and description, its type (group for a group), default, scope and choices, whether it is a
    secret (whose default is never kept) or a value an agent may set, for a group whether it can be switched
    off, for a reference the full key of the group it places here, and whether only a person may change it."""

    key: str
    module: str
    parent: str | None
    title: str
    description: str
    type: str
    default: SettingDefault
    secret: bool
    scope: str
    choices: Sequence[str]
    toggleable: bool
    enabled: bool
    target: str = ""
    person_set: bool = False
    rule: str = ""
    main_agent_only: bool = False

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "SettingEntry":
        return cls(stored["key"], stored["module"], stored["parent"], stored["title"], stored["description"], stored["type"], stored["default"],
                   stored["secret"], stored["scope"], tuple(stored["choices"]), stored["toggleable"], stored["enabled"], stored.get("target", ""), stored.get("person_set", False), stored.get("rule", ""), stored.get("main_agent_only", False))

    def problems(self, value: object) -> list[str]:
        return list(SettingRuleText().problems(self.rule, self.key, value))

    def accepts(self, value: object) -> bool:
        if self.type == GROUP_TYPE:
            return isinstance(value, bool)
        return SettingValue(self.key, self.title, self.description, SettingType(self.type), choices=self.choices).accepts(value)
