from collections.abc import Mapping, Sequence

from engine.agent.enums.role_group import RoleGroup
from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.states.block_plan import BlockPlan
from engine.agent_machine.states.required_state import RequiredState
from engine.agent_machine.states.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.states.blocked import Blocked
from engine.driver.block_condition import BlockCondition
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.support.block_conditions.any_condition import AnyCondition
from core.modules.tasks.agent_messages.unlogged_writes_message import UnloggedWritesMessage
from core.modules.tasks.support.task_write_count import TaskWriteCount
from core.modules.tasks.support.block_conditions.task_logged import TaskLogged
from core.modules.tasks.support.block_conditions.task_stopped import TaskStopped

UNLOGGED_WRITES_CEILING = 50
UNLOGGED_WRITE_KEY = "tasks.log-before-more-writes"
UNLOGGED_WRITE_RANK = "tasks.unlogged-writes"


class UnloggedWriteStates(StateSource):
    """Once 50 writes have been made since the task in hand was last logged, the agent is blocked until the task
    gets a log line or stops."""
    state_type = Blocked
    rank = UNLOGGED_WRITE_RANK
    role_group = RoleGroup.TASK

    def __init__(self, task_writes: TaskWriteCount) -> None:
        self.task_writes = task_writes

    def states(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        event = question.event
        if event is None or event.event is not HookEventName.PRE_TOOL_USE:
            return {}
        holds = {agent.agent_id: self.hold(event, agent.agent_id) for agent in agents}
        return {agent_id: [BlockPlan(hold[0], hold[1], UNLOGGED_WRITE_KEY, UNLOGGED_WRITE_RANK, scope_tools=True, scope_stop=False)]
                for agent_id, hold in holds.items() if hold is not None}

    # the line and the condition of the hold this write opens, if it reaches the ceiling
    def hold(self, event: HookEvent, agent_id: int) -> tuple[AgentMessage, BlockCondition] | None:
        counted = self.task_writes.count(event, agent_id)
        if counted is None or counted[1] < UNLOGGED_WRITES_CEILING:
            return None
        task_id = counted[0].task.id
        return UnloggedWritesMessage.declared().agent_message(task=task_id), AnyCondition(TaskLogged(task_id), TaskStopped(task_id))
