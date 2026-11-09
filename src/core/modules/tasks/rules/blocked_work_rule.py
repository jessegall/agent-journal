from core.modules.tasks.support.task_nudges import BLOCKED_TASKS
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.tasks.queries.task_query import TaskQuery
from core.base.agent_role import AgentRole
from core.modules.tasks.rules.support.current_tasks import CurrentTasks

BLOCKED_TASK_PAGE_SIZE = 10


class BlockedWorkRule(DriverRule):
    """A stop with nothing in hand and nothing open, while tasks of the environment are blocked, is
    refused once to name them; the next stop goes through."""

    name = "tasks.blocked-work-at-stop"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    refuses_one_action = "A stop with nothing in hand while tasks are blocked is refused once, to name them"

    def __init__(self, tasks: TaskQuery, calls: HookCallQuery, current: CurrentTasks) -> None:
        self.tasks, self.calls = tasks, calls
        self.current = current

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.current.started_tasks(hook.agent_id) or self.tasks.open_tasks().exists():
            return RuleAnswer.allowed("started or open tasks are checked by the task stop rules")
        blocked = self.tasks.unopenable_blocks().oldest().page(1, BLOCKED_TASK_PAGE_SIZE).rows
        if not blocked:
            return RuleAnswer.allowed("no blocked task needs a review")
        if self.calls.last_stop_refused(hook.agent_id):
            return RuleAnswer.allowed("blocked tasks were already named at the previous stop")
        return RuleAnswer.refused(BLOCKED_TASKS.nudge(tasks=', '.join(str(task.id) for task in blocked)))
