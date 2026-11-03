from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.plans.commands.make_task_in_phase.make_task_in_phase import MakeTaskInPhase
from core.modules.plans.commands.place_phase.place_phase import PlacePhase
from core.modules.tasks.models.task import Task


class MakeTaskInPhaseHandler(Handler[MakeTaskInPhase, Task]):
    """Creates and places a task through the commands that own those writes."""

    command = MakeTaskInPhase

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, command: MakeTaskInPhase, context: Context) -> Task:
        task = self.bus.dispatch(command.task, context)
        self.bus.dispatch(PlacePhase(task.id, command.phase_id), context)
        return task
