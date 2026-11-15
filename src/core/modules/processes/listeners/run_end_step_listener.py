from collections.abc import Sequence

from engine.agent_machine.contracts.agent_listener import AgentListener
from engine.event.changed import Changed
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process


class RunEndStepListener(AgentListener[Changed[Process]]):
    """A run that ended, failed or was lost asks for the step of the agent that ran it in the same write, so a
    lost run reaches the agent with no tick of its own."""

    name = "processes.run-end-step"

    def agents(self, event: Changed[Process]) -> Sequence[int]:
        ended = event.old_row is not None and event.old_row.state in RUNNING_STATES and event.row.state not in RUNNING_STATES
        return tuple([event.row.session_agent_id]) if ended else ()
