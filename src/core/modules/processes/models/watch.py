from dataclasses import dataclass

from engine.actor.actor import Actor
from core.base.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.processes.models.enums.watch_state import WatchState
from core.modules.processes.models.lifecycles.watch_lifecycle import WatchLifecycle

UNANNOUNCED_PERCENT = -1


@dataclass(frozen=True, kw_only=True)
class Watch(Model):
    """An agent watching one running process: it is told once that the run goes on in the background, and
    after each tool use the progress in steps of 10 percent, and woken to confirm the run still does its work."""

    model_name = "watch"
    cli_name = "watch"
    lifecycle = WatchLifecycle

    session_agent_id: int
    process_id: int
    creator_id: int
    given_percent: int = 0
    state: WatchState = WatchState.OPEN
    confirmed_count: int = 0
    notified_at: Timestamp | None = None
    awaits_confirm: bool = False

    def end(self, timestamp: Timestamp, actor: Actor) -> "Watch":
        return self.moved(WatchLifecycle.end)
