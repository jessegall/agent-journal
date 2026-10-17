import json
import os
import signal
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
        if within <= 0:
            raise PluginFault("not asked: the plugins before it used the event's whole deadline")
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
