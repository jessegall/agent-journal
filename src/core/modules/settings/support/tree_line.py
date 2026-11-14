from dataclasses import dataclass

from core.modules.settings.support.current_setting import CurrentSetting


@dataclass(frozen=True)
class TreeLine:
    """One line of the settings tree: a setting as read and how deep it sits where the tree shows it."""

    setting: CurrentSetting
    depth: int
