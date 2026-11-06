from pathlib import Path

from core.base.project_reads import ProjectReads
from core.modules.plugins.support.runnable_plugins import RunnablePlugins


class PluginProjectReads(ProjectReads):
    """The folders the plugins that may run declare, leaving out a wrong entry and a plugin whose files changed, so
    a changed manifest opens nothing a person has not read."""

    def __init__(self, runnable: RunnablePlugins) -> None:
        self.runnable = runnable

    def folders(self, project_root: Path) -> tuple[Path, ...]:
        return tuple(dict.fromkeys(folder for runnable in self.runnable.running() for folder in runnable.manifest.project_folders(project_root)))
