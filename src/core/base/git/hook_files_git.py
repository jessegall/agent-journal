import subprocess
from dataclasses import dataclass
from pathlib import Path

GIT_LIMIT_SECONDS = 10


@dataclass(frozen=True)
class HookFilesGit:
    """Reads tracked hook files and controls their skip-worktree index marks."""

    folder: Path

    def tracks(self, name: str | Path) -> bool:
        return subprocess.run(["git", "-C", str(self.folder), "ls-files", "--error-unmatch", "--", str(name)],
                              capture_output=True, timeout=GIT_LIMIT_SECONDS, check=False).returncode == 0

    def skip_worktree(self, name: str | Path) -> None:
        subprocess.run(["git", "-C", str(self.folder), "update-index", "--skip-worktree", "--", str(name)],
                       capture_output=True, timeout=GIT_LIMIT_SECONDS, check=True)

    def clear_skip_worktree(self, name: str | Path) -> None:
        subprocess.run(["git", "-C", str(self.folder), "update-index", "--no-skip-worktree", "--", str(name)],
                       capture_output=True, timeout=GIT_LIMIT_SECONDS, check=True)
