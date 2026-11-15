from engine.driver.count_down import CountDown
from core.modules.drivers.models.support.tool_use_window import ToolUseWindow
from core.modules.memories.nudges.memory_line_message import MemoryLineMessage
from core.modules.memories.nudges.start_memories_message import StartMemoriesMessage
from core.modules.memories.nudges.weigh_memories_message import WeighMemoriesMessage
from core.modules.memories.nudges.weigh_first_message import WeighFirstMessage

WEIGH_COUNTDOWN_TOOL_USES = 3


WEIGH_COUNTDOWN = CountDown("memories.weigh_countdown", "weigh memories", ToolUseWindow(WEIGH_COUNTDOWN_TOOL_USES))

MEMORY_NUDGES = [MemoryLineMessage, StartMemoriesMessage, WeighMemoriesMessage, WeighFirstMessage, WEIGH_COUNTDOWN.declaration]
