from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_comment import TaskComment


class TaskCommentReads:
    """The comments written on a task, counted and the newest read with their text cut to a length; answered by the
    module that keeps comments, and none without one."""

    def total(self, task: Task) -> int:
        return 0

    def newest(self, task: Task, characters: int, count: int) -> tuple[TaskComment, ...]:
        return ()
