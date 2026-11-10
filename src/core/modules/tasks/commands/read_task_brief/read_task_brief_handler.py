from engine.enums.actor_type import ActorType
from engine.caller.caller import Caller
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.command.bus import Bus
from core.modules.tasks.commands.record_task_read.record_task_read import RecordTaskRead
from core.modules.tasks.commands.read_task_brief.read_task_brief import ReadTaskBrief
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_log import TaskLog
from core.modules.tasks.support.task_brief import TaskBrief
from core.modules.tasks.support.task_comment import TaskComment
from core.modules.tasks.support.task_comment_reads import TaskCommentReads
from core.modules.tasks.support.task_context_reader import TaskContextReader


class ReadTaskBriefHandler(Handler[ReadTaskBrief, TaskBrief]):
    """Answers the task's brief with its comments, and keeps a read of the task for the agent that asked, once."""

    command = ReadTaskBrief

    def __init__(self, queries: Queries, bus: Bus, comments: TaskCommentReads, reader: TaskContextReader) -> None:
        self.queries, self.bus, self.comments = queries, bus, comments
        self.reader = reader

    def handle(self, command: ReadTaskBrief, context: Context) -> TaskBrief:
        task = self.queries.query(Task).find(command.task_id)
        conversation = self.reader.overview(task, Caller(context.actor, context.environment_id))
        comment_total = self.comments.total(task)
        recent_comments = tuple(TaskComment(comment.message_id, comment.text[:1600],
                               f"journal task context {task.id} --message {comment.message_id} --text-offset 1600" if len(comment.text) > 1600 else None)
                               for comment in self.comments.newest(task, 1600, 5))
        logs = self.queries.query(TaskLog).filter(task_id=task.id)
        log_total = logs.count()
        log_lines = tuple(log.line for log in reversed(logs.newest().limited(5)))
        if context.actor.type is ActorType.AGENT:
            self.bus.run_with_context(RecordTaskRead(task.id), context)
        return TaskBrief(task=task, comments=recent_comments, context=conversation, log_lines=log_lines,
                         comment_total=comment_total, log_total=log_total)
