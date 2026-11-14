from engine.caller.process_table import ProcessTable
from engine.process.leftover_process import LeftoverProcess
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.runnable_plugins import RunnablePlugins
from core.modules.plugins.support.service_processes import ServiceProcesses

PROGRAM_POSITIONS = 2


class OrphanServices:
    """Stops every second process of a running plugin service: one that runs exactly that service's command
    from this project's plugin folder and is neither the process the journal supervises nor a child of it,
    whoever started it. One service has one process."""

    def __init__(self, runnable: RunnablePlugins, folders: PluginFolders) -> None:
        self.runnable, self.folders = runnable, folders

    def stop(self, processes: ServiceProcesses) -> None:
        commands = [[str(self.folders.code(item.plugin.name) / service.command[0]), *service.command[1:]] for item in self.runnable.running() for service in item.manifest.services if (item.plugin.name, service.name) in processes.running]
        supervised = {process.pid for process in processes.running.values()}
        for pid, parent_pid, command_parts in self.listed():
            if pid in supervised or parent_pid in supervised:
                continue
            program = next((command[0] for command in commands if self.runs(command_parts, command)), None)
            if program is not None:
                LeftoverProcess.stop(pid, program)

    @staticmethod
    def runs(command_parts: list[str], command: list[str]) -> bool:
        return any(command_parts[index:] == command for index in range(PROGRAM_POSITIONS))

    @staticmethod
    def listed() -> list[tuple[int, int, list[str]]]:
        return [(process.pid, process.parent_pid, list(process.command_parts)) for process in ProcessTable().commands()]
