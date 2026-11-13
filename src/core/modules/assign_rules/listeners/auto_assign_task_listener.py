from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.event.updated import Updated
from engine.listener.commit.commit_listener import CommitListener
from core.modules.assign_rules.commands.judge_task.judge_task import JudgeTask
from core.modules.tasks.models.task import Task


class AutoAssignTaskListener(CommitListener[Created[Task] | Updated[Task]]):
    """After a task is made or changed and its write is committed, the rules of its environment judge it, so a fault
    of a rule never undoes the task."""

    name = "assign-rules.auto-assign"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Created[Task] | Updated[Task], logged: LoggedEvent) -> None:
        self.bus.run(JudgeTask(event.row.id), Actor.core(), environment_id=event.row.environment_id, cause_id=logged.id)
