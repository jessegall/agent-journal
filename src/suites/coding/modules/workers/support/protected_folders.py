from fnmatch import fnmatchcase
from os.path import abspath
from pathlib import Path

from engine.setting.setting_values import SettingValues
from core.modules.profiles.support.profile_files import ProfileFiles
from suites.coding.modules.workers.support.worker_settings import PROTECTED_FOLDERS


class ProtectedFolders:
    """Finds the protected folder or glob that matches a path in a checkout: the project's protected folders and
    those the agent's profile adds."""

    def __init__(self, settings: SettingValues, profiles: ProfileFiles) -> None:
        self.settings, self.profiles = settings, profiles

    def patterns(self, profile: str) -> tuple[str, ...]:
        added = self.profiles.effective(profile).protected_folders if profile else ()
        return (*self.settings.project.texts(PROTECTED_FOLDERS), *added)

    def match(self, root: str, path: str, profile: str = "") -> str:
        checkout = Path(root).resolve()
        absolute = Path(abspath(checkout / path))
        names: list[str] = []
        for candidate in (absolute, absolute.resolve()):
            if not candidate.is_relative_to(checkout):
                continue
            relative = candidate.relative_to(checkout)
            names.extend([relative.as_posix(), *(parent.as_posix() for parent in relative.parents if parent != Path("."))])
        return next((pattern for pattern in self.patterns(profile) if any(fnmatchcase(name, pattern.rstrip("/")) for name in names)), "")
