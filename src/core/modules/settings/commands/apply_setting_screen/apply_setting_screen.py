from dataclasses import dataclass

from engine.command.command import Command
from core.modules.settings.support.setting_screen import ScreenReading


@dataclass(frozen=True)
class ApplySettingScreen(Command[ScreenReading]):
    """Changes settings of one screen together, as pairs of key and text, from the reading with the given revision."""

    screen: str
    revision: str
    changes: tuple[tuple[str, str], ...]
