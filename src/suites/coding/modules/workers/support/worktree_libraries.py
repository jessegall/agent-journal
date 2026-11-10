import json
from pathlib import Path

from core.modules.environments.support.environment_rows import EnvironmentRows
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.library_folders import LibraryFolders
from suites.coding.modules.workers.support.worker_settings import LIBRARY_COPIES, LIBRARY_LINKS
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class WorktreeLibraries:
    """Finds the library folders a worktree should hold and does not, and puts them back."""

    def __init__(self, git: WorktreeGit, libraries: LibraryFolders, environments: EnvironmentRows, settings: SettingValues) -> None:
        self.git, self.libraries, self.environments, self.settings = git, libraries, environments, settings

    def missing(self, worktree: Worktree) -> tuple[str, ...]:
        return self.absent(worktree, self.environments.find(worktree.environment_id).folder, self.copied_names(worktree))

    def repair(self, worktree: Worktree) -> tuple[str, ...]:
        source = self.environments.find(worktree.environment_id).folder
        copies = self.copied_names(worktree)
        names = self.absent(worktree, source, copies)
        for name in names:
            if (Path(worktree.folder) / name).is_symlink():
                (Path(worktree.folder) / name).unlink()
        self.libraries.place(source, worktree.folder, [name for name in names if name not in copies], ())
        self.libraries.restore(source, worktree.folder, [name for name in names if name in copies])
        return names

    def absent(self, worktree: Worktree, source: str, copies: tuple[str, ...]) -> tuple[str, ...]:
        links = (*self.settings.texts(LIBRARY_LINKS), *json.loads(worktree.library_links), *self.git.dependency_folders(source))
        return tuple(name for name in dict.fromkeys((*links, *copies)) if (Path(source) / name).is_dir() and not (Path(worktree.folder) / name).exists())

    def copied_names(self, worktree: Worktree) -> tuple[str, ...]:
        return (*self.settings.texts(LIBRARY_COPIES), *json.loads(worktree.library_copies))
