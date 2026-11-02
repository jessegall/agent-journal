from suites.coding.support.coding_nudges import WORKER_TASK_STARTED
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.queries.task_query import TaskQuery


class WorkerStopRule(DriverRule):
    """A worker stops only once it holds no started task and has no task queued; a stop before that names the way
    to deliver, and a stuck report is the way out."""

    name = "workers.stop-once-delivered"
    hook = HookEventName.STOP

    def __init__(self, tasks: TaskQuery) -> None:
        self.tasks = tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        rows = self.tasks.holder(hook.agent_id).started().page(1, 1).rows
        task = rows[0] if rows else self.tasks.next_delegated(hook.agent_id)
        if task is None:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(WORKER_TASK_STARTED.nudge(task=task.id))
