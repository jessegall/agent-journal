from dataclasses import dataclass

from journal.engine.permission import Permission
from journal.engine.states.paused import Paused
from journal.engine.transition import Transition
from journal.events.agent.idle import Idle as AgentIdle
from journal.events.agent.ticked import Ticked


@dataclass(frozen=True)
class Awaiting(Paused):
    """Waiting for named helpers or background runs. Idle is fine; when the last one is back, the agent is told and returns to work."""

    name = "awaiting"
    allows = frozenset({Permission.WRITE_FILES, Permission.RUN_COMMANDS, Permission.DISPATCH_SUBAGENTS})
    on: tuple[str, ...] = ()

    def idle(self, event: AgentIdle) -> Transition: ...

    def ticked(self, event: Ticked) -> Transition: ...
