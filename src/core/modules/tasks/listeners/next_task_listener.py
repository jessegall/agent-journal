from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.enums.actor_type import ActorType
from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit.commit_listener import CommitListener
from core.modules.tasks.commands.assign_next_task.assign_next_task import AssignNextTask
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task


class NextTaskListener(CommitListener[Moved[Task]]):
    """A task the main agent closes or cancels asks for its next task through AssignNextTask."""

    name = "tasks.next-task"
    moves = (TaskLifecycle.close, TaskLifecycle.cancel)

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        holder_id = None if event.old_row is None else event.old_row.holder_id
        if holder_id is None:
            return
        self.bus.run(AssignNextTask(holder_id), Actor(holder_id, ActorType.AGENT), cause_id=logged.id)
