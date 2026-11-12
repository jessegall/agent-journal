from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

PROGRAM_SETTINGS_BAN = NudgeDeclaration("agents.program_settings", NudgeType.SAFETY_REFUSAL,
                                        "The journal rewrites Claude Code and Codex settings at every start, so they cannot be edited: change hooks with journal managed-hook commands")
