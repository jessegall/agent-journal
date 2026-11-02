from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

MEMORY_LINE = NudgeDeclaration("memories.memory_line", NudgeType.REMARK, 'memory:{memory} applies now', turn_limited=False)
START_MEMORIES = NudgeDeclaration("memories.start_memories", NudgeType.INSTRUCTION, '{count} memories to read: journal memory list', turn_limited=False, pays="journal memory list")
WEIGH_MEMORIES = NudgeDeclaration("memories.weigh_memories", NudgeType.INSTRUCTION, 'context at {percent}%: weigh your {count} memories: journal memory list', turn_limited=False, pays="")
WEIGH_FIRST = NudgeDeclaration("memories.weigh_first", NudgeType.REFUSAL, 'weigh your memories first: journal memory weigh <numbers> <weights>, or journal memory skip "<why>"')

MEMORY_NUDGES = [MEMORY_LINE, START_MEMORIES, WEIGH_MEMORIES, WEIGH_FIRST]
