from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.task_query import TaskQuery


class OpenTaskStopRefusal(DriverRule):
    """An orchestrator's stop is refused while tasks of its environment are open, naming them, since each waits for
    a worker it sends."""

    name = "coding.orchestrator-open-tasks-at-stop"
    hook = "stop"

    def __init__(self, tasks: TaskQuery) -> None:
        self.tasks = tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        open_ids = [str(task.id) for task in self.tasks.open_tasks(hook.environment_id).oldest().page().rows]
        return RuleAnswer.refused(f"open tasks wait for a worker: {', '.join(open_ids)}") if open_ids else RuleAnswer.allowed()
