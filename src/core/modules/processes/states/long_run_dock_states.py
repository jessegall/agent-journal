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
from core.modules.processes.support.run_docking import LONG_RUN_DOCK_KEY, RunDocking
from core.modules.processes.support.block_conditions.output_titled import OutputTitled

OUTPUT_TITLE_RANK = "processes.output-title"
# a docked run with no descriptive title holds the agent's tools after this many uses (doc 1310 section 4.6)
TITLE_GRACE_USES = 5


class LongRunDockStates(StateSource):
    """Plans the hold on each docked run whose output has no descriptive title (doc 1310 section 4.6, the
    required command row): the docked run is the request, its tools held after five uses until journal output
    title, never a line that counts. LongRunDockEffect docks the run."""
    state_type = Blocked
    rank = OUTPUT_TITLE_RANK

    def __init__(self, docking: RunDocking) -> None:
        self.docking = docking

    def states(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        plans: dict[int, list[RequiredState | BlockPlan]] = {}
        for agent in agents:
            untitled = self.docking.docked(question.event, agent.agent_id).untitled
            if untitled:
                plans[agent.agent_id] = [self.plan(process_id) for process_id in untitled]
        return plans

    # the hold today's required command opens for the title line, in its words: "title output N is due" after the grace
    @staticmethod
    def plan(process_id: int) -> BlockPlan:
        block = RequiredCommands.block(0, RunNameMessage.declared().agent_message(process=process_id))
        return BlockPlan(block.agent_message, OutputTitled(process_id), LONG_RUN_DOCK_KEY, OUTPUT_TITLE_RANK, tool_grace_uses=TITLE_GRACE_USES,
                         subject=RowReference("process", process_id), lifting_lines=(f"journal output title {process_id}",), countdown=block.countdown)