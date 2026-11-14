from dataclasses import dataclass

from core.modules.assignments.models.enums.kept_reason import KeptReason


@dataclass(frozen=True)
class KeptRow:
    """A child row whose assignment the assignment of its parent left as it was, and why."""

    model_name: str
    row_id: int
    reason: KeptReason
