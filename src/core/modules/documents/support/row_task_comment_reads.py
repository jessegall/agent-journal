from core.modules.documents.support.row_comments import RowComments
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_comment import TaskComment
from core.modules.tasks.support.task_comment_reads import TaskCommentReads


class RowTaskCommentReads(TaskCommentReads):
    """Reads a task's comments from the comment links of its row."""

    def __init__(self, comments: RowComments) -> None:
        self.comments = comments

    def total(self, task: Task) -> int:
        return self.comments.query(task).count()

    def newest(self, task: Task, characters: int, count: int) -> tuple[TaskComment, ...]:
        return tuple(TaskComment(message.id, message.text) for message in reversed(self.comments.previews(task, characters).newest().limited(count)))
