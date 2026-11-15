from dataclasses import dataclass

from engine.model.model import Model
from engine.query.rows.prunable import Prunable
from core.modules.drivers.models.enums.difference_state import DifferenceState

COMPARISONS_KEPT = 500_000


@dataclass(frozen=True, kw_only=True)
class DriverComparison(Prunable, Model):
    """One event answered by the old walk and, beside it, by the new machine with no effect of its own: both
    answers with every reason, line, effect and move, the inputs read, and how the difference stands."""

    kept_rows = COMPARISONS_KEPT

    model_name = "driver_comparison"
    cli_name = "driver-comparison"

    session_agent_id: int
    slice_name: str
    event_text: str
    old_answer: str
    new_answer: str
    hook_call_id: int | None = None
    difference_key: str = ""
    difference_state: DifferenceState = DifferenceState.UNEXPLAINED
    is_replayable: bool = True
