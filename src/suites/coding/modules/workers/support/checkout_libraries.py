import json
from collections.abc import Sequence
from pathlib import Path

from engine.file.file_access import FileAccess
from engine.setting.setting_values import SettingValues
from core.modules.environments.models.environment import Environment
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.library_folders import LibraryFolders
from suites.coding.modules.workers.support.worker_settings import LIBRARY_COPIES, LIBRARY_LINKS
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class CheckoutLibraries:
    """Gives a test checkout, a worker's or a plan's, the libraries of the folder it is cut from, as a worktree
    gets them: what the settings or the worker named to copy, and Composer's vendor, is copied; every other library
    is linked. A library to copy that an older checkout holds as a link is copied in its place."""

    def __init__(self, libraries: LibraryFolders, settings: SettingValues, git: WorktreeGit) -> None:
        self.libraries, self.settings, self.git = libraries, settings, git

    def worker_checkout(self, worktree: Worktree, folder: str) -> str:
        copies = {*self.settings.texts(LIBRARY_COPIES), *json.loads(worktree.library_copies)}
        return self.given(worktree.folder, folder, self.git.library_names(worktree), copies)

    def base_checkout(self, environment: Environment, folder: str) -> str:
        names = (*self.git.dependency_folders(environment.folder), *self.settings.texts(LIBRARY_LINKS), *self.settings.texts(LIBRARY_COPIES))
        return self.given(environment.folder, folder, names, set(self.settings.texts(LIBRARY_COPIES)))

    def given(self, source: str, folder: str, names: Sequence[str], copies: set[str]) -> str:
        present = [name for name in dict.fromkeys(names) if FileAccess.exists(Path(source) / name)]
        copied = [name for name in present if name in copies or self.libraries.is_composer_folder(source, name)]
        for name in copied:
            if FileAccess.is_symlink(Path(folder) / name):
                FileAccess.unlink(Path(folder) / name)
        self.libraries.restore(source, folder, [name for name in present if name not in copied], copied)
        return folder
