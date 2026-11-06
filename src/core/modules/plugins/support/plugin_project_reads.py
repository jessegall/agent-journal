from pathlib import Path

from core.base.journal_home import JournalHome
from core.base.project_reads import ProjectReads
from core.modules.plugins.support.runnable_plugins import RunnablePlugins


class PluginProjectReads(ProjectReads):
    """The project folders declared by plugins whose files have not changed."""

    def __init__(self, runnable: RunnablePlugins, home: JournalHome) -> None:
        self.runnable, self.home = runnable, home

    def folders(self, project_root: Path) -> tuple[Path, ...]:
        return tuple(dict.fromkeys(folder for runnable in self.runnable.running() for folder in runnable.manifest.project_folders(project_root, self.home.folder)))
