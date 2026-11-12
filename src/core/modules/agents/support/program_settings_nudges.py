from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

PROGRAM_SETTINGS_BAN = NudgeDeclaration("agents.program_settings", NudgeType.SAFETY_REFUSAL,
                                        "the journal writes its Claude Code and Codex settings at every start: change hooks with journal managed-hook commands")
