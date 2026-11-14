from engine.event.created import Created
from engine.event.deleted import Deleted
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from core.modules.assign_rules.listeners.support.task_judging import TaskJudging
from core.modules.tasks.models.task_tag import TaskTag


class AutoAssignTagListener(CommitListener[Created[TaskTag] | Deleted[TaskTag]]):
    """After a tag is added to a task or taken from it, the rules of the task's environment judge the task again,
    since a rule may name the tag."""

    name = "assign-rules.auto-assign-tags"

    def __init__(self, judging: TaskJudging) -> None:
        self.judging = judging

    def handle(self, event: Created[TaskTag] | Deleted[TaskTag], logged: LoggedEvent) -> None:
        self.judging.judge(event.row.task_id, logged.environment_id, logged.id)
