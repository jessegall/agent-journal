from suites.coding.support.coding_nudges import WORKER_TASK_UNSTARTED
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.support.block_conditions.started_task_exists import StartedTaskExists


class WorkerTaskStartRule(DriverRule):
    """A worker with no started task is blocked until the journal starts its task."""

    name = "workers.journal-only-without-task"
    hook = HookEventName.PRE_TOOL_USE

    def __init__(self, tasks: TaskQuery) -> None:
        self.tasks = tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.tasks.started_tasks(hook.agent_id):
            return RuleAnswer.allowed()
        return RuleAnswer.blocked(hook, WORKER_TASK_UNSTARTED.nudge(), StartedTaskExists())
