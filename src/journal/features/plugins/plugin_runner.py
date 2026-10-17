import json
import os
import signal
import socket
import subprocess

from journal.config import Config
from journal.features.plugins.plugin_fault import PluginFault
from journal.features.plugins.plugin_folders import PluginFolders
from journal.features.plugins.plugin_settings import PluginSettings
from journal.features.plugins.plugin_tokens import PluginTokens
from journal.features.plugins.protocol import Protocol
from journal.models.plugin import Plugin
from journal.models.plugin_answer import PluginAnswer

KEPT = ("HOME", "LANG", "LC_ALL", "TMPDIR", "USER")
"""The only variables of the journal's own that a plugin's program is given; nothing else of the shell, so no key the user holds reaches it."""


class PluginRunner:
    """Runs a plugin's program for one event: the line on its input, in its own folder and process group, with a clean environment that names the journal and the plugin, and at most the time it is given."""

    def __init__(self, config: Config, folders: PluginFolders, tokens: PluginTokens, protocol: Protocol, settings: PluginSettings) -> None:
        self.config, self.folders, self.tokens, self.protocol, self.settings = config, folders, tokens, protocol, settings

    def ask(self, plugin: Plugin, environment: str, line: str, within: float) -> PluginAnswer:
        """Its answering service on its socket when one listens, else its program."""
        if within <= 0:
            raise PluginFault("not asked: the plugins before it used the event's whole deadline")
        listening = self.folders.socket(plugin, environment)
        if any(s.get("answers") for s in plugin.manifest.get("services", ())) and listening.is_socket():
            try:
                return self.asked_service(listening, line, within)
            except (ConnectionRefusedError, FileNotFoundError):
                return self.asked_program(plugin, environment, line, within)
        return self.asked_program(plugin, environment, line, within)

    def asked_service(self, listening, line: str, within: float) -> PluginAnswer:
        """One line to the service and one back; a socket nobody listens on any more is left to the caller, which asks the program."""
        with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as link:
            link.settimeout(within)
            link.connect(str(listening))
            try:
                link.sendall((line + "\n").encode())
                return self.protocol.answer_of(link.makefile("rb").readline().decode())
            except OSError as failed:
                raise PluginFault(f"its service did not answer on its socket: {failed}") from failed

    def asked_program(self, plugin: Plugin, environment: str, line: str, within: float) -> PluginAnswer:
        folder = self.folders.of(plugin)
        process = subprocess.Popen([str(folder / plugin.manifest["program"])], cwd=folder, env=self.environment(plugin, environment), stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, start_new_session=True)
        try:
            out, err = process.communicate(line + "\n", timeout=within)
        except subprocess.TimeoutExpired:
            os.killpg(process.pid, signal.SIGKILL)
            process.communicate()
            raise PluginFault(f"it gave no answer within {within:.1f} seconds")
        if process.returncode != 0:
            raise PluginFault(f"it exited with {process.returncode}: {err.strip()[-300:]}")
        return self.protocol.answer_of(out)

    def shell(self, plugin: Plugin, environment: str, line: str, seconds: float) -> subprocess.CompletedProcess:
        """A shell line of the plugin's own, a setup step or a check, run in its folder with its environment."""
        return subprocess.run(["sh", "-c", line], cwd=self.folders.of(plugin), env=self.environment(plugin, environment), capture_output=True, text=True, timeout=seconds)

    def environment(self, plugin: Plugin, environment: str) -> dict[str, str]:
        settings = self.folders.settings(plugin)
        settings.write_text(json.dumps(plugin.settings))
        port = self.config.port_file.read_text().strip() if self.config.port_file.is_file() else str(self.config.port)
        return {key: os.environ[key] for key in KEPT if key in os.environ} | {
            "PATH": os.pathsep.join([str(self.config.home / "bin"), "/usr/local/bin", "/opt/homebrew/bin", "/usr/bin", "/bin"]),
            "JOURNAL_ROOT": str(self.config.root),
            "JOURNAL_URL": f"http://127.0.0.1:{port}",
            "JOURNAL_ENV": environment,
            "JOURNAL_PLUGIN": plugin.name,
            "JOURNAL_PLUGIN_TOKEN": self.tokens.of(plugin.name),
            "JOURNAL_PLUGIN_DIR": str(self.folders.of(plugin)),
            "JOURNAL_PLUGIN_DATA": str(self.folders.data(plugin)),
            "JOURNAL_SETTINGS": str(settings),
        } | self.settings.given(plugin)
