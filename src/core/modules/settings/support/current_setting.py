from dataclasses import dataclass

from engine.registry.setting_entry import SettingEntry
from core.modules.settings.support.current_value import CurrentValue


@dataclass(frozen=True)
class CurrentSetting:
    """A declared setting's value as it is read now, and where it came from: the environment, the project, its
    default, or a group above it that is switched off."""

    entry: SettingEntry
    value: CurrentValue
    source: str
