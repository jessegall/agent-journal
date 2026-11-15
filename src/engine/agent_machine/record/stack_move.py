from dataclasses import dataclass

from engine.agent_stack.need_key import NeedKey
from engine.enums.frame_end import FrameEnd
from engine.enums.stack_move_type import StackMoveType


@dataclass(frozen=True)
class StackMove:
    """One change of an agent's stack, with the text of its reason at that moment so history reads without the rows it named."""

    move_type: StackMoveType
    frame_key: NeedKey | None
    reason_text: str
    frame_end: FrameEnd | None = None
    actor_id: int | None = None
