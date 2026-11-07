from dataclasses import dataclass

from core.base.registry.setting_entry import SettingEntry


@dataclass(frozen=True)
class CurrentSetting:
    """A declared setting's value as it is read now, and where it came from: the environment, the project, its
    default, or a group above it that is switched off."""

    entry: SettingEntry
    value: object
    source: str
