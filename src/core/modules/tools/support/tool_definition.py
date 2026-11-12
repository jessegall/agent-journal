from dataclasses import dataclass

from engine.setting.setting_group import SettingGroup


@dataclass(frozen=True)
class ToolDefinition:
    """A tool the journal supports: the name its commands take, its title and what it does for the project, the
    group of settings its suite declares, which is on while the tool is on and shows in the settings menu only then,
    and that group's full key."""

    name: str
    title: str
    description: str
    settings: SettingGroup | None = None
    settings_key: str = ""
