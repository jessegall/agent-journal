from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.models.task_wait import TaskWait
from core.base.query.queries import Queries
from suites.coding.modules.checks.queries.check_query import CheckQuery
from suites.coding.modules.checks.support.check_nudges import BROKEN_TASK_WAIT

CANNOT_RUN_WORDS = ("command not found", "not found", "syntax error")


class BrokenTaskWaitRule(DriverRule):
    """A command a blocked task waits on that cannot run at all is named to the main agent, since it would wait forever."""

    name = "checks.broken-task-wait"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, checks: CheckQuery, queries: Queries) -> None:
        self.checks, self.queries = checks, queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        broken = [check for check in self.checks.task_waits() if check.last_passed is False and any(words in check.last_output for words in CANNOT_RUN_WORDS)]
        return RuleAnswer.with_nudges(*(BROKEN_TASK_WAIT.nudge(task=self.queries.query(TaskWait).find(check.task_wait_id).task_id, output=check.last_output.strip()) for check in broken if check.task_wait_id is not None))
