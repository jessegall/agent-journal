from collections.abc import Mapping, Sequence

from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.required_state import RequiredState
from engine.agent_machine.needs.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.states.blocked import Blocked
from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.support.block_conditions.started_task_exists import StartedTaskExists
from suites.coding.drivers.worker.worker_agent_driver import WorkerAgentDriver
from suites.coding.nudges.worker_task_unstarted_message import WorkerTaskUnstartedMessage

WORKER_TASK_START_KEY = "workers.journal-only-without-task"
WORKER_TASK_START_RANK = "workers.no-task"


class WorkerTaskStartNeeds(StateSource):
    """A worker with no started task is held, before its tools, until the journal starts its task."""
    state_type = Blocked
    rank = WORKER_TASK_START_RANK
    agent_types = [WorkerAgentDriver.agent_type]

    def __init__(self, tasks: TaskQuery) -> None:
        self.tasks = tasks

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        if question.event is None or question.event.event is not HookEventName.PRE_TOOL_USE:
            return {}
        return {agent.agent_id: [BlockPlan(WorkerTaskUnstartedMessage.declared().nudge(), StartedTaskExists(), WORKER_TASK_START_KEY, WORKER_TASK_START_RANK, scope_tools=True, scope_stop=False)]
                for agent in agents if self.is_waiting(agent.agent_id)}

    def is_waiting(self, agent_id: int) -> bool:
        return not self.tasks.started_tasks(agent_id)
