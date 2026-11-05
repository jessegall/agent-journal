from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

NATIVE_MEMORY_BAN = NudgeDeclaration("claude_code.native_memory_ban", NudgeType.REFUSAL, "Claude's own memory files are not written here: keep it with journal memory make")
CLAUDE_CODE_NUDGES = [NATIVE_MEMORY_BAN]
