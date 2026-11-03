from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.documents.commands.support.row_comments import RowComments
from core.modules.tasks.commands.read_task_brief.read_task_brief import ReadTaskBrief
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_log import TaskLog
from core.modules.tasks.models.task_read import TaskRead
from core.modules.tasks.support.task_brief import TaskBrief
from core.modules.tasks.support.task_comment import TaskComment


class ReadTaskBriefHandler(Handler[ReadTaskBrief, TaskBrief]):
    """Answers the task's brief with its comments, and keeps a read of the task for the agent that asked, once."""

    command = ReadTaskBrief

    def __init__(self, queries: Queries, repository: Repository, comments: RowComments) -> None:
        self.queries, self.repository, self.comments = queries, repository, comments

    def handle(self, command: ReadTaskBrief, context: Context) -> TaskBrief:
        task = self.queries.query(Task).find(command.task_id)
        agent_id = context.actor.id
        if context.actor.type is ActorType.AGENT and not self.queries.query(TaskRead).filter(task_id=task.id, agent_id=agent_id).exists():
            self.repository.save(TaskRead(task_id=task.id, agent_id=agent_id, creator_id=agent_id), context)
        log_lines = tuple(log.line for log in self.queries.query(TaskLog).filter(task_id=task.id).oldest().all_rows())
        return TaskBrief(task, tuple(TaskComment(message.id, message.text) for message in self.comments.comments(task)), log_lines)
