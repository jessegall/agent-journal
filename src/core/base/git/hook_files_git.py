import subprocess
from dataclasses import dataclass
from pathlib import Path

GIT_LIMIT_SECONDS = 10


@dataclass(frozen=True)
class HookFilesGit:
    """Checks whether Git tracks a project's hook settings files."""

    folder: Path

    def tracks(self, name: str | Path) -> bool:
        return subprocess.run(["git", "-C", str(self.folder), "ls-files", "--error-unmatch", "--", str(name)],
                              capture_output=True, timeout=GIT_LIMIT_SECONDS, check=False).returncode == 0
