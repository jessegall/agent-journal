from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.agent_role import AgentRole
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.tasks.queries.task_query import TaskQuery

SOURCE = "workers.ended-worker"


class EndedWorkerListener(SaveListener):
    """A worker that ends with its task still started leaves its main agent a line to release the task."""

    name = "workers.ended-worker"
    event = "agent.update"

    def __init__(self, tasks: TaskQuery, repository: Repository) -> None:
        self.tasks, self.repository = tasks, repository

    def handle(self, change: Change[Model]) -> None:
        old, new = change.old_row, change.new_row
        if not isinstance(old, Agent) or not isinstance(new, Agent) or old.ended_at is not None or new.ended_at is None:
            return
        if new.role != AgentRole.WORKER or new.parent_id is None:
            return
        for task in self.tasks.holder(new.id).started().all_rows():
            line = f"task {task.id} is still started under worker {new.id}: journal worker release {new.id} \"<why>\""
            self.repository.save(AgentLine(agent_id=new.parent_id, creator_id=change.actor.id, text=line, source=SOURCE), change.context)
