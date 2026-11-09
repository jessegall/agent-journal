from fnmatch import fnmatchcase
from os.path import abspath
from pathlib import Path

from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import PROTECTED_FOLDERS


class ProtectedFolders:
    """Finds the protected folder or glob that matches a path in a checkout."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def match(self, root: str, path: str) -> str:
        checkout = Path(root).resolve()
        absolute = Path(abspath(checkout / path))
        names: list[str] = []
        for candidate in (absolute, absolute.resolve()):
            if not candidate.is_relative_to(checkout):
                continue
            relative = candidate.relative_to(checkout)
            names.extend([relative.as_posix(), *(parent.as_posix() for parent in relative.parents if parent != Path("."))])
        return next((pattern for pattern in self.settings.project.texts(PROTECTED_FOLDERS)
                     if any(fnmatchcase(name, pattern.rstrip("/")) for name in names)), "")
