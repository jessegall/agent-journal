from dataclasses import dataclass

from core.base.registry.setting_entry import SettingEntry
from core.base.setting.setting_value import SettingDefault


@dataclass(frozen=True)
class CurrentSetting:
    """A declared setting's value as it is read now, and where it came from: the environment, the project, its
    default, or a group above it that is switched off."""

    entry: SettingEntry
    value: SettingDefault
    source: str
