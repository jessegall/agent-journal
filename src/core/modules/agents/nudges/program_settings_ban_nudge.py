from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ProgramSettingsBanNudge(NudgeDeclaration):
    """The nudge agents.program_settings."""

    key = "agents.program_settings"
    type = NudgeType.SAFETY_REFUSAL
    text = "The journal rewrites Claude Code and Codex settings at every start: change hooks through the journal's managed hooks"
