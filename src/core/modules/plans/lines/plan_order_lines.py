from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.query.queries import Queries
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.nudges.unlinked_tasks_message import UnlinkedTasksMessage
from core.modules.tasks.models.enums.task_state import TaskState

LINKED_TASK_COUNT = 2


class PlanOrderLines(EventLineSource):
    """A plan made ready or started with open tasks and none blocked is told to set what each waits on."""

    key = "plans.task-order"
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        shell = event.tool.shell if event.tool is not None else None
        numbers = shell.journal_command_numbers("plan ready", "plan start") if shell is not None else ()
        if not numbers:
            return []
        plan_id = numbers[0]
        open_count = self.queries.query(PlanTask).filter(plan_id=plan_id, state=TaskState.OPEN).count()
        if open_count < LINKED_TASK_COUNT or self.queries.query(PlanTask).filter(plan_id=plan_id, state=TaskState.BLOCKED).exists():
            return []
        return [UnlinkedTasksMessage.declared().nudge(plan=plan_id, count=open_count)]
