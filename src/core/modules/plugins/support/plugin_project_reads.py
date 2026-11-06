from pathlib import Path

from core.base.journal_home import JournalHome
from core.base.project_reads import ProjectReads
from core.modules.plugins.support.runnable_plugins import RunnablePlugins


class PluginProjectReads(ProjectReads):
    """The folders the plugins that may run declare, leaving out a wrong entry and a plugin whose files changed, so
    a changed manifest opens nothing a person has not read. The journal's own folder is never declared: it holds the
    database and every worktree."""

    def __init__(self, runnable: RunnablePlugins, home: JournalHome) -> None:
        self.runnable, self.home = runnable, home

    def folders(self, project_root: Path) -> tuple[Path, ...]:
        return tuple(dict.fromkeys(folder for runnable in self.runnable.running() for folder in runnable.manifest.project_folders(project_root, self.home.folder)))
