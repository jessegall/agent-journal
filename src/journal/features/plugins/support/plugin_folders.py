import hashlib
import os
from pathlib import Path

from journal.config import Config
from journal.models.plugin import Plugin


class PluginFolders:
    """Where a plugin lies, the folder it keeps its own data in, and the file its settings are given in."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def folder(self, plugin: Plugin) -> Path:
        return Path(plugin.source) if plugin.linked else self.config.home / "plugins" / plugin.name

    def data(self, plugin: Plugin) -> Path:
        folder = self.config.home / "plugin-data" / plugin.name
        folder.mkdir(parents=True, exist_ok=True)
        return folder

    def settings(self, plugin: Plugin) -> Path:
        return self.data(plugin) / "settings.json"

    def socket(self, plugin: Plugin, environment: str) -> Path:
        mark = hashlib.sha1(f"{self.config.root}|{environment}|{plugin.name}".encode()).hexdigest()[:12]
        return Path(f"/tmp/journal-{os.getuid()}") / f"plugin-{mark}.sock"
