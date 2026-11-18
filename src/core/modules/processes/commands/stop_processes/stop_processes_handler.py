from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.processes.commands.stop_process.stop_process import StopProcess
from core.modules.processes.commands.stop_processes.stop_processes import StopProcesses
from core.modules.processes.models.process import Process


class StopProcessesHandler(Handler[StopProcesses, tuple[Process, ...]]):
    """Stops each named process in turn."""

    command = StopProcesses

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, command: StopProcesses, context: Context) -> tuple[Process, ...]:
        return tuple(self.bus.dispatch(StopProcess(row_id), context) for row_id in dict.fromkeys(command.row_ids))
