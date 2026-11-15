from engine.chat.mark_declaration import MarkDeclaration
from core.modules.agents.models.enums.program_settings_mark_type import ProgramSettingsMarkType
from core.modules.agents.models.enums.program_settings_mark_variant import ProgramSettingsMarkVariant
from core.modules.agents.support.agent_marks import PROGRAM_SETTINGS_FAMILY


class ProgramSettingsMark(MarkDeclaration):
    """The mark ProgramSettingsMarkType.PROGRAM_SETTINGS."""

    type = ProgramSettingsMarkType.PROGRAM_SETTINGS
    variants = ProgramSettingsMarkVariant
    family = PROGRAM_SETTINGS_FAMILY
    label = "The journal's own Claude Code and Codex settings"
    mark_icon = "terminal"
