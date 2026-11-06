from core.base.actor_type import ActorType
from core.base.caller.caller import Caller
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.documents.support.row_comments import RowComments
from core.modules.tasks.commands.read_task_brief.read_task_brief import ReadTaskBrief
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_log import TaskLog
from core.modules.tasks.models.task_read import TaskRead
from core.modules.tasks.support.task_brief import TaskBrief
from core.modules.tasks.support.task_comment import TaskComment
from core.modules.tasks.support.task_context_reader import TaskContextReader


class ReadTaskBriefHandler(Handler[ReadTaskBrief, TaskBrief]):
    """Answers the task's brief with its comments, and keeps a read of the task for the agent that asked, once."""

    command = ReadTaskBrief

    def __init__(self, queries: Queries, repository: Repository, comments: RowComments, reader: TaskContextReader) -> None:
        self.queries, self.repository, self.comments = queries, repository, comments
        self.reader = reader

    def handle(self, command: ReadTaskBrief, context: Context) -> TaskBrief:
        task = self.queries.query(Task).find(command.task_id)
        conversation = self.reader.overview(task, Caller(context.actor, context.environment_id))
        comment_total = self.comments.query(task).count()
        comments = self.comments.previews(task, 1600)
        recent_comments = tuple(TaskComment(message.id, message.text[:1600],
                               f"journal task context {task.id} --message {message.id} --text-offset 1600" if len(message.text) > 1600 else None)
                               for message in reversed(comments.newest().limited(5)))
        logs = self.queries.query(TaskLog).filter(task_id=task.id)
        log_total = logs.count()
        log_lines = tuple(log.line for log in reversed(logs.newest().limited(5)))
        agent_id = context.actor.id
        if context.actor.type is ActorType.AGENT and not self.queries.query(TaskRead).filter(task_id=task.id, session_agent_id=agent_id).exists():
            self.repository.save(TaskRead(task_id=task.id, session_agent_id=agent_id, creator_id=agent_id), context)
        return TaskBrief(task=task, comments=recent_comments, context=conversation, log_lines=log_lines,
                         comment_total=comment_total, log_total=log_total)
