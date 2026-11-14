from collections.abc import Mapping, Sequence
from typing import ClassVar

from engine.setting.ruled_settings import ruled_settings
from engine.setting.setting_node import SettingNode
from engine.setting.setting_rule import SettingRule
from engine.setting.setting_value import SettingValue


class SettingList:
    """A list of settings a module declares, written as a class in its own file: its values, the groups beside them,
    and the rule each full key under the module's key names for a value."""

    module_key: ClassVar[str] = ""
    values: ClassVar[Sequence[SettingValue]] = []
    groups: ClassVar[Sequence[SettingNode]] = []
    rules: ClassVar[Mapping[str, SettingRule]] = {}

    @classmethod
    def nodes(cls) -> list[SettingNode]:
        return [*ruled_settings(cls.module_key, cls.values, cls.rules), *cls.groups]
