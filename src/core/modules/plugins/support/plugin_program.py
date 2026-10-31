import json
import os
import signal
import subprocess

from core.base.journal_home import JournalHome
from core.modules.plugins.support.plugin_answer import PluginAnswer
from core.modules.plugins.support.plugin_call import PluginCall
from core.modules.plugins.support.plugin_fault_error import PluginFaultError
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_late_error import PluginLateError
from core.modules.plugins.support.plugin_socket import PluginSocket
from core.modules.plugins.support.plugin_socket_paths import PluginSocketPaths

PASSED_VARIABLES = ("HOME", "LANG", "LC_ALL", "TMPDIR", "USER")
PROGRAM_PATH = "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin"
SETTINGS_FILE = ".journal-settings.json"
STOP_LIMIT_SECONDS = 1


class PluginProgram:
    """Runs a plugin's program for one event, as version 4 did: in its folder and a process group of its
    own, the line on its input, a clean environment naming its folders and settings, and a time limit
    past which it is stopped; a late run, an error code or an answer that is not JSON is raised as the
    plugin's fault. A plugin whose answering service has its socket open is asked there instead, and the
    program answers once it is gone."""

    def __init__(self, home: JournalHome, folders: PluginFolders, sockets: PluginSocketPaths) -> None:
        self.home, self.folders, self.sockets = home, folders, sockets

    def run(self, call: PluginCall, limit_ms: int) -> PluginAnswer:
        manifest = call.manifest
        folder, data = self.folders.code(manifest.name), self.folders.data(manifest.name)
        data.mkdir(parents=True, exist_ok=True)
        (data / SETTINGS_FILE).write_text(json.dumps(dict(call.settings)))
        line = json.dumps({"v": 1, "event": call.event.name, "at": call.timestamp.text, "environment": call.environment, "data": dict(call.event.data)})
        socket_services = [service.name for service in manifest.services if service.answers]
        if socket_services and (service_socket := PluginSocket(self.sockets.answers(manifest.name, socket_services[0]))).is_open():
            try:
                return PluginAnswer.parsed(service_socket.ask(line, limit_ms))
            except (ConnectionError, FileNotFoundError):
                pass
            except json.JSONDecodeError:
                raise PluginFaultError("its service's answer is not JSON") from None
        process = subprocess.Popen([str(folder / manifest.program)], cwd=folder, env=self.environment(manifest.name, call.environment), stdin=subprocess.PIPE,
                                   stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, start_new_session=True)
        try:
            output, _ = process.communicate(line + "\n", timeout=limit_ms / 1000)
        except subprocess.TimeoutExpired:
            self.stop(process)
            raise PluginLateError(f"it ran past {limit_ms} ms") from None
        if process.returncode != 0:
            raise PluginFaultError(f"it ended with code {process.returncode}")
        try:
            return PluginAnswer.parsed(output)
        except json.JSONDecodeError:
            raise PluginFaultError("its answer is not JSON") from None

    @staticmethod
    def stop(process: "subprocess.Popen[str]") -> None:
        os.killpg(process.pid, signal.SIGKILL)
        try:
            process.communicate(timeout=STOP_LIMIT_SECONDS)
        except subprocess.TimeoutExpired:
            for pipe in (process.stdin, process.stdout):
                if pipe is not None:
                    pipe.close()

    def environment(self, plugin_name: str, environment: str) -> dict[str, str]:
        passed = {variable: os.environ[variable] for variable in PASSED_VARIABLES if variable in os.environ}
        code, data, journal = self.folders.code(plugin_name).resolve(), self.folders.data(plugin_name).resolve(), self.home.folder.resolve()
        return {**passed, "PATH": f"{journal / 'bin'}:{PROGRAM_PATH}", "JOURNAL_ROOT": str(journal.parent), "JOURNAL_ENV": environment, "JOURNAL_PLUGIN": plugin_name,
                "JOURNAL_PLUGIN_DIR": str(code), "JOURNAL_PLUGIN_DATA": str(data), "JOURNAL_SETTINGS": str(data / SETTINGS_FILE)}
