from engine.file.file_access import FileAccess
import getpass
import os
import shutil
import tempfile
import time
from pathlib import Path

from engine.process.process_ids import ProcessIds
from engine.testing.cache.folder_stat import FolderStat

USER_FOLDER_LIMIT_BYTES = 2 * 1024 ** 3
KEPT_FAILED_RUNS = 3
RUNNING_FOLDER_SECONDS = 3 * 3600
RUNNING_PREFIX = "running-"
FAILED_PREFIX = "failed-"
PYTEST_PREFIX = "pytest-"


class TempFolders:
    """The folder one test run keeps its temporary files in, inside the user's pytest folder. A passed run removes
    its folder, a failed run keeps it under a failed name, and only the newest failed runs are kept. A new run
    removes the folders of runs whose process has ended."""

    def __init__(self, user_folder: Path | None = None) -> None:
        self.user_folder = user_folder or self.default_user_folder()

    @staticmethod
    def default_user_folder() -> Path:
        root = Path(os.environ.get("PYTEST_DEBUG_TEMPROOT") or tempfile.gettempdir()).resolve()
        return root / f"pytest-of-{getpass.getuser()}"

    def start(self) -> Path:
        self.remove_dead_runs()
        self.remove_old()
        run = self.user_folder / f"{RUNNING_PREFIX}{time.strftime('%Y%m%dT%H%M%S')}-{os.getpid()}"
        FileAccess.mkdir(run, parents=True, exist_ok=True)
        return run

    def finish(self, run: Path, passed: bool) -> None:
        if passed:
            shutil.rmtree(run, ignore_errors=True)
        else:
            FileAccess.rename(run, run.with_name(FAILED_PREFIX + run.name.removeprefix(RUNNING_PREFIX)))
        self.remove_old()

    def remove_dead_runs(self) -> None:
        for folder in self.folders(RUNNING_PREFIX):
            process = folder.name.rsplit("-", 1)[-1]
            if process.isdigit() and not ProcessIds.text_exists(process):
                shutil.rmtree(folder, ignore_errors=True)

    def remove_old(self) -> None:
        limit = time.time() - RUNNING_FOLDER_SECONDS
        failed = sorted(self.folders(FAILED_PREFIX), key=lambda folder: folder.name, reverse=True)
        stale = [folder for prefix in (RUNNING_PREFIX, PYTEST_PREFIX) for folder in self.folders(prefix) if FolderStat.modified_time(folder) < limit]
        for folder in failed[KEPT_FAILED_RUNS:] + stale:
            shutil.rmtree(folder, ignore_errors=True)

    def folders(self, prefix: str) -> list[Path]:
        return [folder for folder in FileAccess.glob(self.user_folder, prefix + "*") if FileAccess.is_dir(folder)]

    def size(self) -> int:
        return FolderStat.bytes(self.user_folder)
