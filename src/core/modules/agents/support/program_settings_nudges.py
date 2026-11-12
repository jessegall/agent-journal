from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

PROGRAM_SETTINGS_BAN = NudgeDeclaration("agents.program_settings", NudgeType.SAFETY_REFUSAL,
                                        "the journal's Claude Code and Codex settings are written by the journal at every start; they cannot be edited. "
                                        "Change hooks with journal managed-hook commands.")
