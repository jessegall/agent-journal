from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class NudgeDebt(Model):
    """A line that named one command to run and waits for it: the command that pays it, the hook call that said it, and when it was settled, with the reason if it was skipped."""

    model_name = "nudge_debt"
    cli_name = "debt"

    agent_id: int
    creator_id: int
    key: str
    line: str
    pays: str
    opened_call_id: int
    settled_at: Timestamp | None = None
    skip_reason: str = ""

    @property
    def subject(self) -> str:
        words = self.pays.split()
        return f"{words[1]} {words[-1]}"
