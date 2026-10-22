import subprocess

from journal.config import Config

GIT_SECONDS = 10


class RepositoryIdentity:
    """Which repository this journal belongs to, by its first commit, which every clone shares whatever address it was cloned from; and the name git knows this person by."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def first_commit(self) -> str:
        return next(iter(self.git("rev-list", "--max-parents=0", "HEAD").splitlines()), "")

    def person_name(self) -> str:
        return self.git("config", "user.name")

    def git(self, *arguments: str) -> str:
        return subprocess.run(["git", "-C", str(self.config.root), *arguments], capture_output=True, text=True, timeout=GIT_SECONDS).stdout.strip()
