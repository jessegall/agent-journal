from engine.file.file_access import FileAccess
from pathlib import Path
import json
import hashlib
import os
import signal
import subprocess
from collections.abc import Callable, Mapping

from engine.agent.agent_checkouts import AgentCheckouts
from engine.checkout.checkout import Checkout
from engine.event.event_log import HIDDEN
from engine.journal.journal_home import JournalHome
from engine.enums.event_form import EventForm
from engine.process.plugin_script_processes import PluginScriptProcesses
from engine.scope.environment_scope import EnvironmentScope
from engine.scope.scopes import Scopes
from engine.enums.script_stop import ScriptStop
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.agent_facts import AgentFacts
from core.modules.plugins.support.plugin_answer import PluginAnswer
from core.modules.plugins.support.plugin_call import PluginCall
from core.modules.plugins.errors.plugin_fault_error import PluginFaultError
from core.modules.plugins.errors.plugin_service_closed_error import PluginServiceClosedError
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.manifest_listener import SERVICE_PREFIX
from core.modules.plugins.support.plugin_manifest import LINE_VERSION
from core.modules.skills.support.loaded_skills import LoadedSkills
from core.modules.plugins.support.login_path import LoginPath
from core.modules.plugins.support.plugin_service_waits import PluginServiceWaits
from core.modules.plugins.support.plugin_socket import PluginSocket
from core.modules.plugins.support.plugin_socket_paths import PluginSocketPaths
from core.modules.plugins.errors.plugin_stopped_error import PluginStoppedError
from core.modules.plugins.support.script_pipes import ScriptPipes

PASSED_VARIABLES = ("HOME", "LANG", "LC_ALL", "TMPDIR", "USER")
SETTINGS_FILE = ".journal-settings.json"
STOP_LIMIT_SECONDS = 1


class PluginProgram:
    """Runs a plugin event through its service or a time-limited process."""

    def __init__(self, home: JournalHome, folders: PluginFolders, sockets: PluginSocketPaths, skills: LoadedSkills, checkouts: AgentCheckouts, scripts: PluginScriptProcesses, agents: AgentRows,
                 plugins: PluginQuery, scopes: Scopes, environments: EnvironmentRows, waits: PluginServiceWaits) -> None:
        self.waits = waits
        self.home, self.folders, self.sockets, self.skills, self.checkouts, self.scripts, self.agents = home, folders, sockets, skills, checkouts, scripts, agents
        self.plugins, self.scopes, self.environments = plugins, scopes, environments
        self.written_settings: dict[Path, str] = {}

    def run(self, call: PluginCall, limit_ms: int | None, wait_callback: Callable[[], None] | None = None) -> PluginAnswer:
        manifest = call.manifest
        folder = self.folders.code(manifest.name)
        self.write_settings(manifest.name, call.settings, call.environment)
        checkout, facts = self.checkout_and_facts(call)
        line = self.line_of(call, limit_ms, checkout, facts)
        if call.form is not EventForm.COMMIT:
            self.scripts.keep_line(manifest.name, line)
        explicit_service = call.script.removeprefix(SERVICE_PREFIX) if call.script.startswith(SERVICE_PREFIX) else ""
        socket_services = [service.name for service in manifest.services if service.answers]
        service_name = explicit_service or (socket_services[0] if socket_services and not call.script and limit_ms is not None else "")
        if service_name and (answer := self.service_answer(manifest.name, service_name, line, limit_ms)) is not None:
            return answer
        if call.hook_waits and service_name and not explicit_service:
            raise PluginServiceClosedError(f"its service {service_name} is closed, so the event went through unjudged")
        program = manifest.program if explicit_service else call.script or manifest.program
        if explicit_service and not program:
            raise PluginFaultError(f"its service {explicit_service} is not answering")
        if self.scripts.server_stopped:
            raise PluginStoppedError(ScriptStop.SERVER)
        return self.program_answer(call, program, line, limit_ms, wait_callback, checkout)

    def program_answer(self, call: PluginCall, program: str, line: str, limit_ms: int | None, wait_callback: Callable[[], None] | None, checkout: Checkout | None) -> PluginAnswer:
        manifest = call.manifest
        folder = self.folders.code(manifest.name)
        try:
            process = subprocess.Popen([str(folder / program)], cwd=folder, env={**self.environment(manifest.name, call.environment), **(checkout.root_variables() if checkout is not None else {})}, stdin=subprocess.PIPE,
                                       stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, start_new_session=True)
        except OSError as error:
            raise PluginFaultError(f"{program} could not start: {error.strerror}") from None
        self.scripts.start(process, manifest.name, call.event.name, call.form, call.timestamp)
        pipes = ScriptPipes(process, self.stop)
        try:
            output = pipes.answer(line, limit_ms, wait_callback)
            stop_reason = self.scripts.stop_reason(process)
        finally:
            self.scripts.finish(process)
        if stop_reason is not ScriptStop.STOP_FAILED:
            raise PluginStoppedError(stop_reason)
        if process.returncode != 0:
            raise PluginFaultError(self.ended_text(process.returncode, pipes.error_tail(), call))
        try:
            return PluginAnswer.parsed(output)
        except json.JSONDecodeError:
            raise PluginFaultError("its answer is not JSON") from None

    def service_answer(self, plugin: str, service: str, line: str, limit_ms: int | None) -> PluginAnswer | None:
        path = self.sockets.answers(plugin, service)
        service_socket = PluginSocket(path)
        if not service_socket.is_open():
            return None
        try:
            with self.waits.locked(path):
                return PluginAnswer.parsed(service_socket.ask(line, limit_ms))
        except (ConnectionError, FileNotFoundError):
            return None
        except json.JSONDecodeError:
            raise PluginFaultError("its service's answer is not JSON") from None

    @staticmethod
    def ended_text(code: int, errors: str, call: PluginCall) -> str:
        for value in call.settings.values():
            if str(value):
                errors = errors.replace(str(value), HIDDEN)
        return f"it ended with code {code}: {errors}" if errors else f"it ended with code {code}"

    def facts(self, agent_id: int | None, file_checkout: Checkout | None) -> AgentFacts:
        if agent_id is None:
            return AgentFacts(file_checkout)
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            return AgentFacts(file_checkout or self.checkouts.checkout(agent_id), self.agents.find(agent_id).role, tuple(self.skills.names(agent_id)))

    def granted_checkout(self, call: PluginCall) -> Checkout | None:
        environment = next((row for row in self.environments.all() if row.name == call.environment), None)
        if environment is None or call.agent_id is None or not environment.grants(call.agent_id):
            return None
        return Checkout.project_checkout(Path(environment.folder), environment.branch)

    def checkout_and_facts(self, call: PluginCall) -> tuple[Checkout | None, AgentFacts]:
        facts = call.facts if call.facts is not None else self.facts(call.agent_id, call.file_checkout)
        return call.file_checkout or self.granted_checkout(call) or facts.checkout, facts

    def line(self, call: PluginCall, limit_ms: int | None) -> str:
        checkout, facts = self.checkout_and_facts(call)
        return self.line_of(call, limit_ms, checkout, facts)

    def line_of(self, call: PluginCall, limit_ms: int | None, checkout: Checkout | None, facts: AgentFacts) -> str:
        fields = {"v": LINE_VERSION, "event": call.event.name, "at": call.timestamp.text, "environment": call.environment, "agent": call.agent_id, "role": facts.role, "window_ms": limit_ms,
                  "skills": list(facts.skills), "checkout": checkout.values() if checkout is not None else {}, "settings": dict(call.settings), "data": dict(call.event.data)}
        if call.events:
            fields["events"] = [{"event": event.name, "data": dict(event.data)} for event in call.events]
        if call.manifest.config is not None:
            fields["config"] = {"version": self.plugins.find_name(call.manifest.name).config_version}
        return json.dumps(fields)

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

    def settings_path(self, plugin_name: str, environment: str) -> Path:
        data = self.folders.data(plugin_name)
        if environment:
            data = data / "environments" / hashlib.sha256(environment.encode()).hexdigest()
        return data / SETTINGS_FILE

    def write_settings(self, plugin_name: str, settings: Mapping[str, object], environment: str = "") -> None:
        file, text = self.settings_path(plugin_name, environment), json.dumps(dict(settings))
        if self.written_settings.get(file) == text and file.is_file():
            return
        file.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(file, text)
        self.written_settings[file] = text

    def environment(self, plugin_name: str, environment: str) -> dict[str, str]:
        passed = {variable: os.environ[variable] for variable in PASSED_VARIABLES if variable in os.environ}
        code, data, journal = self.folders.code(plugin_name).resolve(), self.folders.data(plugin_name).resolve(), self.home.folder.resolve()
        return {**passed, "PATH": f"{journal / 'bin'}:{LoginPath(self.home).value()}", "JOURNAL_ROOT": str(journal.parent), "JOURNAL_ENV": environment, "JOURNAL_PLUGIN": plugin_name,
                "JOURNAL_PLUGIN_DIR": str(code), "JOURNAL_PLUGIN_DATA": str(data), "JOURNAL_SETTINGS": str(self.settings_path(plugin_name, environment))}
