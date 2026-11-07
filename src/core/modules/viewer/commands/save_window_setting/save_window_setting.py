from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.settings.models.setting import Setting


@dataclass(frozen=True)
class SaveWindowSetting(Command[Setting]):
    """Saves one setting of a window, a JSON value, in the caller's environment."""

    window: str
    key: str
    value: str
