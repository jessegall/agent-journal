from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.created import Created
from engine.event.deleted import Deleted
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from core.modules.assign_rules.commands.judge_task.judge_task import JudgeTask
from core.modules.tasks.models.task_tag import TaskTag


class AutoAssignTagListener(CommitListener[Created[TaskTag] | Deleted[TaskTag]]):
    """After a tag is added to a task or taken from it, the rules of the task's environment judge the task again,
    since a rule may name the tag."""

    name = "assign-rules.auto-assign-tags"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Created[TaskTag] | Deleted[TaskTag], logged: LoggedEvent) -> None:
        self.bus.run(JudgeTask(event.row.task_id), Actor.core(), environment_id=logged.environment_id, cause_id=logged.id)
