from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.plans.commands.make_planned_task.make_planned_task import MakePlannedTask
from core.modules.plans.commands.place_phase.place_phase import PlacePhase
from core.modules.tasks.models.task import Task


class MakePlannedTaskHandler(Handler[MakePlannedTask, Task]):
    """Creates and places a task through the commands that own those writes."""

    command = MakePlannedTask

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, command: MakePlannedTask, context: Context) -> Task:
        task = self.bus.dispatch(command.task, context)
        self.bus.dispatch(PlacePhase(task.id, command.phase_id), context)
        return task
