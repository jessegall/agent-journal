from dataclasses import dataclass

from engine.enums.state_end import StateEnd
from engine.enums.stack_move_type import StackMoveType
from engine.model.model import Model
from engine.query.rows.prunable import Prunable

MOVES_KEPT = 100_000


@dataclass(frozen=True, kw_only=True)
class AgentStackMove(Prunable, Model):
    """One change of an agent's stack, appended and never changed: the move, the stacked state it moved, how it ended, the
    text of its reason at that time and the versions before and after; it never needs another row to be read."""

    kept_rows = MOVES_KEPT

    model_name = "agent_stack_move"
    cli_name = "agent-stack-move"

    session_agent_id: int
    move_type: StackMoveType
    stacked_state_key: str
    reason_text: str
    version_before: int
    version_after: int
    step_cause: str
    hook_call_id: int | None = None
    stacked_state_end: StateEnd | None = None
    actor_id: int | None = None
