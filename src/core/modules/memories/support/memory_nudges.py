from core.base.driver.count_down import CountDown
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan

WEIGH_COUNTDOWN_TOOL_USES = 3

MEMORY_LINE = NudgeDeclaration("memories.memory_line", NudgeType.STEERING, 'memory:{memory} applies now', turn_limited=False)
START_MEMORIES = NudgeDeclaration("memories.start_memories", NudgeType.STEERING, '{count} memories to read: load the memory skill as directed, then list them', turn_limited=False, required_command="journal memory list")
WEIGH_MEMORIES = NudgeDeclaration("memories.weigh_memories", NudgeType.NOTICE, 'context at {percent}%: {uses} tool uses to weigh your {count} memories, heaviest first: {memories}. A compaction loses nothing you keep: go on working as before', turn_limited=False)
WEIGH_FIRST = NudgeDeclaration("memories.weigh_first", NudgeType.REFUSAL, 'weigh your memories first, or skip the weighing with a reason')

WEIGH_COUNTDOWN = CountDown("memories.weigh_countdown", "weigh memories", ToolUseSpan(WEIGH_COUNTDOWN_TOOL_USES))

MEMORY_NUDGES = [MEMORY_LINE, START_MEMORIES, WEIGH_MEMORIES, WEIGH_FIRST, WEIGH_COUNTDOWN.declaration]
