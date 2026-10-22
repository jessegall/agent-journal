import time
from dataclasses import dataclass, field


@dataclass(frozen=True)
class QueuedLine:
    """A line to type to an agent, held while an earlier one is still on its way or while the agent works: the seconds it was to wait go with it, and when it was held. A remark is never typed: it waits for the agent's next hook."""

    environment_id: int
    line: str
    delay_seconds: float = 0.0
    line_at: float = field(default_factory=time.time)
    is_remark: bool = False
