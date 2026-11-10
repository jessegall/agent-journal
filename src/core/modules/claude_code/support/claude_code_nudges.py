from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

NATIVE_MEMORY_BAN = NudgeDeclaration("claude_code.native_memory_ban", NudgeType.REFUSAL, "Claude's own memory files are not written here: keep it as a memory of the journal")
CLAUDE_CODE_NUDGES = [NATIVE_MEMORY_BAN]
