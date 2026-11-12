from engine.file.file_access import FileAccess
import fcntl
import subprocess
import time
from collections.abc import Iterator
from contextlib import contextmanager
from datetime import timedelta
from pathlib import Path

from engine.process.adopted_process import AdoptedProcess
from engine.process.child_process import ChildProcess
from engine.time.clock import Clock
from engine.process.leftover_process import LeftoverProcess
from engine.process.plugin_script_processes import PluginScriptProcesses
from engine.log.system_log_writer import SystemLogWriter
from engine.enums.log_level import LogLevel
from core.modules.plugins.models.enums.service_restart import ServiceRestart
from core.modules.plugins.support.runnable_plugins import RunnablePlugins
from core.modules.plugins.support.condition_check import ConditionCheck
from core.modules.plugins.support.service_fault import ServiceFault
from core.modules.plugins.support.manifest_service import ManifestService
from core.modules.plugins.errors.plugin_fault_error import PluginFaultError
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_health import PluginHealth
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_program import PluginProgram
from core.modules.plugins.support.plugin_socket import PluginSocket
from core.modules.plugins.support.plugin_socket_paths import PluginSocketPaths
from core.modules.plugins.support.service_processes import ServiceProcesses
from engine.setting.setting_values import SettingValues

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
    service that misses its health check is started again and named. A service still running from the server
    before, with its plugin's files unchanged, is kept; any other one left running is stopped, by the pid kept
    for it, before its new one starts. One service has one process: the decision to keep the recorded process
    or to start a new one is made under a lock of that service, so two servers that start at the same moment,
    as after a reboot, end with one process, which the second one keeps."""

    def __init__(self, runnable: RunnablePlugins, folders: PluginFolders, program: PluginProgram, sockets: PluginSocketPaths, setting_values: SettingValues,
                 clock: Clock, scripts: PluginScriptProcesses, system_log: SystemLogWriter) -> None:
        self.runnable, self.folders, self.program, self.sockets, self.setting_values, self.clock, self.scripts = runnable, folders, program, sockets, setting_values, clock, scripts
        self.system_log = system_log

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
                    processes.stop(key)
                    self.sockets.pid(*key).unlink(missing_ok=True)
                if self.is_checkable(processes, key):
                    faults.extend(ServiceFault(plugin, fault) for fault in self.keep(processes, key, folder, service, manifest, plugin.files_digest))
        for key in [key for key in processes.running if key not in wanted]:
            processes.stop(key)
        processes.paused &= wanted
        self.scripts.keep_services({process.pid: plugin_name for (plugin_name, _), process in processes.running.items()})
        return faults

    def is_checkable(self, processes: ServiceProcesses, key: tuple[str, str]) -> bool:
        if key in processes.paused:
            return False
        is_condition_due = key not in processes.skipped or self.clock.timestamp().value - processes.skipped[key].value > CONDITION_RECHECK
        return is_condition_due and processes.retries.may_retry(key, self.clock.timestamp().value)

    def keep(self, processes: ServiceProcesses, key: tuple[str, str], folder: Path, service: ManifestService, manifest: PluginManifest, digest: str) -> list[str]:
        process = processes.running.get(key)
        if process is not None and process.running():
            processes.retries.forget_steady(key, self.clock.timestamp().value)
            return []
        if process is not None and (service.restart is ServiceRestart.STOPPED_END or (service.restart is ServiceRestart.FAILED_END and process.exit_code() == 0)):
            return []
        faults: list[str] = []
        if process is not None:
            self.system_log.write(LogLevel.WARNING, f"plugin {key[0]} service {key[1]} restarted after exit {process.exit_code()}")
            processes.running.pop(key)
            faults.extend(self.failure(processes, key, service, f"it ended with exit {process.exit_code()}"))
            if not processes.retries.may_retry(key, self.clock.timestamp().value):
                return faults
        program, pid_file = str(folder / service.command[0]), self.sockets.pid(*key)
        environment = self.environment(key, manifest)
        with self.start_lock(key):
            recorded_pid = int(FileAccess.shared().read(pid_file)) if pid_file.is_file() else None
            if recorded_pid is not None and self.is_kept(recorded_pid, pid_file, program, digest):
                processes.running[key], processes.digests[key] = AdoptedProcess(recorded_pid, program), digest
                return faults
            if process is None and service.condition:
                check = self.condition_check(processes, key, folder, service, environment)
                if not check.is_passed:
                    return [*faults, *check.faults]
            if recorded_pid is not None:
                LeftoverProcess.stop(recorded_pid, program)
            try:
                self.start(processes, key, folder, service, manifest, digest, environment)
            except OSError as error:
                self.system_log.write(LogLevel.WARNING, f"plugin {key[0]} service {key[1]} could not start: {error}")
                return [*faults, *self.failure(processes, key, service, f"it could not start: {error}")]
        processes.retries.record_start(key, self.clock.timestamp().value)
        return faults

    def condition_check(self, processes: ServiceProcesses, key: tuple[str, str], folder: Path, service: ManifestService, environment: dict[str, str]) -> ConditionCheck:
        limit_seconds = self.setting_values.project.number(CONDITION_LIMIT_SETTING)
        try:
            passed = subprocess.run(["sh", "-c", service.condition], cwd=folder, env=environment, capture_output=True, timeout=limit_seconds).returncode == 0
        except subprocess.TimeoutExpired:
            processes.skipped[key] = self.clock.timestamp()
            return ConditionCheck(False, tuple([f"the condition of its service {service.name} ran past {limit_seconds} s"]))
        if not passed:
            processes.skipped[key] = self.clock.timestamp()
            return ConditionCheck(False)
        processes.skipped.pop(key, None)
        return ConditionCheck(True)

    @contextmanager
    def start_lock(self, key: tuple[str, str]) -> Iterator[None]:
        self.sockets.folder.mkdir(parents=True, exist_ok=True)
        pid_file = self.sockets.pid(*key)
        with FileAccess.shared().writer(pid_file.with_name(f"{pid_file.name}.lock"), "a") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            yield

    def failure(self, processes: ServiceProcesses, key: tuple[str, str], service: ManifestService, reason: str) -> list[str]:
        is_repeated_failure = processes.retries.record_failure(key, self.clock.timestamp().value)
        return [f"its service {service.name} keeps failing to run: {reason}"] if is_repeated_failure else []

    def start(self, processes: ServiceProcesses, key: tuple[str, str], folder: Path, service: ManifestService, manifest: PluginManifest, digest: str, environment: dict[str, str]) -> None:
        program, pid_file = str(folder / service.command[0]), self.sockets.pid(*key)
        self.sockets.folder.mkdir(parents=True, exist_ok=True)
        for stale in (self.sockets.answers(*key), self.sockets.health(*key)):
            stale.unlink(missing_ok=True)
        log = self.folders.service_log(*key)
        log.parent.mkdir(parents=True, exist_ok=True)
        self.trim_log(log)
        with FileAccess.shared().writer(log, "ab") as output:
            started = subprocess.Popen([program, *service.command[1:]], cwd=folder, env=environment, stdin=subprocess.DEVNULL, stdout=output, stderr=subprocess.STDOUT, start_new_session=True)
        processes.running[key] = ChildProcess(started)
        FileAccess.shared().write(pid_file, str(processes.running[key].pid))
        FileAccess.shared().write(self.digest_file(pid_file), digest)
        processes.digests[key] = digest
        if service.answers:
            self.poll_socket(self.sockets.answers(*key), processes.running[key])
        if manifest.health:
            self.poll_socket(self.sockets.health(*key), processes.running[key])

    def is_kept(self, pid: int, pid_file: Path, program: str, digest: str) -> bool:
        digest_file = self.digest_file(pid_file)
        if not digest_file.is_file() or FileAccess.shared().read(digest_file) != digest:
            return False
        return LeftoverProcess.is_running(pid) and LeftoverProcess.runs_program(pid, program)

    @staticmethod
    def digest_file(pid_file: Path) -> Path:
        return pid_file.with_name(f"{pid_file.name}.digest")

    @staticmethod
    def trim_log(path: Path) -> None:
        access = FileAccess.shared()
        if path.is_file() and path.stat().st_size > SERVICE_LOG_LIMIT_BYTES:
            access.write_binary(path, access.binary(path)[-SERVICE_LOG_LIMIT_BYTES:])

    def poll_socket(self, path: Path, process: ChildProcess | AdoptedProcess) -> None:
        deadline = time.monotonic() + SOCKET_LIMIT_SECONDS
        while self.is_starting(path, process, deadline):
            time.sleep(SOCKET_POLL_SECONDS)

    @staticmethod
    def is_starting(path: Path, process: ChildProcess | AdoptedProcess, deadline: float) -> bool:
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
                processes.stop((plugin.name, service.name))
                self.keep(processes, (plugin.name, service.name), folder, service, manifest, plugin.files_digest)
                misses.append(ServiceFault(plugin, f"its service {service.name} missed its health check"))
        return misses

    @staticmethod
    def is_healthy(path: Path, health: PluginHealth) -> bool:
        try:
            return health.matches(PluginSocket(path).ask(health.request, HEALTH_LIMIT_MS))
        except (PluginFaultError, OSError):
            return False
