from dataclasses import dataclass

from engine.container.container import Container
from engine.driver.agent_hook import AgentHook
from engine.time.timestamp import Timestamp


@dataclass(frozen=True)
class BlockCheck:
    """What a block's condition looks at: the hook that came in, when the block opened, and the container it
    reads the journal through."""

    hook: AgentHook
    opened_at: Timestamp
    container: Container
