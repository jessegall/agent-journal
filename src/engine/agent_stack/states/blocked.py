from dataclasses import dataclass
from typing import ClassVar

from engine.agent_stack.escalation import Escalation
from engine.agent_stack.open_block import OpenBlock
from engine.agent_stack.reason import Reason
from engine.agent_stack.states.state import State
from engine.enums.stack_level import StackLevel


@dataclass(frozen=True)
class Blocked(State):
    """The stacked state of one open hold; it refuses through the hold's scopes and is transparent for the work
    answer."""

    lane: ClassVar[StackLevel] = StackLevel.HOLD
    rank: ClassVar[int] = 30
    block: OpenBlock

    def refuses_stop(self, escalation: Escalation | None) -> bool:
        return self.block.refuses_stop(escalation)

    def stop_refusal(self) -> Reason:
        return self.block.stop_refusal()
