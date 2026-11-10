from engine.command.context import Context
from engine.row.metadata import Metadata
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task

TASKS_MODULE = "journal.core.tasks"
NEXT_TASK_KEY = "chosen_next_task"


class NextTaskChoices:
    """The one task each agent was told to take next, kept on the agent's row. A choice that is no longer open
    or free for the agent is passed over, and counts again once it is."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def choose(self, agent: Agent, task: Task, context: Context) -> None:
        part = {**agent.metadata.module_part(TASKS_MODULE), NEXT_TASK_KEY: task.id}
        self.repository.save_metadata(agent, Metadata({**agent.metadata.values, TASKS_MODULE: part}), context)

    def find(self, agent_id: int, excluded_id: int | None = None) -> Task | None:
        task_id = self.queries.query(Agent).find(agent_id).metadata.module_part(TASKS_MODULE).get(NEXT_TASK_KEY)
        if task_id is None or task_id == excluded_id:
            return None
        task = self.queries.query(Task).filter(id=task_id).first()
        if task is None or task.state is not TaskState.OPEN or not self.is_free(task, agent_id):
            return None
        return task

    @staticmethod
    def is_free(task: Task, agent_id: int) -> bool:
        return task.delegated_to in (None, agent_id)
