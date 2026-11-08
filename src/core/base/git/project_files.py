import subprocess
from pathlib import Path

from core.base.journal_home import JournalHome

LISTING_SECONDS = 30


class ProjectFiles:
    """The files of the project that git tracks, has staged, or would track: untracked and not ignored."""

    def __init__(self, home: JournalHome) -> None:
        self.folder = home.project_folder

    def listed(self) -> list[Path]:
        finished = subprocess.run(["git", "-C", str(self.folder), "ls-files", "--cached", "--others", "--exclude-standard", "-z"], capture_output=True, timeout=LISTING_SECONDS, check=False)
        if finished.returncode:
            return []
        names = sorted({name for name in finished.stdout.decode(errors="replace").split("\0") if name})
        return [self.folder / name for name in names if (self.folder / name).is_file()]
