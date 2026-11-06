from core.base.driver.count_down import CountDown
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan

WEIGH_COUNTDOWN_TOOL_USES = 3

MEMORY_LINE = NudgeDeclaration("memories.memory_line", NudgeType.STEERING, 'memory:{memory} applies now', turn_limited=False)
START_MEMORIES = NudgeDeclaration("memories.start_memories", NudgeType.STEERING, '{count} memories to read: journal skill require {agent} journal-memory, load it as directed, then journal memory list', turn_limited=False, required_command="journal memory list")
WEIGH_MEMORIES = NudgeDeclaration("memories.weigh_memories", NudgeType.STEERING, 'context at {percent}%: {uses} tool uses to weigh your {count} memories, heaviest first: {memories}', turn_limited=False)
WEIGH_FIRST = NudgeDeclaration("memories.weigh_first", NudgeType.REFUSAL, 'weigh your memories first: journal memory weigh <numbers> <weights>, or journal memory skip "<why>"')

WEIGH_COUNTDOWN = CountDown("memories.weigh_countdown", "weigh memories", ToolUseSpan(WEIGH_COUNTDOWN_TOOL_USES))

MEMORY_NUDGES = [MEMORY_LINE, START_MEMORIES, WEIGH_MEMORIES, WEIGH_FIRST, WEIGH_COUNTDOWN.declaration]
