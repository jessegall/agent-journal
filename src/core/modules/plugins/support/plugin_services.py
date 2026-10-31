import subprocess
import time
from pathlib import Path

from core.base.child_process import ChildProcess
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.manifest_service import ManifestService
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_program import PluginProgram
from core.modules.plugins.support.plugin_socket_paths import PluginSocketPaths
from core.modules.plugins.support.service_processes import STOP_LIMIT_SECONDS, ServiceProcesses

CONDITION_LIMIT_SECONDS = 10
SOCKET_LIMIT_SECONDS = 5
SOCKET_POLL_SECONDS = 0.02


class PluginServices:
    """Keeps the services of the plugins switched on running beside the journal: each started where its
    condition passes, started again by its restart rule once it ended, an answering one counted as started
    once its socket is up, and each stopped once its plugin is switched off or removed."""

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, program: PluginProgram, sockets: PluginSocketPaths) -> None:
        self.plugins, self.folders, self.program, self.sockets = plugins, folders, program, sockets

    def follow(self, processes: ServiceProcesses) -> None:
        wanted: set[tuple[str, str]] = set()
        for plugin in self.plugins.enabled_ones():
            folder = self.folders.code(plugin.name)
            for service in PluginManifest.read(folder).services:
                key = (plugin.name, service.name)
                wanted.add(key)
                if key not in processes.skipped:
                    self.keep(processes, key, folder, service)
        for key in [key for key in processes.running if key not in wanted]:
            processes.running.pop(key).stop(STOP_LIMIT_SECONDS)

    def keep(self, processes: ServiceProcesses, key: tuple[str, str], folder: Path, service: ManifestService) -> None:
        process = processes.running.get(key)
        if process is not None and (process.running() or service.restart == "never" or (service.restart == "on-failure" and process.exit_code() == 0)):
            return
        environment = self.environment(key)
        if process is None and service.condition and subprocess.run(["sh", "-c", service.condition], cwd=folder, env=environment, capture_output=True,
                                                                      timeout=CONDITION_LIMIT_SECONDS).returncode != 0:
            processes.skipped.add(key)
            return
        self.sockets.folder.mkdir(parents=True, exist_ok=True)
        processes.running[key] = ChildProcess(subprocess.Popen([str(folder / service.command[0]), *service.command[1:]], cwd=folder, env=environment,
                                                               stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                                                               start_new_session=True))
        if service.answers:
            self.poll_socket(self.sockets.answers(*key), processes.running[key])

    def poll_socket(self, path: Path, process: ChildProcess) -> None:
        deadline = time.monotonic() + SOCKET_LIMIT_SECONDS
        while self.is_starting(path, process, deadline):
            time.sleep(SOCKET_POLL_SECONDS)

    @staticmethod
    def is_starting(path: Path, process: ChildProcess, deadline: float) -> bool:
        return not path.is_socket() and process.running() and time.monotonic() < deadline

    def environment(self, key: tuple[str, str]) -> dict[str, str]:
        plugin_name, service = key
        return {**self.program.environment(plugin_name, ""), "JOURNAL_PLUGIN_SOCKET": str(self.sockets.answers(plugin_name, service))}
