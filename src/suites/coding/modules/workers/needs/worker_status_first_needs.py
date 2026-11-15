from collections.abc import Mapping, Sequence

from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.need import Need
from engine.agent_machine.needs.need_source import NeedSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.states.blocked import Blocked
from engine.driver.conditions.ran_command import RanCommand
from suites.coding.modules.workers.nudges.worker_status_first_nudge import WorkerStatusFirstNudge
from suites.coding.modules.workers.types.worker import Worker

STATUS_COMMAND = "journal worker status"
WORKER_STATUS_FIRST_KEY = "workers.status-first"


class WorkerStatusFirstNeeds(NeedSource):
    """After a compaction a worker is held until it has run journal worker status, which says where it stands and
    which skills it must load; a new start needs none, since the brief is its prompt."""
    state_type = Blocked
    rank = WORKER_STATUS_FIRST_KEY
    agent_types = [Worker.key]

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]:
        if question.event is None or not question.event.is_compaction_start:
            return {}
        return {agent.agent_id: [WorkerStatusFirstNeeds.plan()] for agent in agents}

    @staticmethod
    def plan() -> BlockPlan:
        return BlockPlan(WorkerStatusFirstNudge.declared().nudge(), RanCommand(STATUS_COMMAND), WORKER_STATUS_FIRST_KEY, WORKER_STATUS_FIRST_KEY, scope_tools=True, scope_stop=False)
