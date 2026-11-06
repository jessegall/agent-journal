import getpass
import os
import shutil
import tempfile
import time
from pathlib import Path

from core.testing.folder_stat import FolderStat

USER_FOLDER_LIMIT_BYTES = 2 * 1024 ** 3
KEPT_FAILED_RUNS = 3
RUNNING_FOLDER_SECONDS = 3 * 3600
RUNNING_PREFIX = "running-"
FAILED_PREFIX = "failed-"
PYTEST_PREFIX = "pytest-"


class TempFolders:
    """The folder one test run keeps its temporary files in, inside the user's pytest folder. A passed run removes
    its folder, a failed run keeps it under a failed name, and only the newest failed runs are kept."""

    def __init__(self, user_folder: Path | None = None) -> None:
        self.user_folder = user_folder or self.default_user_folder()

    @staticmethod
    def default_user_folder() -> Path:
        root = Path(os.environ.get("PYTEST_DEBUG_TEMPROOT") or tempfile.gettempdir()).resolve()
        return root / f"pytest-of-{getpass.getuser()}"

    def start(self) -> Path:
        run = self.user_folder / f"{RUNNING_PREFIX}{time.strftime('%Y%m%dT%H%M%S')}-{os.getpid()}"
        run.mkdir(parents=True, exist_ok=True)
        return run

    def finish(self, run: Path, passed: bool) -> None:
        if passed:
            shutil.rmtree(run, ignore_errors=True)
        else:
            run.rename(run.with_name(FAILED_PREFIX + run.name.removeprefix(RUNNING_PREFIX)))
        self.remove_old()

    def remove_old(self) -> None:
        limit = time.time() - RUNNING_FOLDER_SECONDS
        failed = sorted(self.folders(FAILED_PREFIX), key=lambda folder: folder.name, reverse=True)
        stale = [folder for prefix in (RUNNING_PREFIX, PYTEST_PREFIX) for folder in self.folders(prefix) if FolderStat.modified_time(folder) < limit]
        for folder in failed[KEPT_FAILED_RUNS:] + stale:
            shutil.rmtree(folder, ignore_errors=True)

    def folders(self, prefix: str) -> list[Path]:
        return [folder for folder in self.user_folder.glob(prefix + "*") if folder.is_dir()]

    def size(self) -> int:
        return FolderStat.bytes(self.user_folder)
