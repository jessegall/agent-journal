from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.process.leftover_process import LeftoverProcess
from core.modules.agents.commands.report_unused_launcher.report_unused_launcher import ReportUnusedLauncher
from core.modules.agents.commands.stop_unused_launcher.stop_unused_launcher import StopUnusedLauncher
from core.modules.agents.support.launcher_processes import LauncherProcesses


class StopUnusedLauncherHandler(Handler[StopUnusedLauncher, None]):
    """Stops a second launcher the first time it is reported: a pair of launchers already told to the person
    is left alone, so a process that does not go is not signalled on every tick."""

    command = StopUnusedLauncher

    def __init__(self, bus: Bus, processes: LauncherProcesses) -> None:
        self.bus, self.processes = bus, processes

    def handle(self, command: StopUnusedLauncher, context: Context) -> None:
        if self.bus.dispatch(ReportUnusedLauncher(command.serving_pid, command.unused_pid), context):
            LeftoverProcess.stop(command.unused_pid, self.processes.program)
