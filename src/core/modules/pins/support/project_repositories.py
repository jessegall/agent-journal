import re

from pathlib import Path

from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome

REMOTE_URL = re.compile(r"github\.com[:/]([\w.-]+)/([\w.-]+?)(?:\.git)?\s*$", re.MULTILINE)


class ProjectRepositories:
    """The GitHub repositories this project's checkout names as its remotes, as owner/name, read from its git config,
    so only a pull request of the project's own repository is pinned."""

    def __init__(self, home: JournalHome) -> None:
        self.git = home.project_folder / ".git"

    def names(self) -> set[str]:
        config = self.config()
        if config is None:
            return set()
        return {f"{owner}/{name}".lower() for owner, name in REMOTE_URL.findall(FileAccess.shared().read(config))}

    def config(self) -> Path | None:
        if self.git.is_dir():
            return self.git / "config"
        if not self.git.is_file():
            return None
        pointed = Path(FileAccess.shared().read(self.git).removeprefix("gitdir:").strip())
        common = pointed / "commondir"
        folder = (pointed / FileAccess.shared().read(common).strip()).resolve() if common.is_file() else pointed
        return folder / "config" if (folder / "config").is_file() else None
