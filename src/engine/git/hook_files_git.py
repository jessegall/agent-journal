import subprocess
from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path

GIT_LIMIT_SECONDS = 10


@dataclass(frozen=True)
class HookFilesGit:
    """Reads tracked hook files and controls their skip-worktree index marks; each answers whether git did it, so a
    locked index or a folder that is gone never stops a sweep or a restore in the middle."""

    folder: Path

    def tracks(self, name: str | Path) -> bool:
        return self.succeeded(lambda: subprocess.run(["git", "-C", str(self.folder), "ls-files", "--error-unmatch", "--", str(name)],
                                                     capture_output=True, timeout=GIT_LIMIT_SECONDS, check=False))

    def skip_worktree(self, name: str | Path) -> bool:
        return self.succeeded(lambda: subprocess.run(["git", "-C", str(self.folder), "update-index", "--skip-worktree", "--", str(name)],
                                                     capture_output=True, timeout=GIT_LIMIT_SECONDS, check=False))

    def clear_skip_worktree(self, name: str | Path) -> bool:
        return self.succeeded(lambda: subprocess.run(["git", "-C", str(self.folder), "update-index", "--no-skip-worktree", "--", str(name)],
                                                     capture_output=True, timeout=GIT_LIMIT_SECONDS, check=False))

    @staticmethod
    def succeeded(git_call: Callable[[], subprocess.CompletedProcess[bytes]]) -> bool:
        try:
            return git_call().returncode == 0
        except (OSError, subprocess.TimeoutExpired):
            return False
