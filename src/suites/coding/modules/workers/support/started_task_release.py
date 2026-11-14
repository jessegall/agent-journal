from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.query.queries import Queries
from core.modules.tasks.commands.release_task.release_task import ReleaseTask
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task


class StartedTaskRelease:
    """A task the sender holds started, such as one the journal started for the main agent after it was filed, is
    released when the sender sends it to a worker, so the worker gets it."""

    def __init__(self, queries: Queries, bus: Bus) -> None:
        self.queries, self.bus = queries, bus

    def released(self, tasks: list[Task], actor: Actor, environment_id: int | None) -> list[Task]:
        started = [task for task in tasks if self.sender_started(task, actor)]
        for task in started:
            self.bus.run(ReleaseTask(task.id, "sent to a worker"), actor, environment_id=environment_id)
        return self.queries.query(Task).find_many([task.id for task in tasks]) if started else tasks

    @staticmethod
    def sender_started(task: Task, actor: Actor) -> bool:
        return task.state is TaskState.STARTED and task.holder_id == actor.id
