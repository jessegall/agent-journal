import subprocess
from pathlib import Path

GIT_LIMIT_SECONDS = 30


class SampleRepository:
    """A small git repository on a main branch with one first commit, for the unit tests of the refactoring scripts."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder

    @classmethod
    def made(cls, folder: Path) -> "SampleRepository":
        folder.mkdir(parents=True)
        repository = cls(folder)
        repository.git("init", "--initial-branch", "main")
        repository.git("config", "user.name", "Sample")
        repository.git("config", "user.email", "sample@example.com")
        repository.git("config", "commit.gpgsign", "false")
        (folder / ".gitignore").write_text(".journal\n")
        repository.git("add", "--all")
        repository.git("commit", "-m", "The first commit")
        return repository

    def git(self, *arguments: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(["git", "-C", str(self.folder), *arguments], capture_output=True, text=True, timeout=GIT_LIMIT_SECONDS, check=False)

    def checkout(self, branch: str) -> None:
        self.git("checkout", branch)

    def tip(self, branch: str) -> str:
        return self.git("rev-parse", branch).stdout.strip()

    def expect_file(self, branch: str, path: str, text: str) -> None:
        assert self.git("show", f"{branch}:{path}").stdout == text

    def expect_branch_tip(self, branch: str, tip: str) -> None:
        assert self.tip(branch) == tip
