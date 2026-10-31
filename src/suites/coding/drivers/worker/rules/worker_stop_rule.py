from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.queries.task_query import TaskQuery


class WorkerStopRule(DriverRule):
    """A worker stops only once its task is no longer started; a stop before that names the way to deliver."""

    name = "workers.stop-once-delivered"
    hook = HookEventName.STOP

    def __init__(self, tasks: TaskQuery) -> None:
        self.tasks = tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        rows = self.tasks.holder(hook.agent_id).started().page(1, 1).rows
        if not rows:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(f"task {rows[0].id}, {rows[0].title}, is still started: finish it and deliver it with journal worker deliver")
