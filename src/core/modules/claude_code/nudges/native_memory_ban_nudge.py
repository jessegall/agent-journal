from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class NativeMemoryBanNudge(NudgeDeclaration):
    """The nudge claude_code.native_memory_ban."""

    key = "claude_code.native_memory_ban"
    type = NudgeType.REFUSAL
    text = "Do not write Claude's own memory files: memories belong in the journal"
