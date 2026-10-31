import json
import os
import signal
import subprocess

from core.base.journal_home import JournalHome
from core.modules.plugins.support.plugin_answer import PluginAnswer
from core.modules.plugins.support.plugin_call import PluginCall
from core.modules.plugins.support.plugin_folders import PluginFolders

PASSED_VARIABLES = ("HOME", "LANG", "LC_ALL", "TMPDIR", "USER")
PROGRAM_PATH = "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin"
SETTINGS_FILE = ".journal-settings.json"


class PluginProgram:
    """Runs a plugin's program for one event, as version 4 did: in its folder and a process group of its own, the
    line on its input, a clean environment naming its folders and settings, and a time limit past which it is
    stopped and its answer dropped, so the event goes through."""

    def __init__(self, home: JournalHome, folders: PluginFolders) -> None:
        self.home, self.folders = home, folders

    def run(self, call: PluginCall, limit_ms: int) -> PluginAnswer:
        manifest = call.manifest
        folder, data = self.folders.code(manifest.name), self.folders.data(manifest.name)
        data.mkdir(parents=True, exist_ok=True)
        (data / SETTINGS_FILE).write_text(json.dumps(dict(call.settings)))
        line = json.dumps({"v": 1, "event": call.event.name, "at": call.timestamp.text, "environment": call.environment, "data": dict(call.event.data)})
        process = subprocess.Popen([str(folder / manifest.program)], cwd=folder, env=self.environment(manifest.name, call.environment), stdin=subprocess.PIPE,
                                   stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, start_new_session=True)
        try:
            output, _ = process.communicate(line + "\n", timeout=limit_ms / 1000)
        except subprocess.TimeoutExpired:
            os.killpg(process.pid, signal.SIGKILL)
            process.communicate()
            return PluginAnswer.parsed("")
        return PluginAnswer.parsed(output) if process.returncode == 0 else PluginAnswer.parsed("")

    def environment(self, plugin_name: str, environment: str) -> dict[str, str]:
        passed = {variable: os.environ[variable] for variable in PASSED_VARIABLES if variable in os.environ}
        code, data, journal = self.folders.code(plugin_name).resolve(), self.folders.data(plugin_name).resolve(), self.home.folder.resolve()
        return {**passed, "PATH": f"{journal / 'bin'}:{PROGRAM_PATH}", "JOURNAL_ROOT": str(journal.parent), "JOURNAL_ENV": environment, "JOURNAL_PLUGIN": plugin_name,
                "JOURNAL_PLUGIN_DIR": str(code), "JOURNAL_PLUGIN_DATA": str(data), "JOURNAL_SETTINGS": str(data / SETTINGS_FILE)}
