from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.plans.commands.make_planned_task.make_planned_task import MakePlannedTask
from core.modules.plans.commands.place_phase.place_phase import PlacePhase
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_tags import TaskTags


class MakePlannedTaskHandler(Handler[MakePlannedTask, Task]):
    """Creates and places a task through the commands that own those writes."""

    command = MakePlannedTask

    def __init__(self, bus: Bus, tags: TaskTags) -> None:
        self.bus, self.tags = bus, tags

    def handle(self, command: MakePlannedTask, context: Context) -> Task:
        task = self.bus.dispatch(command.task, context)
        if command.phase_id is not None:
            self.bus.dispatch(PlacePhase(task.id, command.phase_id), context)
        self.tags.add(task, command.tags, context)
        return task
