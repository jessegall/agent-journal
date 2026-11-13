from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

NATIVE_MEMORY_BAN = NudgeDeclaration("claude_code.native_memory_ban", NudgeType.REFUSAL, "Do not write Claude's own memory files: memories belong in the journal")
CLAUDE_CODE_NUDGES = [NATIVE_MEMORY_BAN]
