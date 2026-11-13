from dataclasses import dataclass

from engine.command.command import Command
from core.modules.settings.support.screen_reading import ScreenReading


@dataclass(frozen=True)
class ApplySettingScreen(Command[ScreenReading]):
    """Changes settings of one screen together, as pairs of key and text, from the reading with the given revision,
    and may carry the settings of further screens, each with the revision it was read at, in the same step."""

    screen: str
    revision: str
    changes: tuple[tuple[str, str], ...]
    also: tuple[tuple[str, str], ...] = ()
