from collections.abc import Mapping, Sequence

from core.modules.agents.models.agent import Agent
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.required_state import RequiredState
from engine.agent_machine.needs.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.state_key import StateKey
from engine.agent_stack.reason import Reason
from engine.agent_stack.states.working import Working
from engine.agent_stack.row_reference import RowReference
from engine.agent_stack.work_reference import WorkReference
from engine.enums.decision_class import DecisionClass
from engine.enums.work_type import WorkType
from suites.coding.modules.workers.support.worker_unit_stop import WorkerUnitStop
from suites.coding.modules.workers.types.worker import Worker

WORKER_STOP_KEY = "workers.stop-once-delivered"
# a Working frame is ordered by its push time, never by a rank key
WORKER_STOP_RANK = ""


class WorkerUnitNeeds(StateSource):
    """One Working frame for a worker's unit (doc 1310 section 10.5): work remains while its stop is held, as
    the worker's unit stop holds it, and the stop text says what to do now."""
    state_type = Working
    rank = WORKER_STOP_RANK
    agent_types = [Worker.key]

    def __init__(self, stop: WorkerUnitStop) -> None:
        self.stop = stop

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        return {agent.agent_id: [self.working(agent.agent_id, text)] for agent in agents if (text := self.stop.refusal(agent.agent_id)) is not None}

    @staticmethod
    def working(agent_id: int, text: str) -> RequiredState:
        reason = Reason(WORKER_STOP_KEY, DecisionClass.HOLD, WORKER_STOP_RANK, text)
        return RequiredState(Working(WorkReference(WorkType.UNIT, agent_id, f"the unit of worker {agent_id}"), True, reason), WORKER_STOP_RANK,
                    StateKey("Working", RowReference(Agent.model_name, agent_id), f"unit:{agent_id}"))
