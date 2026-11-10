from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module import Module
from core.modules.tasks.commands.start_task.start_task import StartTask
from core.modules.tasks.queries.task_query import TaskQuery
from core.base.change.moved import Moved
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task

PATH = "tests.stories.suites.coding.support.task_assigner_samples"


class OldestTaskFirstListener(CommitListener[Moved[Task]]):
    """A sample suite's own way of handing out tasks: the oldest open one, whatever its priority."""

    name = "assignersample.oldest-first"
    moves = tuple([TaskLifecycle.close])

    def __init__(self, bus: Bus, tasks: TaskQuery) -> None:
        self.bus, self.tasks = bus, tasks

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        waiting = self.tasks.open_tasks().oldest().page(1, 1).rows
        if waiting:
            self.bus.run(StartTask(waiting[0].id), Actor(logged.actor_id, ActorType.AGENT), cause_id=logged.id, environment_id=logged.environment_id)


class OwnAssignerModule(Module):
    """A module of another suite with its own way of handing out tasks."""

    name = "assignersample"
    seed_reason = "a sample"
    move_reason = "a sample"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.tasks"]
    listeners = [OldestTaskFirstListener]
