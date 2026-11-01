from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

MEMORY_LINE = NudgeDeclaration("memories.memory_line", NudgeType.REMARK, '{text}', turn_limited=False)
WEIGH_MEMORIES = NudgeDeclaration("memories.weigh_memories", NudgeType.INSTRUCTION, '{text}', turn_limited=False)
WEIGH_FIRST = NudgeDeclaration("memories.weigh_first", NudgeType.REFUSAL, 'weigh your memories first: journal memory weigh <numbers> <weights>, or journal memory skip "<why nothing needs keeping>"')

MEMORY_NUDGES = [MEMORY_LINE, WEIGH_MEMORIES, WEIGH_FIRST]
