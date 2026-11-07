from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class WaitTarget(Model):
    """One row a wait on rows ends on, and when it resolved."""

    model_name = "wait_target"
    cli_name = "wait-target"

    wait_id: int
    creator_id: int
    row_table: str
    row_id: int
    resolved_at: Timestamp | None = None

    @property
    def ref(self) -> str:
        return f"{self.row_table}:{self.row_id}"
