from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.tasks.task import Task, TaskState


class OpenTaskStopRefusal(DriverRule):
    """An orchestrator's stop is refused while tasks of its environment are open, naming them, since each waits for
    a worker it sends."""

    name = "coding.orchestrator-open-tasks-at-stop"
    hook = "stop"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        open_ids = [str(task.id) for task in self.queries.query(Task).filter(environment_id=hook.environment_id, state=TaskState.OPEN).oldest().page().rows]
        return RuleAnswer.refused(f"open tasks wait for a worker: {', '.join(open_ids)}") if open_ids else RuleAnswer.allowed()
