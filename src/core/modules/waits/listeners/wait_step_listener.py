from collections.abc import Sequence

from engine.agent_machine.contracts.agent_listener import AgentListener
from engine.event.changed import Changed
from core.modules.waits.models.wait import Wait


class WaitStepListener(AgentListener[Changed[Wait]]):
    """A wait opened or ended asks for its agent's step in the same write, so the agent wakes once what it waited on
    is over, whatever ended it."""

    name = "waits.wait-step"

    def agents(self, event: Changed[Wait]) -> Sequence[int]:
        return tuple([event.row.session_agent_id])
