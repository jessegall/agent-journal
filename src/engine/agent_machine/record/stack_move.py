from dataclasses import dataclass

from engine.agent_stack.state_key import StateKey
from engine.enums.state_end import StateEnd
from engine.enums.stack_move_type import StackMoveType


@dataclass(frozen=True)
class StackMove:
    """One change of an agent's stack, with the text of its reason at that moment so history reads without the
    rows it named."""

    move_type: StackMoveType
    stacked_state_key: StateKey | None
    reason_text: str
    stacked_state_end: StateEnd | None = None
    actor_id: int | None = None
