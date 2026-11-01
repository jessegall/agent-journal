from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.settings.support.current_setting import CurrentSetting


@dataclass(frozen=True)
class SetSetting(Command[CurrentSetting]):
    """Sets a declared setting from the text typed for it, for the caller's environment or for the whole project."""

    key: str
    text: str
    project: bool
