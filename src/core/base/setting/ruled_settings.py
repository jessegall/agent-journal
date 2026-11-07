from collections.abc import Mapping, Sequence
from dataclasses import replace

from core.base.setting.setting_rule import SettingRule
from core.base.setting.setting_value import SettingValue


def ruled_settings(module_key: str, values: Sequence[SettingValue], rules: Mapping[str, SettingRule]) -> list[SettingValue]:
    return [replace(value, rule=rules.get(f"{module_key}.{value.key}", value.rule)) for value in values]
