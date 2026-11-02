from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module import Module
from core.modules.tasks.commands.start_task.start_task import StartTask
from core.modules.tasks.queries.task_query import TaskQuery

PATH = "tests.stories.suites.coding.support.task_assigner_samples"


class OldestTaskFirstListener(CommitListener):
    """A sample suite's own way of handing out tasks: the oldest open one, whatever its priority."""

    name = "assignersample.oldest-first"
    event = "task.close"

    def __init__(self, bus: Bus, tasks: TaskQuery) -> None:
        self.bus, self.tasks = bus, tasks

    def handle(self, event: LoggedEvent) -> None:
        waiting = self.tasks.open_tasks(self.tasks.find(event.row_id).environment_id).oldest().page(1, 1).rows
        if waiting:
            self.bus.run(StartTask(waiting[0].id), Actor(event.actor_id, ActorType.AGENT), cause_id=event.id, environment_id=event.environment_id)


class OwnAssignerModule(Module):
    """A module of another suite with its own way of handing out tasks."""

    name = "assignersample"
    seed_reason = "a sample"
    move_reason = "a sample"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.tasks"]
    listeners = [OldestTaskFirstListener]
