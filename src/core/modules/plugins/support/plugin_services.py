import subprocess
import time
from datetime import timedelta
from pathlib import Path

from core.base.child_process import ChildProcess
from core.base.clock import Clock
from core.base.leftover_process import LeftoverProcess
from core.modules.plugins.models.enums.service_restart import ServiceRestart
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.service_fault import ServiceFault
from core.modules.plugins.support.manifest_service import ManifestService
from core.modules.plugins.support.plugin_fault_error import PluginFaultError
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_health import PluginHealth
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_program import PluginProgram
from core.modules.plugins.support.plugin_socket import PluginSocket
from core.modules.plugins.support.plugin_socket_paths import PluginSocketPaths
from core.modules.plugins.support.service_processes import STOP_LIMIT_SECONDS, ServiceProcesses
from core.modules.settings.bindings.support.setting_values import SettingValues

CONDITION_LIMIT_SETTING = "journal.core.plugins.condition_limit_seconds"
CONDITION_RECHECK = timedelta(minutes=10)
SOCKET_LIMIT_SECONDS = 5
SOCKET_POLL_SECONDS = 0.02
HEALTH_LIMIT_MS = 200


class PluginServices:
    """Keeps the services of the plugins switched on running beside the journal: each started where its
    condition passes, a condition past its limit a fault and one that failed checked again after ten minutes;
    started again by its restart rule once it ended, an answering one counted as started once its socket is
    up, and each stopped once its plugin is switched off or removed; a service that misses its health check is
    started again and named; a service a crashed server left running is stopped, by the pid kept for it,
    before its new one starts."""

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, program: PluginProgram, sockets: PluginSocketPaths, setting_values: SettingValues,
                 clock: Clock) -> None:
        self.plugins, self.folders, self.program, self.sockets, self.setting_values, self.clock = plugins, folders, program, sockets, setting_values, clock

    def follow(self, processes: ServiceProcesses) -> list[ServiceFault]:
        wanted: set[tuple[str, str]] = set()
        faults: list[ServiceFault] = []
        for plugin in self.plugins.enabled_ones():
            folder = self.folders.code(plugin.name)
            manifest = PluginManifest.read(folder)
            for service in manifest.services:
                key = (plugin.name, service.name)
                wanted.add(key)
                if self.is_checkable(processes, key):
                    faults.extend(ServiceFault(plugin, fault) for fault in self.keep(processes, key, folder, service, manifest))
        for key in [key for key in processes.running if key not in wanted]:
            processes.running.pop(key).stop_group(STOP_LIMIT_SECONDS)
        return faults

    def is_checkable(self, processes: ServiceProcesses, key: tuple[str, str]) -> bool:
        return key not in processes.skipped or self.clock.timestamp().value - processes.skipped[key].value > CONDITION_RECHECK

    def keep(self, processes: ServiceProcesses, key: tuple[str, str], folder: Path, service: ManifestService, manifest: PluginManifest) -> list[str]:
        process = processes.running.get(key)
        if process is not None and (process.running() or service.restart is ServiceRestart.STOPPED_END or (service.restart is ServiceRestart.FAILED_END and process.exit_code() == 0)):
            return []
        environment = self.environment(key, manifest)
        if process is None and service.condition:
            limit_seconds = self.setting_values.number(CONDITION_LIMIT_SETTING, None)
            try:
                passed = subprocess.run(["sh", "-c", service.condition], cwd=folder, env=environment, capture_output=True, timeout=limit_seconds).returncode == 0
            except subprocess.TimeoutExpired:
                processes.skipped[key] = self.clock.timestamp()
                return [f"the condition of its service {service.name} ran past {limit_seconds} s"]
            if not passed:
                processes.skipped[key] = self.clock.timestamp()
                return []
            processes.skipped.pop(key, None)
        self.sockets.folder.mkdir(parents=True, exist_ok=True)
        program, pid_file = str(folder / service.command[0]), self.sockets.pid(*key)
        if process is None and pid_file.is_file():
            LeftoverProcess.stop(int(pid_file.read_text()), program)
        processes.running[key] = ChildProcess(subprocess.Popen([program, *service.command[1:]], cwd=folder, env=environment, stdin=subprocess.DEVNULL,
                                                               stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True))
        pid_file.write_text(str(processes.running[key].pid))
        if service.answers:
            self.poll_socket(self.sockets.answers(*key), processes.running[key])
        return []

    def poll_socket(self, path: Path, process: ChildProcess) -> None:
        deadline = time.monotonic() + SOCKET_LIMIT_SECONDS
        while self.is_starting(path, process, deadline):
            time.sleep(SOCKET_POLL_SECONDS)

    @staticmethod
    def is_starting(path: Path, process: ChildProcess, deadline: float) -> bool:
        return not path.is_socket() and process.running() and time.monotonic() < deadline

    def environment(self, key: tuple[str, str], manifest: PluginManifest) -> dict[str, str]:
        plugin_name, service = key
        health = {manifest.health.socket_variable: str(self.sockets.health(plugin_name, service))} if manifest.health else {}
        return {**self.program.environment(plugin_name, ""), "JOURNAL_PLUGIN_SOCKET": str(self.sockets.answers(plugin_name, service)), **health}

    def check_health(self, processes: ServiceProcesses) -> list[ServiceFault]:
        misses: list[ServiceFault] = []
        for plugin in self.plugins.enabled_ones():
            folder = self.folders.code(plugin.name)
            manifest = PluginManifest.read(folder)
            for service in [service for service in manifest.services if (plugin.name, service.name) in processes.running]:
                path = self.sockets.health(plugin.name, service.name)
                if manifest.health is None or not path.is_socket():
                    continue
                if self.is_healthy(path, manifest.health):
                    continue
                processes.running.pop((plugin.name, service.name)).stop_group(STOP_LIMIT_SECONDS)
                self.keep(processes, (plugin.name, service.name), folder, service, manifest)
                misses.append(ServiceFault(plugin, f"its service {service.name} missed its health check"))
        return misses

    @staticmethod
    def is_healthy(path: Path, health: PluginHealth) -> bool:
        try:
            return health.matches(PluginSocket(path).ask(health.request, HEALTH_LIMIT_MS))
        except (PluginFaultError, OSError):
            return False
