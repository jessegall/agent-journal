from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

MEMORY_LINE = NudgeDeclaration("memories.memory_line", NudgeType.STEERING, 'memory:{memory} applies now', turn_limited=False)
START_MEMORIES = NudgeDeclaration("memories.start_memories", NudgeType.STEERING, '{count} memories to read: first journal skill require {agent} journal-memory, then cat the path it gives, then journal memory list', turn_limited=False, longest_characters=240, required_command="journal memory list")
WEIGH_MEMORIES = NudgeDeclaration("memories.weigh_memories", NudgeType.STEERING, 'context at {percent}%: weigh your {count} memories, heaviest first: {memories}; journal memory read <number> reads one', turn_limited=False, required_command="")
WEIGH_FIRST = NudgeDeclaration("memories.weigh_first", NudgeType.REFUSAL, 'weigh your memories first: journal memory weigh <numbers> <weights>, or journal memory skip "<why>"')

MEMORY_NUDGES = [MEMORY_LINE, START_MEMORIES, WEIGH_MEMORIES, WEIGH_FIRST]
