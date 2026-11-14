from collections.abc import Sequence
from typing import ClassVar

from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState
from engine.driver.open_row import OpenRow
from engine.driver.states.open_blocks import OpenBlocks


class BlockState(AgentState):
    """An abstract shape: a state that is open while the agent has a block open on one of its nudge keys. A state of
    this shape names itself and its keys, and is registered by its module."""

    nudge_keys: ClassVar[Sequence[str]] = []

    def __init__(self, blocks: OpenBlocks) -> None:
        self.blocks = blocks

    def keys(self) -> Sequence[str]:
        return self.nudge_keys

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        return self.blocks.open_rows(hook.agent_id, self.keys())
