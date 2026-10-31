from pathlib import Path

from core.base.journal_home import JournalHome


class PluginFolders:
    """Where an installed plugin's code and its kept data live in the journal's folder."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def code(self, name: str) -> Path:
        return self.home.folder / "plugins" / name

    def data(self, name: str) -> Path:
        return self.home.folder / "plugin-data" / name
