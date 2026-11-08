from core.base.file_access import FileAccess
import subprocess
import time
from threading import Thread
from datetime import timedelta
from pathlib import Path

from core.base.child_process import ChildProcess
from core.base.clock import Clock
from core.base.leftover_process import LeftoverProcess
from core.base.plugin_script_processes import PluginScriptProcesses
from core.base.system_log_writer import SystemLogWriter
from core.base.driver.command_category import CommandCategory
from core.base.log_level import LogLevel
from core.modules.plugins.models.enums.service_restart import ServiceRestart
from core.modules.plugins.support.runnable_plugins import RunnablePlugins
from core.modules.plugins.support.service_fault import ServiceFault
from core.modules.plugins.support.manifest_service import ManifestService
from core.modules.plugins.support.plugin_fault_error import PluginFaultError
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_health import PluginHealth
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_places import PluginPlaces
from core.modules.plugins.support.plugin_program import PluginProgram
from core.modules.plugins.support.plugin_socket import PluginSocket
from core.modules.plugins.support.plugin_socket_paths import PluginSocketPaths
from core.modules.plugins.support.service_processes import ServiceProcesses
from core.modules.settings.bindings.support.setting_values import SettingValues

CONDITION_LIMIT_SETTING = "journal.core.plugins.condition_limit_seconds"
CONDITION_RECHECK = timedelta(minutes=10)
SOCKET_LIMIT_SECONDS = 5
SOCKET_POLL_SECONDS = 0.02
HEALTH_LIMIT_MS = 200
SERVICE_LOG_LIMIT_BYTES = 1_000_000


class PluginServices:
    """Keeps the services of the plugins switched on running beside the journal: each started where its
    condition passes, a condition past its limit a fault and one that failed checked again after ten
    minutes; started again by its restart rule once it ended, an answering one counted as started once its
    socket and its health socket are up, and each stopped once its plugin is switched off or removed; a
    service that misses its health check is started again and named; a service a crashed server left
    running is stopped, by the pid kept for it, before its new one starts."""

    def __init__(self, runnable: RunnablePlugins, folders: PluginFolders, program: PluginProgram, sockets: PluginSocketPaths, setting_values: SettingValues,
                 clock: Clock, scripts: PluginScriptProcesses, system_log: SystemLogWriter, places: PluginPlaces) -> None:
        self.runnable, self.folders, self.program, self.sockets, self.setting_values, self.clock, self.scripts = runnable, folders, program, sockets, setting_values, clock, scripts
        self.system_log, self.places = system_log, places

    def follow(self, processes: ServiceProcesses) -> list[ServiceFault]:
        wanted: set[tuple[str, str]] = set()
        faults: list[ServiceFault] = []
        for runnable in self.runnable.running():
            plugin, manifest = runnable.plugin, runnable.manifest
            folder = self.folders.code(plugin.name)
            for service in manifest.services:
                key = (plugin.name, service.name)
                wanted.add(key)
                if key in processes.running and processes.digests.get(key, plugin.files_digest) != plugin.files_digest:
                    processes.stop(key, self.places)
                    self.sockets.pid(*key).unlink(missing_ok=True)
                if self.is_checkable(processes, key):
                    faults.extend(ServiceFault(plugin, fault) for fault in self.keep(processes, key, folder, service, manifest, plugin.files_digest))
        for key in [key for key in processes.running if key not in wanted]:
            processes.stop(key, self.places)
        self.scripts.keep_services({process.pid: plugin_name for (plugin_name, _), process in processes.running.items()})
        return faults

    def is_checkable(self, processes: ServiceProcesses, key: tuple[str, str]) -> bool:
        return key not in processes.skipped or self.clock.timestamp().value - processes.skipped[key].value > CONDITION_RECHECK

    def keep(self, processes: ServiceProcesses, key: tuple[str, str], folder: Path, service: ManifestService, manifest: PluginManifest, digest: str) -> list[str]:
        process = processes.running.get(key)
        if process is not None and (process.running() or service.restart is ServiceRestart.STOPPED_END or (service.restart is ServiceRestart.FAILED_END and process.exit_code() == 0)):
            return []
        if process is not None:
            self.system_log.write(LogLevel.WARNING, f"plugin {key[0]} service {key[1]} restarted after exit {process.exit_code()}")
            processes.leave(key, process.exit_code() or 0, self.places)
        environment = self.environment(key, manifest)
        if process is None and service.condition:
            limit_seconds = self.setting_values.project.number(CONDITION_LIMIT_SETTING)
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
            LeftoverProcess.stop(int(FileAccess.shared().read(pid_file)), program)
        for stale in (self.sockets.answers(*key), self.sockets.health(*key)):
            stale.unlink(missing_ok=True)
        log = self.folders.service_log(*key)
        log.parent.mkdir(parents=True, exist_ok=True)
        processes.places[key] = self.places.queue_place(key[0], " ".join([program, *service.command[1:]]), CommandCategory.BACKGROUND_JOB, str(folder), None, "")
        started = subprocess.Popen([program, *service.command[1:]], cwd=folder, env=environment, stdin=subprocess.DEVNULL,
                                   stdout=subprocess.PIPE, stderr=subprocess.STDOUT, start_new_session=True)
        processes.running[key] = ChildProcess(started)
        Thread(target=self.record_output, args=(started.stdout, log), daemon=True).start()
        FileAccess.shared().write(pid_file, str(processes.running[key].pid))
        processes.digests[key] = digest
        if service.answers:
            self.poll_socket(self.sockets.answers(*key), processes.running[key])
        if manifest.health:
            self.poll_socket(self.sockets.health(*key), processes.running[key])
        return []

    @staticmethod
    def record_output(stream, path: Path) -> None:
        while data := stream.read1(8192):
            access = FileAccess.shared()
            previous = access.binary(path) if path.is_file() else b""
            access.write_binary(path, (previous + data)[-SERVICE_LOG_LIMIT_BYTES:])

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
        for runnable in self.runnable.running():
            plugin, manifest = runnable.plugin, runnable.manifest
            folder = self.folders.code(plugin.name)
            for service in [service for service in manifest.services if (plugin.name, service.name) in processes.running]:
                path = self.sockets.health(plugin.name, service.name)
                if manifest.health is None:
                    continue
                if self.is_healthy(path, manifest.health):
                    continue
                self.system_log.write(LogLevel.WARNING, f"plugin {plugin.name} service {service.name} restarted after a missed health check")
                processes.stop((plugin.name, service.name), self.places)
                self.keep(processes, (plugin.name, service.name), folder, service, manifest, plugin.files_digest)
                misses.append(ServiceFault(plugin, f"its service {service.name} missed its health check"))
        return misses

    @staticmethod
    def is_healthy(path: Path, health: PluginHealth) -> bool:
        try:
            return health.matches(PluginSocket(path).ask(health.request, HEALTH_LIMIT_MS))
        except (PluginFaultError, OSError):
            return False
