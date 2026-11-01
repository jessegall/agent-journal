from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.support.task_nudges import UNOPENABLE_BLOCKS

SHOWN_TASK_COUNT = 10


class UnopenableBlockRule(DriverRule):
    """Blocked tasks with nothing that opens them are named to the main agent every 45 minutes."""

    name = "tasks.unopenable-blocks"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, tasks: TaskQuery) -> None:
        self.tasks = tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        blocked = self.tasks.unopenable_blocks(hook.environment_id).oldest().page(1, SHOWN_TASK_COUNT).rows
        return RuleAnswer.with_nudges(UNOPENABLE_BLOCKS.nudge(tasks=", ".join(str(task.id) for task in blocked))) if blocked else RuleAnswer.allowed()
