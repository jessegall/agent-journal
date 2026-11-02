from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class SubagentDispatch(Model):
    """A subagent an agent sent out: its profile, model, job and instruction, and what it returned when it ended."""

    model_name = "subagent_dispatch"
    cli_name = "subagent-dispatch"

    environment_id: int
    agent_id: int
    creator_id: int
    tool_key: str
    profile: str
    program_model: str
    description: str
    instruction: str
    returned: str = ""
    ended_at: Timestamp | None = None
