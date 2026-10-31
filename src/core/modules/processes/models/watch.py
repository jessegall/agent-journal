from dataclasses import dataclass

from core.base.actor import Actor
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.processes.models.enums.watch_state import WatchState
from core.modules.processes.models.lifecycles.watch_lifecycle import WatchLifecycle


@dataclass(frozen=True, kw_only=True)
class Watch(Model):
    """An agent watching one running process: after every tool use it is given the reader's lines, until the process
    ends or it stops watching."""

    model_name = "watch"
    cli_name = "watch"
    lifecycle = WatchLifecycle

    agent_id: int
    process_id: int
    creator_id: int
    seen_lines: int = 0
    state: WatchState = WatchState.OPEN

    def end(self, timestamp: Timestamp, actor: Actor) -> "Watch":
        return self.moved(WatchLifecycle.end)
