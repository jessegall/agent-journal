from core.base.file_access import FileAccess
import json
import os
import signal
import subprocess
from collections.abc import Callable, Mapping

from core.base.agent_checkouts import AgentCheckouts
from core.base.change.event_log import HIDDEN
from core.base.journal_home import JournalHome
from core.base.model.event_form import EventForm
from core.base.running_scripts import RunningScripts
from core.modules.plugins.support.plugin_answer import PluginAnswer
from core.modules.plugins.support.plugin_call import PluginCall
from core.modules.plugins.support.plugin_fault_error import PluginFaultError
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import LINE_VERSION
from core.modules.skills.support.loaded_skills import LoadedSkills
from core.modules.plugins.support.login_path import LoginPath
from core.modules.plugins.support.plugin_socket import PluginSocket
from core.modules.plugins.support.plugin_socket_paths import PluginSocketPaths
from core.modules.plugins.support.plugin_stopped_error import PluginStoppedError
from core.modules.plugins.support.script_pipes import ScriptPipes

PASSED_VARIABLES = ("HOME", "LANG", "LC_ALL", "TMPDIR", "USER")
SETTINGS_FILE = ".journal-settings.json"
STOP_LIMIT_SECONDS = 1


class PluginProgram:
    """Runs a plugin's program for one event, as version 4 did: in its folder and a process group of its
    own, the line on its input, a clean environment naming its folders and settings, and a time limit
    past which it is stopped; a late run, an error code or an answer that is not JSON is raised as the
    plugin's fault. A plugin whose answering service has its socket open is asked there instead, and the
    program answers once it is gone."""

    def __init__(self, home: JournalHome, folders: PluginFolders, sockets: PluginSocketPaths, skills: LoadedSkills, checkouts: AgentCheckouts, scripts: RunningScripts) -> None:
        self.home, self.folders, self.sockets, self.skills, self.checkouts, self.scripts = home, folders, sockets, skills, checkouts, scripts

    def run(self, call: PluginCall, limit_ms: int | None, on_wait: Callable[[], None] | None = None) -> PluginAnswer:
        manifest = call.manifest
        folder = self.folders.code(manifest.name)
        self.write_settings(manifest.name, call.settings)
        line = self.line(call)
        if call.form is not EventForm.COMMIT:
            self.scripts.keep_line(manifest.name, line)
        socket_services = [service.name for service in manifest.services if service.answers]
        if not call.script and limit_ms is not None and socket_services and (service_socket := PluginSocket(self.sockets.answers(manifest.name, socket_services[0]))).is_open():
            try:
                return PluginAnswer.parsed(service_socket.ask(line, limit_ms))
            except (ConnectionError, FileNotFoundError):
                pass
            except json.JSONDecodeError:
                raise PluginFaultError("its service's answer is not JSON") from None
        program = call.script or manifest.program
        try:
            process = subprocess.Popen([str(folder / program)], cwd=folder, env=self.environment(manifest.name, call.environment), stdin=subprocess.PIPE,
                                       stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, start_new_session=True)
        except OSError as error:
            raise PluginFaultError(f"{program} could not start: {error.strerror}") from None
        self.scripts.start(process, manifest.name, call.event.name, call.form, call.timestamp)
        pipes = ScriptPipes(process, self.stop)
        try:
            output = pipes.answer(line, limit_ms, on_wait)
            stop_reason = self.scripts.stop_reason(process)
        finally:
            self.scripts.finish(process)
        if stop_reason:
            raise PluginStoppedError.because(stop_reason)
        if process.returncode != 0:
            raise PluginFaultError(self.ended_text(process.returncode, pipes.error_tail(), call))
        try:
            return PluginAnswer.parsed(output)
        except json.JSONDecodeError:
            raise PluginFaultError("its answer is not JSON") from None

    @staticmethod
    def ended_text(code: int, errors: str, call: PluginCall) -> str:
        for value in call.settings.values():
            if str(value):
                errors = errors.replace(str(value), HIDDEN)
        return f"it ended with code {code}: {errors}" if errors else f"it ended with code {code}"

    def line(self, call: PluginCall) -> str:
        skills = self.skills.names(call.agent_id) if call.agent_id is not None else ()
        checkout = call.file_checkout or (self.checkouts.checkout(call.agent_id) if call.agent_id is not None else None)
        return json.dumps({"v": LINE_VERSION, "event": call.event.name, "at": call.timestamp.text, "environment": call.environment, "agent": call.agent_id, "skills": list(skills), "checkout": checkout.values() if checkout is not None else {}, "data": dict(call.event.data)})

    @staticmethod
    def stop(process: "subprocess.Popen[str]") -> None:
        try:
            os.killpg(process.pid, signal.SIGKILL)
        except (ProcessLookupError, PermissionError):
            return
        finally:
            try:
                process.communicate(timeout=STOP_LIMIT_SECONDS)
            except (subprocess.TimeoutExpired, ValueError):
                for pipe in (process.stdin, process.stdout):
                    if pipe is not None:
                        pipe.close()

    def write_settings(self, plugin_name: str, settings: Mapping[str, object]) -> None:
        data = self.folders.data(plugin_name)
        data.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(data / SETTINGS_FILE, json.dumps(dict(settings)))

    def environment(self, plugin_name: str, environment: str) -> dict[str, str]:
        passed = {variable: os.environ[variable] for variable in PASSED_VARIABLES if variable in os.environ}
        code, data, journal = self.folders.code(plugin_name).resolve(), self.folders.data(plugin_name).resolve(), self.home.folder.resolve()
        return {**passed, "PATH": f"{journal / 'bin'}:{LoginPath(self.home).value()}", "JOURNAL_ROOT": str(journal.parent), "JOURNAL_ENV": environment, "JOURNAL_PLUGIN": plugin_name,
                "JOURNAL_PLUGIN_DIR": str(code), "JOURNAL_PLUGIN_DATA": str(data), "JOURNAL_SETTINGS": str(data / SETTINGS_FILE)}
