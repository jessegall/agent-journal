from core.modules.drivers.support.required_commands import RequiredCommands
from collections.abc import Mapping, Sequence

from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.states.block_plan import BlockPlan
from engine.agent_machine.states.required_state import RequiredState
from engine.agent_machine.states.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.states.blocked import Blocked
from engine.agent_stack.row_reference import RowReference
from core.modules.processes.agent_messages.run_name_message import RunNameMessage
from core.modules.processes.support.run_docking import LONG_RUN_DOCK_KEY
from core.modules.processes.support.output_title_requests import OutputTitleRequests
from core.modules.processes.support.block_conditions.output_titled import OutputTitled

OUTPUT_TITLE_RANK = "processes.output-title"
# a docked run with no descriptive title holds the agent's tools after this many uses (doc 1310 section 4.6)
TITLE_GRACE_USES = 5


class LongRunDockStates(StateSource):
    """Plans the hold on the oldest run its agent moved to the background and has not named, read from the
    run's open request row (doc 1310 section 4.6, the required command row): its tools held after five uses
    until journal output title, never a line that counts, and the next run's once it is named.
    OutputTitleRequestListener writes the request in the background move."""
    state_type = Blocked
    rank = OUTPUT_TITLE_RANK

    def __init__(self, requests: OutputTitleRequests) -> None:
        self.requests = requests

    def states(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        plans: dict[int, list[RequiredState | BlockPlan]] = {}
        for agent in agents:
            requests = self.requests.agent_requests(agent.agent_id)
            if requests:
                plans[agent.agent_id] = [self.plan(requests[0].process_id)]
        return plans

    # the hold today's required command opens for the title line, in its words: "title output N is due" after the grace
    @staticmethod
    def plan(process_id: int) -> BlockPlan:
        block = RequiredCommands.block(0, RunNameMessage.declared().agent_message(process=process_id))
        return BlockPlan(block.agent_message, OutputTitled(process_id), LONG_RUN_DOCK_KEY, OUTPUT_TITLE_RANK, tool_grace_uses=TITLE_GRACE_USES,
                         subject=RowReference("process", process_id), lifting_lines=(f"journal output title {process_id}",), countdown=block.countdown)