from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.settings.support.current_setting import CurrentSetting


@dataclass(frozen=True)
class SwitchSettingGroup(Command[CurrentSetting]):
    """Switches a toggleable group of settings on or off, for the caller's environment or for the whole project."""

    key: str
    enabled: bool
    project: bool
