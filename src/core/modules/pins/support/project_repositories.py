import re

from engine.journal.journal_home import JournalHome

REMOTE_URL = re.compile(r"github\.com[:/]([\w.-]+)/([\w.-]+?)(?:\.git)?\s*$", re.MULTILINE)


class ProjectRepositories:
    """The GitHub repositories this project's checkout names as its remotes, as owner/name, read from its git config,
    so only a pull request of the project's own repository is pinned."""

    def __init__(self, home: JournalHome) -> None:
        self.config = home.project_folder / ".git" / "config"

    def names(self) -> set[str]:
        if not self.config.is_file():
            return set()
        return {f"{owner}/{name}".lower() for owner, name in REMOTE_URL.findall(self.config.read_text(errors="replace"))}
