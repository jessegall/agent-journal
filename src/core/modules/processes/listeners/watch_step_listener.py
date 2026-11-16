from collections.abc import Sequence

from engine.agent_machine.contracts.agent_listener import AgentListener
from engine.event.changed import Changed
from core.modules.processes.models.watch import Watch


class WatchStepListener(AgentListener[Changed[Watch]]):
    """A watch opened or ended asks for its agent's step in the same write, so the agent wakes once the run it
    watched is over."""

    name = "processes.watch-step"

    def agents(self, event: Changed[Watch]) -> Sequence[int]:
        return (event.row.session_agent_id,)
