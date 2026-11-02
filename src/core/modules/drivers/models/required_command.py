from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class RequiredCommand(Model):
    """A line that named one command to run and waits for it: the command that pays it, the hook call that said it, and when it was settled, with the reason if it was skipped."""

    model_name = "required_command"
    cli_name = "required-command"

    agent_id: int
    creator_id: int
    key: str
    line: str
    required_command: str
    opened_call_id: int
    closed_at: Timestamp | None = None
    skip_reason: str = ""

    @property
    def subject(self) -> str:
        words = self.required_command.split()
        return f"{words[1]} {words[-1]}"
