from dataclasses import dataclass
from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class TriggerActionRun(Model):
    """A trigger command's process and whether its output has reached the agent."""

    model_name = "trigger_action_run"
    cli_name = "trigger-action-run"

    creator_id: int
    trigger_id: int
    process_id: int
    notify_agent: bool
    delivered_at: Timestamp | None = None
