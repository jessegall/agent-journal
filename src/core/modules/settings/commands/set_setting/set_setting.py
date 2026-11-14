from dataclasses import dataclass

from engine.command.command import Command
from core.modules.settings.support.current_setting import CurrentSetting


@dataclass(frozen=True)
class SetSetting(Command[CurrentSetting]):
    """Sets a declared setting from the text typed for it, for the caller's environment or for the whole
    project. When a revision is given the setting must still read as it did when that revision was taken."""

    key: str
    text: str
    project: bool
    expected_revision: str = ""
