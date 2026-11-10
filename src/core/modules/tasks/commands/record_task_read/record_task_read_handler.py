from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.tasks.commands.record_task_read.record_task_read import RecordTaskRead
from core.modules.tasks.models.task_read import TaskRead
from core.modules.tasks.rules.support.current_tasks import CurrentTasks


class RecordTaskReadHandler(Handler[RecordTaskRead, None]):
    """Keeps one task read per agent until its context is reset."""

    command = RecordTaskRead

    def __init__(self, tasks: CurrentTasks, repository: Repository) -> None:
        self.tasks, self.repository = tasks, repository

    def handle(self, command: RecordTaskRead, context: Context) -> None:
        agent_id = context.actor.id
        if self.tasks.has_brief_read(command.task_id, agent_id):
            return
        self.repository.save(TaskRead(task_id=command.task_id, session_agent_id=agent_id, creator_id=agent_id), context)
