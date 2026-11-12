from core.modules.tasks.support.task_nudges import BLOCKED_TASKS
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.tasks.queries.task_query import TaskQuery
from engine.enums.agent_role import AgentRole
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.modules.tasks.support.suite_task_assigners import SuiteTaskAssigners


class BlockedWorkRule(DriverRule):
    """A stop with nothing in hand and nothing open, while tasks of the environment are blocked, is
    refused once to name them; the next stop goes through."""

    name = "tasks.blocked-work-at-stop"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    single_action_refusal = "A stop with nothing in hand while tasks are blocked is refused once, to name them"

    def __init__(self, tasks: TaskQuery, calls: HookCallQuery, current: CurrentTasks, assigners: SuiteTaskAssigners) -> None:
        self.tasks, self.calls, self.current, self.assigners = tasks, calls, current, assigners

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.current.started_tasks(hook.agent_id) or self.tasks.open_tasks().exists():
            return RuleAnswer.allowed("started tasks are checked by the task stop rule, and open ones by the main agent's stop rule")
        assigner = self.assigners.assigner()
        blocked = assigner.blocked_tasks() if assigner is not None else ()
        if not blocked:
            return RuleAnswer.allowed("no blocked task needs a review")
        if self.calls.last_stop_refused(hook.agent_id):
            return RuleAnswer.allowed("blocked tasks were already named at the previous stop")
        return RuleAnswer.refused(BLOCKED_TASKS.nudge(tasks=', '.join(str(task_id) for task_id in blocked)))
