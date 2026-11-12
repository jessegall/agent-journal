from core.modules.assignments.support.assignments import Assignments
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from suites.coding.models.enums.ask_topic import AskTopic

WORKER_TASKS_HINT = "journal worker status lists your tasks"


class WorkerTaskAccess:
    """Says whether a worker has a task started, and refuses work on a task it has not: another agent has it
    started, it is another worker's, it is blocked, or it is not started."""

    def __init__(self, queries: Queries, assignments: Assignments) -> None:
        self.queries, self.assignments = queries, assignments

    @staticmethod
    def is_holder(task: Task, worker_id: int) -> bool:
        return task.state is TaskState.STARTED and task.holder_id == worker_id

    @staticmethod
    def is_held_by_another(task: Task, worker_id: int) -> bool:
        return task.state is TaskState.STARTED and task.holder_id not in (None, worker_id)

    def refusal(self, task: Task, worker_id: int) -> Refusal:
        if WorkerTaskAccess.is_held_by_another(task, worker_id):
            holder = AgentLabel.from_agent(self.queries.query(Agent).find(task.holder_id))
            return Refusal(f"task {task.id} is held by {holder.text}", AskTopic.GENERAL.hint(WORKER_TASKS_HINT))
        if worker_id not in (self.assignments.actor(task), task.holder_id):
            return Refusal(f"task {task.id} is not yours", AskTopic.GENERAL.hint(WORKER_TASKS_HINT))
        if task.state is TaskState.BLOCKED:
            return Refusal(f"task {task.id} is blocked: {task.reason}", AskTopic.GENERAL.hint(WORKER_TASKS_HINT))
        return Refusal(f"task {task.id} is not started", AskTopic.GENERAL.hint(f"journal task start {task.id}"))
