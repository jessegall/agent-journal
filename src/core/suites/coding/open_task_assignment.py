from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.tasks.commands import TaskStart
from core.modules.tasks.task import Task, TaskState


class OpenTaskAssignment(DriverRule):
    """A builder that stops with no task started is given the oldest open task of its environment, started as its
    own, and goes on with it."""

    name = "coding.builder-next-task-at-stop"
    hook = "stop"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.queries.query(Task).filter(holder_id=hook.agent_id, state=TaskState.STARTED).exists():
            return RuleAnswer.allowed()
        open_tasks = self.queries.query(Task).filter(environment_id=hook.environment_id, state=TaskState.OPEN).oldest().page(1, 1).rows
        if not open_tasks:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(f"task {open_tasks[0].id} is yours now: {open_tasks[0].title}").running(TaskStart(open_tasks[0].id))
