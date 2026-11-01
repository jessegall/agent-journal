import re

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.plan_nudges import UNLINKED_TASKS
from core.modules.tasks.models.enums.task_state import TaskState

PLAN_START_LINE = re.compile(r"(?:^|-- '|&& |; )journal plan (?:ready|start) (\d+)")
LINKED_TASK_COUNT = 2


class PlanOrderRule(DriverRule):
    """A plan made ready or started with open tasks and none blocked is told to set what each waits on."""

    name = "plans.task-order"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        line = PLAN_START_LINE.search(shell.line) if shell is not None else None
        if line is None:
            return RuleAnswer.allowed()
        plan_id = int(line.group(1))
        open_count = self.queries.query(PlanTask).filter(plan_id=plan_id, state=TaskState.OPEN).count()
        if open_count < LINKED_TASK_COUNT or self.queries.query(PlanTask).filter(plan_id=plan_id, state=TaskState.BLOCKED).exists():
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(UNLINKED_TASKS.nudge(plan=plan_id, count=open_count))
