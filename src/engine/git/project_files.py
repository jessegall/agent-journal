from pathlib import Path

from engine.enums.process_kind import ProcessKind
from engine.journal.journal_home import JournalHome
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor

LISTING_SECONDS = 30


class ProjectFiles:
    """The files of the project that git tracks, has staged, or would track: untracked and not ignored."""

    def __init__(self, home: JournalHome, executor: ProcessExecutor) -> None:
        self.folder, self.executor = home.project_folder, executor

    def listed(self) -> list[Path]:
        finished = self.executor.execute(ExecutionRequest(["git", "-C", str(self.folder), "ls-files", "--cached", "--others", "--exclude-standard", "-z"], self.folder, ProcessKind.QUICK, LISTING_SECONDS))
        if not finished.succeeded:
            return []
        names = sorted({name for name in finished.stdout.split("\0") if name})
        return [self.folder / name for name in names if (self.folder / name).is_file()]
