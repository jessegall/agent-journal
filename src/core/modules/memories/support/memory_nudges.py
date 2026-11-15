from engine.driver.count_down import CountDown
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.modules.memories.nudges.memory_line_nudge import MemoryLineNudge
from core.modules.memories.nudges.start_memories_nudge import StartMemoriesNudge
from core.modules.memories.nudges.weigh_memories_nudge import WeighMemoriesNudge
from core.modules.memories.nudges.weigh_first_nudge import WeighFirstNudge

WEIGH_COUNTDOWN_TOOL_USES = 3


WEIGH_COUNTDOWN = CountDown("memories.weigh_countdown", "weigh memories", ToolUseSpan(WEIGH_COUNTDOWN_TOOL_USES))

MEMORY_NUDGES = [MemoryLineNudge, StartMemoriesNudge, WeighMemoriesNudge, WeighFirstNudge, WEIGH_COUNTDOWN.declaration]
