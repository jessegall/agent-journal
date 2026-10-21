import json
import os
import signal
import socket
import subprocess

from journal.config import Config
from journal.features.plugins.support.plugin_fault import PluginFault
from journal.features.plugins.support.window_missed import WindowMissed
from journal.features.plugins.support.plugin_folders import PluginFolders
from journal.features.plugins.support.plugin_settings import PluginSettings
from journal.support.plugin_tokens import PluginTokens
from journal.features.plugins.support.protocol import Protocol
from journal.models.plugin import Plugin
from journal.features.plugins.support.plugin_answer import PluginAnswer

PASSED_VARIABLES = ("HOME", "LANG", "LC_ALL", "TMPDIR", "USER")


class PluginRunner:
    """Runs a plugin's program for one event: the line on its input, in its own folder and process group, with a clean environment that names the journal and the plugin, and at most the time it is given."""

    def __init__(self, config: Config, folders: PluginFolders, tokens: PluginTokens, protocol: Protocol, settings: PluginSettings) -> None:
        self.config, self.folders, self.tokens, self.protocol, self.settings = config, folders, tokens, protocol, settings

    def ask(self, plugin: Plugin, environment: str, line: str, window: float) -> PluginAnswer:
        subscribed = self.folders.socket(plugin, environment)
        if any(s.answers for s in plugin.manifest.services) and subscribed.is_socket():
            try:
                return self.service_run(subscribed, line, window)
            except (ConnectionRefusedError, FileNotFoundError):
                return self.program_run(plugin, environment, line, window)
        return self.program_run(plugin, environment, line, window)

    def service_run(self, subscribed, line: str, window: float) -> PluginAnswer:
        with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as link:
            link.settimeout(window)
            link.connect(str(subscribed))
            try:
                link.sendall((line + "\n").encode())
                return self.protocol.parsed_answer(link.makefile("rb").readline().decode())
            except TimeoutError as late:
                raise WindowMissed(f"its service gave no answer within {window * 1000:.0f} ms, its hold window") from late
            except OSError as failed:
                raise PluginFault(f"its service did not answer on its socket: {failed}") from failed

    def program_run(self, plugin: Plugin, environment: str, line: str, window: float) -> PluginAnswer:
        folder = self.folders.folder(plugin)
        process = subprocess.Popen([str(folder / plugin.manifest.program)], cwd=folder, env=self.environment(plugin, environment), stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, start_new_session=True)
        try:
            output, err = process.communicate(line + "\n", timeout=window)
        except subprocess.TimeoutExpired as late:
            os.killpg(process.pid, signal.SIGKILL)
            process.communicate()
            raise WindowMissed(f"it gave no answer within {window * 1000:.0f} ms, its hold window") from late
        if process.returncode != 0:
            raise PluginFault(f"it exited with {process.returncode}: {err.strip()[-300:]}")
        return self.protocol.parsed_answer(output)

    def shell(self, plugin: Plugin, environment: str, line: str, seconds: float) -> subprocess.CompletedProcess:
        return subprocess.run(["sh", "-c", line], cwd=self.folders.folder(plugin), env=self.environment(plugin, environment), capture_output=True, text=True, timeout=seconds)

    def environment(self, plugin: Plugin, environment: str) -> dict[str, str]:
        settings = self.folders.settings(plugin)
        settings.write_text(json.dumps(plugin.settings))
        port = self.config.port_file.read_text().strip() if self.config.port_file.is_file() else str(self.config.port)
        return {key: os.environ[key] for key in PASSED_VARIABLES if key in os.environ} | {
            "PATH": os.pathsep.join([str(self.config.home / "bin"), "/usr/local/bin", "/opt/homebrew/bin", "/usr/bin", "/bin"]),
            "JOURNAL_ROOT": str(self.config.root),
            "JOURNAL_URL": f"http://127.0.0.1:{port}",
            "JOURNAL_ENV": environment,
            "JOURNAL_PLUGIN": plugin.name,
            "JOURNAL_PLUGIN_TOKEN": self.tokens.build(plugin.name),
            "JOURNAL_PLUGIN_DIR": str(self.folders.folder(plugin)),
            "JOURNAL_PLUGIN_DATA": str(self.folders.data(plugin)),
            "JOURNAL_SETTINGS": str(settings),
        } | self.settings.supplied(plugin)
