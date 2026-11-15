from collections.abc import Sequence
from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.models.task_wait import TaskWait
from engine.query.queries import Queries
from suites.coding.modules.checks.queries.check_query import CheckQuery
from suites.coding.modules.checks.nudges.broken_task_wait_nudge import BrokenTaskWaitNudge


class BrokenTaskWaitLines(EventLineSource):
    """A command a blocked task waits on that cannot run at all is named to the main agent, since it would
    wait forever."""

    key = "checks.broken-task-wait"
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, checks: CheckQuery, queries: Queries) -> None:
        self.checks, self.queries = checks, queries

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        broken = self.checks.broken_task_waits()
        waits = self.queries.query(TaskWait).find_many([check.task_wait_id for check in broken if check.task_wait_id is not None])
        tasks = {wait.id: wait.task_id for wait in waits}
        return [*(BrokenTaskWaitNudge.declared().nudge(task=tasks[check.task_wait_id], output=check.last_output.strip()) for check in broken if check.task_wait_id is not None)]
