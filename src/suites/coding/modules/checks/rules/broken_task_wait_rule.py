from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.tasks.models.task_wait import TaskWait
from engine.query.queries import Queries
from suites.coding.modules.checks.queries.check_query import CheckQuery
from suites.coding.modules.checks.support.check_nudges import BROKEN_TASK_WAIT

class BrokenTaskWaitRule(DriverRule):
    """A command a blocked task waits on that cannot run at all is named to the main agent, since it would
    wait forever."""

    name = "checks.broken-task-wait"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, checks: CheckQuery, queries: Queries) -> None:
        self.checks, self.queries = checks, queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        broken = self.checks.broken_task_waits()
        waits = self.queries.query(TaskWait).find_many([check.task_wait_id for check in broken if check.task_wait_id is not None])
        tasks = {wait.id: wait.task_id for wait in waits}
        return RuleAnswer.with_nudges(*(BROKEN_TASK_WAIT.nudge(task=tasks[check.task_wait_id], output=check.last_output.strip()) for check in broken if check.task_wait_id is not None))
