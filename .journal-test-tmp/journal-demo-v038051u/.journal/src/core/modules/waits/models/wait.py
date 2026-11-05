from dataclasses import dataclass

from core.base.actor import Actor
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.waits.models.lifecycles.wait_lifecycle import WaitLifecycle
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.enums.wait_type import WaitType


@dataclass(frozen=True, kw_only=True)
class Wait(Model):
    """Something an agent waits for that it does not control, or a report that it is stuck; open until its
    rows resolve, the agent works again, or it is ended, with the time it last became open."""

    model_name = "wait"
    cli_name = "wait"
    lifecycle = WaitLifecycle

    agent_id: int
    creator_id: int
    type: WaitType
    focus: str
    state: WaitState = WaitState.OPEN
    outcome: str = ""
    opened_at: Timestamp
    ended_at: Timestamp | None = None

    def end(self, timestamp: Timestamp, actor: Actor, outcome: str = "") -> "Wait":
        return self.moved(WaitLifecycle.end, outcome=outcome, ended_at=timestamp)

    def resume(self, timestamp: Timestamp, actor: Actor) -> "Wait":
        return self.moved(WaitLifecycle.resume, opened_at=timestamp, ended_at=None, outcome="")
