from dataclasses import dataclass

from engine.setting.setting_group import SettingGroup
from core.modules.tools.models.enums.tool_setting import MODULE_KEY


@dataclass(frozen=True)
class ToolDefinition:
    """A tool the journal supports: the name its commands take, its title and what it does for the project,
    and the group of settings it declares, which is on while the tool is on and shows in the settings menu
    only then."""

    name: str
    title: str
    description: str
    settings: SettingGroup | None = None

    @property
    def settings_key(self) -> str:
        return f"{MODULE_KEY}.{self.name}"
