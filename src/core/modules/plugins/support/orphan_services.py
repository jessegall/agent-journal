import subprocess

from engine.caller.process_table import PS_ENVIRONMENT, PS_TIMEOUT_SECONDS
from engine.process.leftover_process import LeftoverProcess
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.runnable_plugins import RunnablePlugins
from core.modules.plugins.support.service_processes import ServiceProcesses

COMMAND_LINES = ["ps", "-A", "-ww", "-o", "pid=,ppid=,command="]
INIT_PROCESS_ID = 1
PROGRAM_POSITIONS = 2


class OrphanServices:
    """Stops a process left over beside a running plugin service: one with no parent, running exactly that
    service's command from this project's plugin folder, that is not the process the journal supervises."""

    def __init__(self, runnable: RunnablePlugins, folders: PluginFolders) -> None:
        self.runnable, self.folders = runnable, folders

    def stop(self, processes: ServiceProcesses) -> None:
        commands = [[str(self.folders.code(item.plugin.name) / service.command[0]), *service.command[1:]] for item in self.runnable.running() for service in item.manifest.services if (item.plugin.name, service.name) in processes.running]
        supervised = {process.pid for process in processes.running.values()}
        for pid, command_parts in self.parentless():
            program = next((command[0] for command in commands if pid not in supervised and self.runs(command_parts, command)), None)
            if program is not None:
                LeftoverProcess.stop(pid, program)

    @staticmethod
    def runs(command_parts: list[str], command: list[str]) -> bool:
        return any(command_parts[index:] == command for index in range(PROGRAM_POSITIONS))

    @staticmethod
    def parentless() -> list[tuple[int, list[str]]]:
        listing = subprocess.run(COMMAND_LINES, capture_output=True, text=True, check=False, timeout=PS_TIMEOUT_SECONDS, env=PS_ENVIRONMENT).stdout
        rows = [line.split() for line in listing.splitlines()]
        return [(int(row[0]), row[2:]) for row in rows if len(row) > 2 and int(row[1]) == INIT_PROCESS_ID]
